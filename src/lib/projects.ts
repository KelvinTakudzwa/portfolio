export type Stat = { label: string; value: string };
export type Section = { heading: string; body: string[] };
export type Media = { src: string; alt: string; caption: string };

export type Project = {
  slug: string;
  node: string;
  category: string;
  title: string;
  tagline: string;
  status: string;
  stack: string[];
  stats: Stat[];
  sections: Section[];
  media?: Media[];
};

export const projects: Project[] = [
  {
    slug: "solar-mini-grid-diagnostics",
    node: "01",
    category: "Core · Dissertation",
    title: "Real-Time ML Diagnostics for Solar Mini-Grids",
    tagline:
      "Predictive maintenance for off-grid solar, catching failing equipment before it fails, built for a region where nobody can just drive out and check.",
    status: "First Class dissertation",
    stack: [
      "ESP32",
      "MQTTS / Mosquitto",
      "Python",
      "scikit-learn",
      "FastAPI",
      "Node.js / Express",
      "Socket.IO",
      "MySQL",
      "React",
      "Tailwind",
      "Docker Compose",
      "Nginx",
    ],
    stats: [
      { label: "F1-weighted", value: "~0.85" },
      { label: "Normal samples trained", value: "50,000" },
      { label: "Sensor channels", value: "13 / min" },
      { label: "Fault classes", value: "5" },
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "Off-grid solar mini-grids across Zimbabwe and the wider region run largely unmonitored. Faults (partial shading, inverter overload, deep discharge, dead sensors) surface only after the system has already degraded, by which point it's a truck-roll and a village without power.",
          "Rule-based threshold alarms exist but generate too many false positives to be trusted, and there's no accessible, real-time way to tell normal wear from a developing fault on hardware this cheap and this remote.",
        ],
      },
      {
        heading: "Approach",
        body: [
          "A five-layer pipeline, containerised end to end. At the edge, an ESP32 node reads 13 sensor channels a minute: PV/battery voltage and current, AC power via a PZEM-004T, irradiance, battery temperature, RTC-stamped. On a network outage the firmware buffers to LittleFS and replays with an offline-buffered flag rather than dropping data.",
          "Telemetry moves over MQTTS (TLS 1.2, QoS 1) through an Eclipse Mosquitto broker. Inference is a two-stage hierarchical classifier rather than a single model: an Isolation Forest trained on 50,000 normal-operation samples acts as an unsupervised anomaly gate, cutting false-positive rate and CPU load before anything reaches a Random Forest 5-class fault classifier behind it, covering partial shading, inverter overload, deep discharge, dead sensor, or uncertain-anomaly below 50% confidence.",
          "Tuned via GridSearchCV over 16 hyperparameter combinations, 5-fold CV, ~0.85 F1-weighted on held-out data. Chemistry-aware normalisation derives state-of-charge bounds per battery type (lead-acid, AGM, lithium, LiFePO4, NMC) rather than assuming one chemistry fits all.",
          "A FastAPI ML engine sits behind a Node/Express backend, pushing results to a React + Recharts dashboard over Socket.IO. Weekly APScheduler retraining folds the last 30 days of validated normal readings back into the training set and logs RMSE/MAE per cycle, so the model keeps calibrating itself against the specific installation it's watching.",
        ],
      },
      {
        heading: "Validation",
        body: [
          "The evaluation module benchmarks the classifier against a rule-based baseline, reports per-class precision/recall/F1 and confusion matrices, measures MQTT delivery rate and latency/jitter under injected network-outage conditions, and cross-checks against NREL PVDAQ real-world photovoltaic measurement data, not just the synthetic training set.",
          "Training data itself is physics-informed: a 365-day Southern-Hemisphere solar profile, diurnal temperature modelling, probabilistic cloud-blocking events, and a battery-ageing model with fault-accelerated degradation.",
        ],
      },
    ],
  },
  {
    slug: "silicaguard",
    node: "02",
    category: "Core · Award",
    title: "SilicaGuard",
    tagline:
      "A working occupational-lung-health screening system for Zimbabwe's artisanal gold miners: offline mobile, USSD/SMS, and a clinical dashboard. 1st place, Cimas Healthathon 3.0.",
    status: "Shipped · 1st Place, Cimas Healthathon 3.0",
    stack: [
      "React Native / Expo",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL / Supabase",
      "Africa's Talking (USSD/SMS)",
      "Gemini 2.5 Flash",
    ],
    stats: [
      { label: "Prize", value: "$3,500" },
      { label: "Placed", value: "1st of 372" },
      { label: "Commits", value: "114" },
      { label: "Team", value: "3" },
    ],
    media: [
      {
        src: "/images/healthathon-cheque.jpg",
        alt: "SilicaGuard team receiving the 1st Position cheque for $3,500 at Cimas Healthathon 3.0",
        caption: "1st Position, Cimas Healthathon 3.0, 28 Aug 2026",
      },
      {
        src: "/images/silicaguard-certificate.jpg",
        alt: "Certificate of Participation, Cimas Healthathon 3.0",
        caption: "Certificate of Participation, Cimas Health Group",
      },
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "Silicosis, permanent, incurable lung scarring from silica dust, is killing Zimbabwe's artisanal gold miners at a rate a Kwekwe district hospital superintendent has publicly called unacceptable: roughly one death a week at a single hospital.",
          "A population of 500,000–1.5 million artisanal miners has zero existing digital screening infrastructure: no way to self-assess, no field triage tool, no early-warning system between first exposure and hospital-stage disease.",
        ],
      },
      {
        heading: "What actually got built",
        body: [
          "A real, working system (114 commits, not a slide deck) with deliberate scope cuts as the problem got clearer under deadline pressure, which is the more interesting story than shipping everything originally planned.",
          "Chest X-ray AI was dropped: hardware and regulatory barriers made it impractical in the timeframe. The WhatsApp channel was dropped for SMS delivery and reminder cascades, since it assumed smartphone ownership the target population doesn't reliably have. QR referral codes were replaced with typed codes, since scanning assumed hardware and literacy the field context couldn't guarantee. The team also pivoted away from enterprise/formal-sector targeting to focus exclusively on artisanal miners, the harder, higher-need population.",
        ],
      },
      {
        heading: "Architecture, as shipped",
        body: [
          "Backend: FastAPI + SQLAlchemy, PostgreSQL via Supabase in production. Africa's Talking for USSD and SMS. AI: Google Gemini 2.5 Flash across four modules, covering risk stratification, longitudinal comparison, referral logic, and report generation.",
          "Mobile (my primary piece): React Native + Expo, offline-first via expo-sqlite, a roughly 10-minute field assessment a health worker runs at the mine site with no connectivity required. Dashboard (my primary piece): deliberately static HTML/CSS/JS deployed to Render rather than the originally planned React build, a pragmatic call under time pressure that still delivers population-level intelligence to clinical and insurer stakeholders.",
          "Core features: four-tier risk stratification (green/yellow/orange/red), longitudinal deterioration detection comparing a miner's current screening against prior results, smart referral routing with human-readable tracked codes, USSD self-screening with a web simulator, SMS delivery and reminder cascades, and an Outreach Planner that auto-generates post-visit reports.",
        ],
      },
      {
        heading: "My role",
        body: [
          "Mobile, web, and design engineer on a three-person team. The React Native/Expo field app and the clinical dashboard were my primary pieces, alongside the design language across both. Panashe M. Chandiwana owned the AI risk engine and backend; Gabriel drove the clinical protocol, research grounding, and pilot planning.",
        ],
      },
    ],
  },
  {
    slug: "sales-powerbi-dashboard",
    node: "03",
    category: "Core · Data / BI",
    title: "Sales Overview: Power BI Dashboard",
    tagline:
      "A star-schema sales analytics dashboard covering revenue, geography, product, and customer-segment insight, with budget-vs-actual variance.",
    status: "",
    stack: ["Power BI Desktop", "Power Query", "DAX", "SQL"],
    stats: [],
    sections: [
      {
        heading: "Approach",
        body: [
          "Proper dimensional modelling rather than a flat report: a Calendar dimension for time-based analysis, Customer (demographics/segment) and Product (category/classification) dimensions, and an Internet Sales fact table carrying revenue and profit metrics. A separate sales-budget input feeds variance analysis against actuals.",
          "Power Query handles transformation and cleaning; DAX carries the custom measures: trends, profitability, budget variance. Both CSV and SQL sourcing paths are supported.",
        ],
      },
      {
        heading: "What it shows",
        body: [
          "Revenue trends over time, filterable by period. Geographic performance breakdown. Product profitability and volume. Customer demographic segmentation. Budget vs. actual variance.",
          "Included deliberately as its own node, separate from the ML work: dimensional modelling and stakeholder-facing reporting is a distinct skill from training a classifier.",
        ],
      },
    ],
  },
  {
    slug: "cloudkitchen",
    node: "04",
    category: "Core · Full-stack",
    title: "CloudKitchen: Tuckshop Management System",
    tagline:
      "A cloud-hosted POS and inventory-management platform for a campus tuckshop/canteen at CUT, letting a vendor reach students beyond queue capacity and foot traffic.",
    status: "",
    stack: [
      "Vue.js",
      "TypeScript",
      "Vite",
      "Supabase (Postgres)",
      "Vercel",
      "Render",
      "ESLint",
    ],
    stats: [],
    sections: [
      {
        heading: "Problem",
        body: [
          "Campus food vendors are limited by physical queue capacity and foot traffic; students have limited windows between classes to queue. A virtual ordering layer expands a vendor's reach beyond who happens to walk past, and the vendor still needs real POS and inventory tracking behind it, not just a menu page.",
        ],
      },
      {
        heading: "Approach",
        body: [
          "A Vue 3 + TypeScript single-page app on a Vite build for ordering, backed by Supabase (Postgres) for data and auth. Deployed across Vercel and Render. Server-side logic handles order and vendor flow; standard dev/prod workflow, ESLint-enforced code quality throughout.",
          "The deliberately \"shipped, real-context product\" node on this site: built for actual use at CUT rather than a tutorial clone, showing full-stack delivery (frontend, backend-as-a-service, deployment) independent of the ML and embedded work.",
        ],
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
