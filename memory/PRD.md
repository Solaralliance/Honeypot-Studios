# HoneyPot Studio — PRD

## Original problem statement
Marketing site for HoneyPot website design studio: live website showcase carousel, custom build offers with set pricing (Landing $499 / Tradie $999 / Custom $2,499 AUD), animated 0→200+ websites counter, scroll-reveal headings, simple non-annoying contact form, digital marketing + social media management services, blog with clickable cards and matching photos, looping shine/glow CTA button borders (speed up on hover), shimmer glow card borders, SEO standards, OWASP security, security & privacy page disclosing GA4/Meta Pixel/Search Console/Bing Webmaster/Resend tracking, secrets kept off git, lint + secret-scan scripts, purposeful analytics only, SVG/vector decoration, advanced image metadata. Later: 4 real portfolio projects supplied (Device & Conquer, Areecivil Constructions, Solar Alliance, Chisolson Residential) + favicon.

## User answers (discovery)
- Pricing: Landing $499 / Tradie $999 / Custom $2,499 (AUD)
- Audience: mix of tradies, small business, startups
- Service area: Australia-wide, fully remote
- Contact: form only
- Portfolio: real client sites (4 screenshots supplied and integrated)

## Architecture
- Frontend: React (CRA/craco), Tailwind, framer-motion, swiper (coverflow carousel), react-countup, react-helmet-async, sonner, shadcn ui
- Backend: FastAPI + MongoDB (motor). Routes: /api/health, /api/contact (rate-limit 5/10min/IP via X-Forwarded-For, honeypot, Resend proxy email to owner + confirmation), /api/posts, /api/posts/{slug} (seeded from blog_data.py), /api/analytics/event (allow-listed events)
- Email: Emergent managed Resend proxy (EMERGENT_EMAIL_KEY in backend/.env), guardrail gate on every send
- Scripts: /app/scripts/secret_scan.py (pre-commit/deploy secret gate), /app/scripts/lint_check.py (py_compile + flake8 E9/F + eslint flat config)
- SEO: index.html meta/OG/Twitter/JSON-LD + per-page Helmet; favicon.svg/ico/apple-touch-icon + site.webmanifest

## Implemented (2026-10-05, update 3)
- Case study pages at /work/:slug for all 4 projects: overview, challenge, what-we-built, stack chips, results grid, testimonial block, related projects, CaseStudy JSON-LD. Results/quotes are HONEST placeholder slots ("—" + visible disclaimer, quote card says "coming soon") — no fabricated testimonials; owner to supply real figures/quotes
- Carousel cards now link "Full case study" + "Live preview"
- scripts/build_sitemap.py generates public/sitemap.xml from real content sources (blog_data.py slugs + portfolio.js ids) — 11 URLs; public/robots.txt points to it; both serve 200 (application/xml)
- STILL PENDING FROM USER: real business email for OWNER_EMAIL (currently test sink delivered@resend.dev), GA4 Measurement ID, Meta Pixel ID, real results + client quotes per project

## Implemented (2026-10-05, update 2)
- Navbar Services dropdown: 7 icon-button entries (landing, tradie, custom, CRMs & web apps, digital marketing, social media, hosting) with prices, glass panel; mobile menu mirrors it
- Working sitemap: nav + footer links point to real anchors (#who, #services, #build-types, #pricing, #extras, #work, #contact) with scroll-mt for fixed header
- "Built for where you're at" section: 3 audience paths (no website yet / needs revamp / marketing pro needing CRM) that preselect the matching service in the contact form via custom event
- "What we build" section: 10 types with icons — landing pages, tradie sites, e-commerce, CRMs & client portals, booking systems, dashboards/web apps, SaaS MVPs, real estate portals, blogs, hospitality
- Pricing section: packages $548 / $1,048 / $2,548 (+$49 applied), ongoing row (DM $448/mo, SM $498/mo, Hosting & Care $29/mo), itemised Extras list (revamps from $399, CRM builds from $1,999, etc.)
- Backend ALLOWED_SERVICES extended: crm-web-app, website-revamp, website-hosting
- GradientText component: fixes Chromium bg-clip:text glyph clipping (padding + trailing nbsp + line-height combo, verified in-browser)

## Implemented (2026-10-05)
- Neon cyber dark theme from user's brand assets (Unbounded + IBM Plex Sans)
- Hero, Stats (0→200+ counter), Services bento with pricing (5 services incl. Digital Marketing $399/mo, Social Media $449/mo), Swiper showcase carousel with 4 REAL client projects, Blog preview, Contact form, Footer
- Looping glow CTA borders (speed up on hover), shimmer card borders, scroll dropdown headings, floating SVG hexagons, noise + hex-grid textures
- Blog: 4 posts w/ full content, images + rich alt metadata, category filters, per-post JSON-LD
- Security & Privacy page disclosing GA4, Meta Pixel, Search Console, Bing Webmaster, Resend + first-party analytics
- OWASP headers middleware, rate limiting, honeypot, escaped server-side email templates, CORS narrowed
- Secret scan + lint gate scripts (both passing); .env git-ignored

## Verified
- curl: health/posts/post/contact/analytics, 422 bad event, honeypot fake-ok, favicon 200s
- E2E screenshots: hero, counter 0→200+, carousel navigation, form submit + success toast, blog list/post, privacy page, mobile 390px
- Email pipeline: 202s confirmed; proxy 429 under burst handled gracefully (enquiry persisted in Mongo regardless)

## Pending / needs from user
- OWNER_EMAIL in backend/.env is the Resend test sink (delivered@resend.dev) — REPLACE with the studio's real inbox for production
- Canonical domain set to https://honeypotstudio.com.au — update when real domain confirmed
- GA4 / Meta Pixel IDs not yet supplied — snippet slots documented on privacy page; add IDs when available

## Backlog
- P0: real OWNER_EMAIL; real domain/canonical
- P1: GA4 + Meta Pixel snippet injection once IDs provided; sitemap.xml + robots.txt routes; more portfolio projects
- P2: admin view for enquiries; blog CMS editing; case-study pages per project
