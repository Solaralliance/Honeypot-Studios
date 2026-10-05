#!/usr/bin/env python3
"""Sitemap generator — rebuilds frontend/public/sitemap.xml from the real
content sources (blog posts in backend/blog_data.py, portfolio projects in
frontend/src/data/portfolio.js) so Google/Bing always get accurate URLs.

Run after adding a blog post or portfolio project:
    python3 scripts/build_sitemap.py
Also run by CI before deploy.
"""
import re
import sys
from datetime import date
from pathlib import Path

REPO = Path("/app")
DOMAIN = "https://honeypotstudio.com.au"

STATIC_ROUTES = [
    ("/", "1.0", "weekly"),
    ("/blog", "0.8", "weekly"),
    ("/privacy-security", "0.3", "yearly"),
]


def blog_slugs() -> list:
    text = (REPO / "backend" / "blog_data.py").read_text()
    return re.findall(r'"slug":\s*"([a-z0-9-]+)"', text)


def project_ids() -> list:
    text = (REPO / "frontend" / "src" / "data" / "portfolio.js").read_text()
    return re.findall(r'id:\s*"([a-z0-9-]+)"', text)


def url_entry(loc: str, priority: str, changefreq: str, lastmod: str) -> str:
    return (
        "  <url>\n"
        f"    <loc>{DOMAIN}{loc}</loc>\n"
        f"    <lastmod>{lastmod}</lastmod>\n"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>"
    )


def main() -> int:
    today = date.today().isoformat()
    entries = [url_entry(r, p, c, today) for r, p, c in STATIC_ROUTES]
    entries += [url_entry(f"/blog/{s}", "0.7", "monthly", today) for s in blog_slugs()]
    entries += [url_entry(f"/work/{p}", "0.8", "monthly", today) for p in project_ids()]

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    out = REPO / "frontend" / "public" / "sitemap.xml"
    out.write_text(xml)
    print(f"sitemap.xml written: {len(entries)} URLs -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
