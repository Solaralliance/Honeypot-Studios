#!/usr/bin/env python3
"""Lint & syntax gate — run before deploying.

1. Byte-compiles every backend Python file (syntax errors fail the gate).
2. Runs flake8 selecting real bugs (E9 syntax, F undefined/unused names).
3. Verifies frontend builds' source parses by invoking ESLint if available.

Usage: python3 scripts/lint_check.py
Exits non-zero on any failure.
"""
import py_compile
import subprocess
import sys
from pathlib import Path

REPO = Path("/app")
BACKEND = REPO / "backend"
FRONTEND = REPO / "frontend"


def check_python_syntax() -> list:
    errors = []
    for path in sorted(BACKEND.rglob("*.py")):
        if "__pycache__" in path.parts:
            continue
        try:
            py_compile.compile(str(path), doraise=True)
        except py_compile.PyCompileError as e:
            errors.append(str(e))
    return errors


def run_flake8() -> int:
    result = subprocess.run(
        [sys.executable, "-m", "flake8", "--select=E9,F", "--max-line-length=140", str(BACKEND)],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(result.stdout)
    return result.returncode


def run_eslint() -> int:
    eslint = FRONTEND / "node_modules" / ".bin" / "eslint"
    if not eslint.exists():
        print("eslint not installed in frontend — skipping JS lint")
        return 0
    result = subprocess.run(
        [str(eslint), "src", "--config", "eslint.config.mjs"],
        cwd=FRONTEND, capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(result.stdout or result.stderr)
    return result.returncode


def main() -> int:
    failed = False
    syntax_errors = check_python_syntax()
    if syntax_errors:
        failed = True
        print("PYTHON SYNTAX ERRORS:")
        for e in syntax_errors:
            print(f"  - {e}")
    if run_flake8() != 0:
        failed = True
        print("FLAKE8 FAILED")
    if run_eslint() != 0:
        failed = True
        print("ESLINT FAILED")
    print("Lint gate FAILED" if failed else "Lint gate passed: python syntax + flake8 + eslint clean.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
