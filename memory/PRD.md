# HoneyPot Studio — Product Requirements & Delivery Record

## Original problem statement
Build a website for HoneyPot Studio, an Australian web development and digital marketing agency. It must showcase live work, transparent pricing, a 200+ websites-built counter, services, educational blog content, a clean contact form, security/privacy disclosures, OWASP-aligned controls, advanced SEO/metadata, and deployment compatibility with Vercel and Cloudflare.

## Current product direction
- Brand: HoneyPot Studio
- Canonical host: `https://myscapez.com`
- Audience: Australian tradies, small businesses, startups and marketing teams
- Public contact: `honeypotweb@proton.me` / `0480 733 936`
- Visual system: dark neon cyber aesthetic, glass panels, fuchsia/cyan accents, Unbounded + IBM Plex Sans
- Latest header decision: keep the HoneyPot text wordmark; remove the image logo from the top-left header

## Core offers
- Landing Page Build: $548 AUD one-time
- Tradie Website Build: $1,048 AUD one-time
- Custom Website Build: $2,548 AUD one-time
- Digital Marketing: from $448/month
- Social Media Management: from $498/month
- Website Hosting & Care: from $29/month
- CRM / Web App: from $1,999

## Architecture
- Frontend: React (CRA/craco), React Router, Tailwind, Framer Motion, Swiper, react-countup, react-helmet-async, Sonner, Shadcn UI
- Backend: FastAPI + MongoDB (Motor)
- Email: Emergent managed Resend proxy with fixed server templates and a mandatory content-safety gate
- Payments: Stripe claimable sandbox, server-side Price lookup keys, Checkout Sessions, signed webhook, Mongo transaction ledger
- Hosting target: Vercel app with Cloudflare DNS/edge
- SEO: route-aware Helmet metadata, canonical host `https://myscapez.com`, JSON-LD, robots.txt and generated sitemap.xml

## Implemented — 2026-10-05 (current update)

### Stripe website checkout
- Added interactive `Buy a Website` section with the three fixed AUD packages.
- Recommends contacting HoneyPot Studio first, while allowing direct secure checkout.
- Browser sends only a server allow-listed package lookup key; prices are loaded from Stripe server-side.
- Checkout redirects only to explicit allowed origins.
- Transaction is written to Mongo before redirect and status is confirmed from Stripe before onboarding unlocks.
- Stripe webhook signature verification and idempotent payment fulfilment are implemented.
- Invalid package, invalid origin and forged webhook paths return safe errors.
- Current tax mode: Stripe calculates tax at checkout; the business files/remits it.
- Managed tax/compliance mode was attempted, but Stripe marks the Website Design tax code as ineligible.

### Paid-customer onboarding
- Payment success page polls a minimal status endpoint and unlocks onboarding only after `paid`.
- Each checkout receives a random access nonce stored only as a hash.
- Onboarding links use a separate HMAC secret, not the Stripe webhook secret.
- Four-step questionnaire covers business basics, services/customers, brand voice and website goals.
- Questionnaire messaging: customers run their business; HoneyPot handles the agreed online presence.
- Answers are stored in Mongo against the paid Stripe session.
- Paid customers receive a professional onboarding email with the questionnaire link.

### Resend contact and offer email
- Contact submission saves the enquiry first, then sends an owner alert and customer confirmation.
- Resend message IDs and accepted/failed status are stored without risking the saved lead.
- Owner inbox is now `honeypotweb@proton.me`.
- Added a returning-visitor 20% offer panel.
- Managed Resend is not used for recurring promotional blasts.
- The compliant offer flow is explicitly requested by a previous enquirer, fixed-template, rate-limited and limited to one send per 30 days.
- Offer email includes inline HoneyPot SVG artwork, return-to-site CTA, contact form, phone, reply email, privacy link and unsubscribe link.
- Offer email contains no tracking pixel.
- Unsubscribe is non-enumerating and does not block essential project/payment/onboarding email.

### Learn Hub
- Added `/learn` poster-style article hub with relevant photography and five complete educational pages:
  - `/learn/seo-geo-aeo`
  - `/learn/vercel-cloudflare`
  - `/learn/resend-email`
  - `/learn/forms-and-owasp`
  - `/learn/analytics-consent`
- Content incorporates source corrections on sitemap canonical strength, Cloudflare DNS-only mail records, Resend verification timing, OWASP Top 10:2025 and OAIC APP 3.
- No exploit payloads or attack strings are published.
- Every article includes internal links, advanced metadata, image alt text and an education/legal disclaimer.

### Privacy-conscious analytics
- Added explicit analytics consent banner.
- First-party events do not send until accepted in the browser.
- Standard events include learn page views, form starts/submits, checkout starts/paid and onboarding submits.
- Backend stores allow-listed event names and bounded metadata only—no names, emails, messages or fingerprints.
- Analytics rows auto-expire after 90 days.

### Legal, privacy and contact
- Added `/terms` with project scope, payment, cancellation, ownership, customer content and results wording.
- Expanded `/privacy-security` to name GA4, Meta Pixel, Search Console, Bing Webmaster, Resend, Stripe, Vercel and Cloudflare.
- Privacy page explains consent, contact/enquiry collection, the returning-visitor marker, offer unsubscribe and OAIC APP 3 considerations.
- Footer links Terms, Privacy, Unsubscribe, phone and email.
- User should have final privacy and terms wording reviewed by an Australian solicitor.

### Existing site experience retained
- Hero, 200+ counter, services, build types, pricing, portfolio carousel, case studies, blog, contact and footer.
- Portfolio live links include Areecivil Constructions and Solar Alliance where supplied.
- Original custom service artwork exists under `frontend/public/images/services/`.
- Header image logo removed; footer branding remains.

## API routes
- `GET /api/health`
- `POST /api/contact`
- `GET /api/posts`
- `GET /api/posts/{slug}`
- `GET /api/learn`
- `GET /api/learn/{slug}`
- `POST /api/analytics/event`
- `GET /api/payments/packages`
- `POST /api/payments/checkout`
- `GET /api/payments/status/{session_id}`
- `GET /api/payments/onboarding-access/{session_id}`
- `GET /api/onboarding/{token}`
- `POST /api/onboarding/{token}`
- `POST /api/stripe/webhook`
- `POST /api/offers/claim`
- `POST /api/offers/unsubscribe/{token}`

## MongoDB models
- `enquiries`: contact fields, created time, email delivery states/IDs, optional offer/unsubscribe state
- `payment_transactions`: Stripe session, package, amount, status, payment status, origin, tax mode, onboarding access hash/email state
- `onboarding_questionnaires`: paid session, package, structured answers, submission time
- `analytics`: allow-listed event, path, bounded metadata, timestamp, TTL expiry
- `rate_limits`: shared fixed-window counters with TTL
- `blog_posts`: blog article content and image metadata
- `learn_posts`: educational article content, links, FAQs and image metadata

## Security status
- Read-only security audit rerun after remediation: **PASS — no material functional issues found**.
- Mongo-backed per-client and global throttles protect contact, offer and analytics routes.
- Caller-controlled `X-Forwarded-For` is not trusted.
- CORS uses explicit origins only.
- Stripe webhook signature verification, price integrity, onboarding nonce/HMAC and Mongo `_id` projections verified.
- Input validation, server-side email escaping, honeypot and secret scanning remain active.
- Operational note: confirm production ingress overwrites `X-Real-IP`.

## Verification
- Testing agent: 10/10 public API tests passed before final fixes; final focused regression: 9/9 passed (live contact resend excluded to avoid duplicate owner email).
- Lint gate passed: Python syntax, flake8 and ESLint.
- Secret scan passed; `.env` remains git-ignored.
- Stripe Checkout Session creation verified against Stripe test mode.
- Pending status, invalid origin/package, forged webhook, CORS allow/reject and signed onboarding access verified.
- Simulated paid transaction verified the full onboarding access, questionnaire save and completion lifecycle.
- Offer email message ID storage and unsubscribe lifecycle verified with Resend's delivered test recipient.
- Learn pages, terms/privacy, single route canonical and 18-URL sitemap verified.
- Browser automation verified purchase UI, responsive layout, consent, Learn Hub and payment error fallback.
- Stripe-hosted card completion could not be automated because Stripe hCaptcha blocked the test browser; manual card completion remains the final live-flow check.

## Prioritised roadmap

### P0 — before real payments
- Claim the Stripe sandbox/account and complete Stripe identity/KYC steps.
- Enable Stripe Tax because the selected mode calculates tax at checkout.
- Complete one manual test payment with Stripe test card `4242 4242 4242 4242`, then verify paid success -> onboarding -> email.
- Confirm production ingress overwrites `X-Real-IP`.

### P1
- Add real GA4 Measurement ID and Meta Pixel ID only when supplied; keep consent gating.
- Submit `https://myscapez.com/sitemap.xml` in Google Search Console after all public URLs return 200 on the live host.
- Have an Australian solicitor review privacy, collection notice and Terms wording.
- Replace case-study result/testimonial placeholders with supplied real outcomes and quotes.

### P2 / backlog
- Admin view for enquiries, paid orders and onboarding submissions.
- Blog/learn CMS editing workflow.
- Resend signed webhook for delivered/bounced status if compatible credentials become available.
- Alerting dashboard for global abuse-rate caps and email delivery failures.

## Important compliance boundary
- No covert fingerprinting, keystroke recording, attack payload publishing or recurring promotional broadcast has been built.
- Promotional offers require an explicit request by a previous enquirer and include privacy/unsubscribe controls.