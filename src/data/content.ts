// Single source of truth for site copy + contact wiring.
// Swap the TODO-marked values for the real assets and every section updates.

export const brand = {
  name: "Human Interaction",
  shortName: "h.i.",
  location: "Based in Atlanta, GA. Clients across the US and worldwide.",
};

export const contact = {
  // TODO: replace with the real Calendly (or Cal.com) booking link
  bookingUrl: "https://calendly.com/human-interaction/intro-call",
  // TODO: replace with the real WhatsApp number, digits only, country code first
  whatsapp: "https://wa.me/10000000000",
  email: "hello@humaninteraction.net", // TODO: confirm real inbox
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Web & software, built to sell",
  headlineLead: "Software that turns",
  headlineEmphasis: "visitors",
  headlineTail: "into customers.",
  sub: "Human Interaction designs and builds fast, high-end websites and software for ambitious businesses, creatives, and founders, wherever they're based.",
  primaryCta: "Book a free strategy call",
  secondaryCta: "See our work",
};

export const mission = {
  eyebrow: "Founded 2024",
  mission: "To change one person's life every day.",
  vision: "Democratize access to software.",
  note: "Human Interaction builds full-stack software for businesses and consumers alike, and helps the right audience find it, whether we built it or not.",
};

export const services = [
  {
    title: "Company websites",
    description:
      "A professional site that gives your business instant credibility and makes it easy for new customers to find you and reach out.",
  },
  {
    title: "Landing pages",
    description:
      "A focused, single page built around one job: turning an ad click or a referral into a booked call or a sale.",
  },
  {
    title: "Web apps & MVPs",
    description:
      "From idea to working product. We scope, design, and build the first version fast enough to start getting real users.",
  },
  {
    title: "E-commerce",
    description:
      "Custom storefronts and checkout flows built for speed and conversion, not another bloated theme.",
  },
  {
    title: "Portfolios",
    description:
      "A portfolio built to get creatives and freelancers noticed and hired, not just admired.",
  },
  {
    title: "Redesigns & audits",
    description:
      "Already have a site that isn't pulling its weight? We audit what's broken and rebuild it around results.",
  },
  {
    title: "Ongoing support",
    description:
      "Monthly retainers for businesses that need a dependable technical partner on call, without hiring a full-time engineer.",
  },
];

export const process = [
  {
    step: "01",
    title: "Discovery call",
    description:
      "We learn your business, your customers, and what \"success\" actually looks like in dollars, not just deliverables.",
  },
  {
    step: "02",
    title: "Proposal & scope",
    description:
      "A clear, fixed-scope plan with timeline and price. No surprise invoices, no scope creep.",
  },
  {
    step: "03",
    title: "Design & build",
    description:
      "You see progress every week. Direct access to the team building your product, not a relay through account managers.",
  },
  {
    step: "04",
    title: "Launch & grow",
    description:
      "We ship, monitor, and stick around. Most clients move into an ongoing partnership once the first project lands.",
  },
];

export const caseStudies = [
  {
    title: "Sarah Mitchell Consulting",
    description:
      "A credibility-first business site for a strategy consultancy targeting mid-market CEOs. Built to qualify a lead before they ever reach the contact form, not just look good in a pitch deck.",
    tags: ["Next.js", "Tailwind", "Lead Generation"],
    metric: "Conversion-first design system",
    image: "/work/sarah-mitchell.jpg",
    link: "https://sarahmitchellcorp.vercel.app",
  },
  {
    title: "ZipLock",
    description:
      "A SaaS platform that turns any printed QR code into a live analytics feed: city, device, and time, logged the moment someone scans it. Built end to end, from account signup to the real-time dashboard.",
    tags: ["SaaS", "Web App", "Real-time Dashboard"],
    metric: "Live product, real signups",
    image: "/work/ziplock.jpg",
    link: "https://ziplock-pi.vercel.app",
  },
  {
    title: "Vantage",
    description:
      "A Dubai luxury real estate portal built around a real three-step booking calendar with per-day availability, fully custom filters, and a WhatsApp contact flow that matches the brand.",
    tags: ["React", "Vite", "Framer Motion"],
    metric: "Real booking flow, zero native dropdowns",
    image: "/work/vantage.jpg",
    link: "https://vantage-residences-dubai.vercel.app",
  },
  {
    title: "Augere Global",
    description:
      "Corporate website for a capital raising and customer experience advisory firm operating across Africa, the Gulf, and Asia. One site, three regions, a single clear standard.",
    tags: ["HTML", "CSS", "JavaScript", "Corporate"],
    metric: "Multi-region advisory brand",
    image: "/work/augere-global.jpg",
    link: "https://augereglobal.com",
  },
];

export const differentiators = [
  {
    title: "You talk to the team building it",
    description:
      "No account-manager relay. Your questions go straight to the people actually writing the code.",
  },
  {
    title: "Lean by design",
    description:
      "No 6-week discovery phases, no junior devs learning on your dime. Most projects go from first call to live site in weeks, not quarters.",
  },
  {
    title: "Deep US market fluency",
    description:
      "Based in the US and built for it. Whether your customers are here or you're targeting the US market from anywhere in the world, we know what makes them click \"buy\" or \"book.\"",
  },
  {
    title: "Design and engineering, one team",
    description:
      "No handoff gaps between a design agency and a dev shop. The people designing it are the people shipping it.",
  },
];

export const pricingTiers = [
  {
    name: "Launch",
    price: "Starting at $1,200",
    description: "A single high-converting site to get your business online and looking the part.",
    features: [
      "Up to 5 pages",
      "Custom design, no templates",
      "Mobile-first & fast",
      "Basic SEO setup",
      "2 week turnaround",
    ],
    cta: "Book a call",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "Starting at $3,200",
    description: "For businesses that need a full site plus the systems behind it: bookings, payments, content.",
    features: [
      "Everything in Launch",
      "CMS or booking/e-commerce integration",
      "Custom animations & interactions",
      "Copywriting support",
      "30 days post-launch support",
    ],
    cta: "Book a call",
    highlighted: true,
  },
  {
    name: "Partner",
    price: "Custom",
    description: "Ongoing product or engineering partnership for businesses that need a dependable dev team on call.",
    features: [
      "Dedicated monthly hours",
      "Product & web application work",
      "Priority response time",
      "Direct Slack/WhatsApp access",
      "Cancel anytime",
    ],
    cta: "Let's talk",
    highlighted: false,
  },
];

export const faqs = [
  {
    question: "How fast can you actually turn a project around?",
    answer:
      "Most marketing sites ship in 2 to 3 weeks from signed scope. Web apps and MVPs typically run 4 to 8 weeks depending on scope. You'll get a firm timeline before any work starts.",
  },
  {
    question: "Who do we actually talk to during the project?",
    answer:
      "You'll have one dedicated point of contact for scope, timeline, and updates, backed by the team actually building your product. Direct access throughout, not a ticket queue.",
  },
  {
    question: "Do we own the code and the design when it's done?",
    answer:
      "Yes, fully. Once the final invoice is paid, all source code, design files, and assets are yours outright.",
  },
  {
    question: "What if we need changes after launch?",
    answer:
      "Every project includes a post-launch support window. After that, most clients move to a small monthly retainer so there's always someone on call, or you can come back on a project by project basis.",
  },
  {
    question: "We're not a tech company. Can you still help us?",
    answer:
      "That's most of who we work with: service businesses, creatives, and founders who need software to just work and drive results, without having to speak \"developer.\"",
  },
  {
    question: "Do you work with clients outside the US?",
    answer:
      "Yes. We're US-based and know the US market inside and out, but we work with clients everywhere. Time zones and borders aren't a dealbreaker, a good project is.",
  },
];
