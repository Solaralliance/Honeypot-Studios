#!/usr/bin/env python3
"""Secret scanner — run before every commit/deploy.

Scans the repo for hardcoded credentials and verifies .env files are
git-ignored. Exits 1 on any finding so it can gate a deploy pipeline.

Usage: python3 scripts/secret_scan.py [repo_root]
"""
import re
import sys
from pathlib import Path

REPO = Path(sys.argv[1] if len(sys.argv) > 1 else "/app").resolve()

SKIP_DIRS = {"node_modules", ".git", "build", "dist", "__pycache__", ".next", "venv", ".venv"}
SCAN_EXT = {".py", ".js", ".jsx", ".ts", ".tsx", ".json", ".html", ".css", ".yml", ".yaml", ".md", ".txt", ".sh"}

PATTERNS = {
    "AWS access key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    "Stripe live key": re.compile(r"\bsk_live_[0-9a-zA-Z]{16,}\b"),
    "Stripe test key (still keep in env)": re.compile(r"\bsk_test_[0-9a-zA-Z]{16,}\b"),
    "Resend API key": re.compile(r"\bre_[0-9a-zA-Z]{20,}\b"),
    "Generic bearer/API token assignment": re.compile(r"(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['\"][^'\"]{16,}['\"]"),
    "Private key block": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "JWT literal": re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b"),
}

# Files/keys that legitimately hold secrets but must never be committed.
ENV_FILES = {".env", ".env.local", ".env.production"}


def scan_file(path: Path) -> list:
    findings = []
    try:
        text = path.read_text(errors="ignore")
    except OSError:
        return findings
    for name, pattern in PATTERNS.items():
        for i, line in enumerate(text.splitlines(), 1):
            if pattern.search(line):
                findings.append(f"{path.relative_to(REPO)}:{i}: {name}")
    return findings


def main() -> int:
    findings = []

    gitignore = REPO / ".gitignore"
    ignored = gitignore.read_text(errors="ignore") if gitignore.exists() else ""
    if ".env" not in ignored:
        findings.append(".gitignore: '.env' is NOT ignored — secrets could be committed")

    for path in sorted(REPO.rglob("*")):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if not path.is_file():
            continue
        if path.name in ENV_FILES:
            # .env files are expected to hold secrets; just confirm they are ignored
            if ".env" not in ignored:
                findings.append(f"{path.relative_to(REPO)}: env file present but not git-ignored")
            continue
        if path.suffix.lower() in SCAN_EXT:
            findings.extend(scan_file(path))

    if findings:
        print("SECRET SCAN FAILED")
        for f in findings:
            print(f"  - {f}")
        return 1
    print("Secret scan passed: no hardcoded secrets found, .env is git-ignored.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
