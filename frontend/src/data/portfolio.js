/**
 * Portfolio projects + full case-study content.
 *
 * HONESTY RULE: `results` and `quote` entries marked `placeholder: true`
 * are NOT real client outcomes — they are labelled slots the studio owner
 * replaces with real figures and testimonials. Never present placeholders
 * as verified claims.
 */

export const PROJECTS = [
  {
    id: "device-and-conquer",
    name: "Device & Conquer",
    type: "E-commerce Concept",
    tagline: "Stripe-ready checkout flow with Australian pricing",
    description:
      "A concept storefront for premium refurbished iPhones and MacBooks — transparent grading, trade-in flow and a checkout built to convert on mobile.",
    tags: ["E-commerce", "Stripe-Ready", "Mobile-First"],
    image: {
      url: "https://customer-assets-jai6qajn.emergentagent.net/job_website-craft-labs/artifacts/y7j2kuzy_IMG_3287.jpeg",
      alt: "Device and Conquer mobile storefront — bold lime and black design with 'Find your next device' headline and shop devices call-to-action",
      width: 912,
      height: 1632,
    },
    caseStudy: {
      overview:
        "Device & Conquer sells premium refurbished Apple devices. Refurbished retail lives and dies on trust — buyers need to know exactly what condition they're getting, and most second-hand stores look second-hand themselves.",
      challenge:
        "The brief: make buying a refurbished phone feel as confident as buying new. That meant transparent condition grading, clear Australian pricing with GST included, and a checkout that doesn't leak mobile buyers.",
      built: [
        "Bold storefront design with a lime-on-black identity that stands out from every white-and-grey competitor",
        "Condition grading explained in plain language on every product card",
        "Stripe-ready checkout flow with Australian dollar pricing and GST handled correctly",
        "Trade-in pathway so customers can offset a new device against their old one",
        "Mobile-first layout — most refurbished buyers browse on the phone they're replacing",
      ],
      stack: ["Custom e-commerce build", "Stripe payments", "Cloudflare DNS + CDN", "GA4 conversion tracking"],
      results: [
        { label: "Checkout completion", value: "—", placeholder: true, note: "Awaiting real figure from client analytics" },
        { label: "Mobile conversion rate", value: "—", placeholder: true, note: "Awaiting real figure from client analytics" },
        { label: "Page load (mobile)", value: "—", placeholder: true, note: "Awaiting Lighthouse measurement" },
      ],
      quote: null, // placeholder — client testimonial to be supplied by the studio
    },
  },
  {
    id: "areecivil-constructions",
    name: "Areecivil Constructions",
    type: "Tradie Website",
    tagline: "Excavation, civil concreting and underground pipeline",
    description:
      "A South East Queensland civil contractor site — modern design, fully responsive, SEO optimised and fast. One contractor, three civil trades, zero confusion.",
    tags: ["Tradie Site", "SEO Optimised", "Responsive"],
    url: "https://areecivilconstructions.com.au",
    image: {
      url: "https://customer-assets-jai6qajn.emergentagent.net/job_website-craft-labs/artifacts/u4hl9sqf_E700211A-7D8E-47A8-BEC1-2CABAFA5B383.png",
      alt: "Areecivil Constructions website shown on laptop and phone — dark professional design with excavation hero image and 'Excavate. Pour. Lay Pipe.' headline",
      width: 1536,
      height: 1024,
    },
    caseStudy: {
      overview:
        "Areecivil Constructions is a South East Queensland civil contractor covering three trades: excavation, civil concreting and underground pipeline. Their work is serious commercial and council-grade — their website needed to look like it.",
      challenge:
        "Three distinct services under one contractor risks confusing visitors. The site had to route each visitor — builder, council project manager, developer — to the right trade in one click, and make requesting a quote effortless.",
      built: [
        "'Excavate. Pour. Lay Pipe.' positioning that says all three trades in four words",
        "Dedicated service pathways so each visitor self-selects their trade immediately",
        "Quote request flow with service type, location and project details captured upfront",
        "Local SEO structure targeting South East Queensland civil works searches",
        "Fully responsive build — site managers check contractors from the ute, not a desk",
      ],
      stack: ["Tradie website package", "Local SEO setup", "Vercel hosting", "Cloudflare DNS", "Google Business Profile ready"],
      results: [
        { label: "Quote requests", value: "—", placeholder: true, note: "Awaiting real figure from client" },
        { label: "Local search ranking", value: "—", placeholder: true, note: "Awaiting Search Console data" },
        { label: "Page load (mobile)", value: "—", placeholder: true, note: "Awaiting Lighthouse measurement" },
      ],
      quote: null, // placeholder — client testimonial to be supplied by the studio
    },
  },
  {
    id: "solar-alliance",
    name: "Solar Alliance",
    type: "Lead Generation",
    tagline: "Government solar and battery upgrades made simple",
    description:
      "A high-converting quote funnel helping Australian homeowners compare trusted local installers and maximise available government rebates.",
    tags: ["Lead Gen", "Quote Funnel", "Conversion"],
    image: {
      url: "https://customer-assets-jai6qajn.emergentagent.net/job_website-craft-labs/artifacts/m9i3hdhb_solar-alliance-homepage-desktop.jpeg",
      alt: "Solar Alliance homepage — bright orange and white design with rooftop solar panels, free quote form and government rebate messaging",
      width: 1527,
      height: 1024,
    },
    caseStudy: {
      overview:
        "Solar Alliance connects Australian homeowners with trusted local solar installers and helps them claim government rebates. In solar lead-gen, the quote form IS the business — every field of friction costs money.",
      challenge:
        "Homeowners are wary of solar cowboys. The funnel had to build trust fast (rebates, accredited installers, no-obligation framing) while keeping the quote form short enough to finish on a phone.",
      built: [
        "Multi-step quote funnel that collects address, roof and usage details without feeling like an interrogation",
        "Government rebate messaging woven through the page — the #1 motivator for solar buyers",
        "Trust signals above the fold: trusted installer network, no-obligation quotes, testimonials section",
        "Bright, optimistic design system that reads 'savings' rather than 'sales'",
        "Analytics on every funnel step so drop-off points are visible and fixable",
      ],
      stack: ["Lead-generation build", "Multi-step form", "GA4 funnel tracking", "Meta Pixel retargeting", "Cloudflare CDN"],
      results: [
        { label: "Quote form completion", value: "—", placeholder: true, note: "Awaiting real figure from client analytics" },
        { label: "Cost per lead", value: "—", placeholder: true, note: "Awaiting ad account data" },
        { label: "Page load (mobile)", value: "—", placeholder: true, note: "Awaiting Lighthouse measurement" },
      ],
      quote: null, // placeholder — client testimonial to be supplied by the studio
    },
  },
  {
    id: "chisolson-residential",
    name: "Chisolson Residential",
    type: "Real Estate",
    tagline: "Gold Coast residential property, personally handled",
    description:
      "An elegant property specialist site for the Gold Coast — appraisal requests, property showcases and a personal brand front and centre.",
    tags: ["Real Estate", "Appraisal Funnel", "Premium Design"],
    image: {
      url: "https://customer-assets-jai6qajn.emergentagent.net/job_website-craft-labs/artifacts/baqa1sax_chris-holson-residential-mobile.jpeg",
      alt: "Chisolson Residential mobile site — luxury Gold Coast waterfront home with 'Property, personally handled' headline and request an appraisal button",
      width: 852,
      height: 1920,
    },
    caseStudy: {
      overview:
        "Chisolson Residential is a boutique Gold Coast property specialist. In prestige real estate the agent IS the brand — sellers choose a person, not an office — so the site puts the personal brand front and centre.",
      challenge:
        "Competing with franchise agencies that outspend on ads means out-classing them on presentation. The site needed to win the appraisal request: the single action that starts every listing relationship.",
      built: [
        "'Property, personally handled' positioning that separates boutique service from franchise volume",
        "Appraisal request funnel — the one CTA that matters, repeated without nagging",
        "Property showcase layouts that let waterfront photography do the talking",
        "Elegant, editorial typography suited to prestige listings",
        "Mobile-perfect experience — vendors browse agents on their phones at night",
      ],
      stack: ["Custom design build", "Appraisal funnel", "Local SEO", "Vercel hosting", "Cloudflare DNS"],
      results: [
        { label: "Appraisal requests", value: "—", placeholder: true, note: "Awaiting real figure from client" },
        { label: "Enquiry quality", value: "—", placeholder: true, note: "Awaiting client feedback" },
        { label: "Page load (mobile)", value: "—", placeholder: true, note: "Awaiting Lighthouse measurement" },
      ],
      quote: null, // placeholder — client testimonial to be supplied by the studio
    },
  },
];

export const getProject = (id) => PROJECTS.find((p) => p.id === id);
