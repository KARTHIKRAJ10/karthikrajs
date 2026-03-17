import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// MOCK DATA & CONSTANTS
// ═══════════════════════════════════════════════════════

const PROJECTS = [
  {
    id: "commerce-copilot",
    title: "Conversational Commerce Copilot",
    subtitle: "AI-Powered Product Discovery",
    problem: "Customers abandon searches when keyword-based product discovery fails to understand intent, context, or preference nuance.",
    solution: "A conversational AI assistant using semantic retrieval and RAG to match shopping intent to products with reasoning, cross-sell logic, and policy grounding.",
    features: ["Intent-based product search", "Semantic retrieval & ranking", "Reasoning explanations", "Cross-sell & upsell logic", "FAQ & policy grounding", "Branded conversational UI"],
    value: "Reduces search friction by 40%, improves discovery-to-cart conversion, and creates a personalized shopping experience at scale.",
    tags: ["RAG", "Embeddings", "Vector Search", "LLM", "Next.js", "Product Catalog"],
    icon: "🛒",
  },
  {
    id: "segmentation-studio",
    title: "Customer Segmentation Studio",
    subtitle: "LLM-Powered Persona Intelligence",
    problem: "Marketing teams rely on static segments that miss behavioral nuance, making campaigns generic and reducing ROI.",
    solution: "An ML clustering engine paired with LLM-generated personas, CLV analysis, churn risk layers, and actionable campaign strategies.",
    features: ["Behavioral clustering", "LLM persona generation", "CLV & churn analysis", "Campaign strategy engine", "Visual cluster explorer", "Segment comparison tools"],
    value: "Transforms raw behavioral data into strategic segments with ready-to-execute campaign playbooks, improving targeting precision by 35%.",
    tags: ["Clustering", "Feature Engineering", "LLM", "Plotly", "Python", "CLV Modeling"],
    icon: "👥",
  },
  {
    id: "incrementality-lab",
    title: "Marketing Incrementality & Budget Lab",
    subtitle: "Causal Impact & Spend Optimization",
    problem: "Marketing teams allocate budgets based on last-click attribution, missing true incremental impact and wasting spend on saturated channels.",
    solution: "A simulation platform using causal modeling for incrementality estimation, with interactive budget reallocation and scenario planning.",
    features: ["Channel performance analytics", "Incremental revenue modeling", "Budget allocation sliders", "Scenario planning engine", "Executive summary generation", "ROI optimization"],
    value: "Enables data-driven budget shifts that improve marketing ROAS by 20-30% through true incrementality measurement.",
    tags: ["Causal Inference", "MMM", "Econometrics", "Simulation", "Recharts", "LLM Summaries"],
    icon: "📊",
  },
  {
    id: "brand-intelligence",
    title: "Brand Relationship Intelligence",
    subtitle: "Customer Sentiment & Trust Analytics",
    problem: "Brands lack a unified view of what strengthens or damages customer relationships across reviews, feedback, and support channels.",
    solution: "An NLP-powered intelligence platform that ingests customer feedback, extracts themes and sentiment, identifies loyalty drivers, and recommends actions.",
    features: ["Multi-source feedback ingestion", "Sentiment & theme analysis", "Loyalty driver identification", "Pain point discovery", "Trust score dashboard", "Action recommendations"],
    value: "Provides a real-time customer trust radar, reducing churn triggers by 25% and surfacing high-impact improvement opportunities.",
    tags: ["NLP", "Topic Modeling", "Sentiment Analysis", "Embeddings", "Dashboard", "LLM Summarization"],
    icon: "💎",
  },
  {
    id: "financial-risk",
    title: "Financial Wellness & Risk Engine",
    subtitle: "Predictive Risk & Decision Intelligence",
    problem: "Financial institutions need transparent, explainable risk assessments that balance predictive power with regulatory compliance.",
    solution: "A predictive ML system with SHAP-based explainability, customer risk profiling, next-best-action recommendations, and portfolio risk dashboards.",
    features: ["ML risk scoring", "SHAP explainability", "Customer profile simulation", "Next-best-action engine", "Portfolio risk dashboard", "Intervention strategies"],
    value: "Delivers explainable credit decisions with 92% accuracy while maintaining regulatory compliance and customer trust.",
    tags: ["XGBoost", "SHAP", "Scikit-learn", "Risk Modeling", "Explainable AI", "Dashboard"],
    icon: "🏦",
  },
  {
    id: "growth-agent",
    title: "Commerce & Growth Decision Agent",
    subtitle: "AI-Powered Business Copilot",
    problem: "Business teams spend hours pulling data, building reports, and interpreting metrics before they can make a single decision.",
    solution: "An autonomous AI agent that retrieves data, runs analytics, summarizes insights, and recommends actions through a conversational interface.",
    features: ["Natural language queries", "Tool-calling & data retrieval", "Analytics reasoning", "Structured recommendations", "Trade-off explanations", "Session memory"],
    value: "Reduces analytics-to-decision time from days to minutes, democratizing data-driven decision making across the organization.",
    tags: ["AI Agents", "Tool Orchestration", "LLM", "SQL Tools", "Memory", "Reasoning"],
    icon: "🤖",
    isAgent: true,
  },
];

const EXPERTISE = [
  { title: "Data Science & Machine Learning", desc: "Supervised/unsupervised modeling, feature engineering, cross-validation, and production ML pipelines for classification, regression, and forecasting.", cases: "Churn prediction, demand forecasting, CLV modeling", icon: "🧠" },
  { title: "LLM Applications & RAG", desc: "Building retrieval-augmented generation systems, semantic search, and conversational AI products grounded in domain-specific knowledge.", cases: "Product copilots, document Q&A, persona generation", icon: "💬" },
  { title: "AI Agents & Decision Systems", desc: "Designing autonomous agents with tool-calling, reasoning chains, and structured decision outputs for business operations.", cases: "Growth agents, analytics copilots, automated reporting", icon: "⚡" },
  { title: "Marketing Science & Analytics", desc: "Incrementality testing, MMM, attribution modeling, A/B testing frameworks, and campaign performance optimization at scale.", cases: "Budget allocation, channel optimization, ROAS improvement", icon: "📈" },
  { title: "Ecommerce & Customer Intelligence", desc: "Customer segmentation, recommendation engines, personalization, conversion optimization, and behavioral analytics for commerce platforms.", cases: "Product discovery, segment targeting, basket analysis", icon: "🛍️" },
  { title: "Analytics Engineering & Pipelines", desc: "Building scalable data models with dbt, SQL, and Python — designing medallion architectures and reliable analytical foundations.", cases: "Data warehousing, ELT pipelines, metric layers", icon: "🔧" },
  { title: "Finance & Risk Analytics", desc: "Credit risk modeling, explainable scoring, portfolio analytics, and predictive systems with regulatory-grade transparency.", cases: "Risk scoring, SHAP explainability, intervention models", icon: "🏛️" },
  { title: "Customer & Brand Intelligence", desc: "NLP-powered sentiment analysis, feedback mining, loyalty analytics, and customer relationship health monitoring.", cases: "Review analysis, trust scoring, brand health dashboards", icon: "🎯" },
];

const TECH_STACK = {
  "Languages": ["Python", "SQL", "JavaScript", "TypeScript"],
  "Data & Analytics": ["Pandas", "NumPy", "SciPy", "Statsmodels", "PySpark", "dbt"],
  "Machine Learning": ["Scikit-learn", "XGBoost", "LightGBM", "TensorFlow", "PyTorch"],
  "LLM & AI": ["LangChain", "OpenAI API", "RAG Pipelines", "Vector DBs", "Prompt Engineering"],
  "Cloud & Platforms": ["AWS (S3, EC2, Lambda)", "Databricks", "Snowflake", "BigQuery", "Vertex AI"],
  "Visualization & BI": ["Power BI", "Tableau", "Plotly", "Recharts", "Streamlit"],
  "Marketing Science": ["MMM", "Attribution", "A/B Testing", "Incrementality", "GA4", "CRM Analytics"],
  "Engineering & MLOps": ["Docker", "Git", "CI/CD", "FastAPI", "Airflow", "MLflow"],
};

const EXPERIENCE = [
  { role: "Application Engineer — Analytics & Data Products", company: "Neurealm (Formerly Gavs)", location: "Chennai, India", period: "Nov 2022 – Apr 2023", highlights: ["Built marketing analytics & ELT pipelines processing 50M+ records monthly on AWS", "Designed attribution frameworks across 10+ marketing channels optimizing $500K quarterly spend", "Improved marketing forecast reliability by 24% through statistical modeling workflows", "Delivered executive dashboards for 20+ marketing stakeholders"] },
  { role: "Data Analyst — Market Research & Customer Analytics", company: "The Prink", location: "Trichy, India", period: "Sep 2020 – Oct 2022", highlights: ["Built behavioral segmentation models improving lead acquisition by 35%", "Designed A/B testing frameworks across 20+ marketing experiments", "Developed predictive models analyzing 25K+ transaction records", "Created real-time marketing performance dashboards"] },
  { role: "Data Analyst", company: "Whirldata", location: "Chennai, India", period: "Feb 2019 – Mar 2020", highlights: ["Built SQL-driven KPI monitoring across 10+ digital campaigns", "Reduced reporting discrepancies by 30% through data validation frameworks", "Conducted EDA across multi-source marketing datasets (50K+ interactions)", "Implemented quality assurance pipelines for campaign analytics"] },
];

const EDUCATION = [
  { degree: "Graduate Certificate — IT Business Analysis", school: "Conestoga College, Ontario", period: "2023 – 2024" },
  { degree: "B.Eng — Computer Science & Engineering", school: "Anna University, Tamil Nadu", period: "2014 – 2018" },
];

const ARCH_LAYERS = [
  { layer: "Data Sources", items: ["CRM", "Transactions", "Clickstream", "Marketing Platforms", "Reviews"] },
  { layer: "Ingestion & Orchestration", items: ["Airflow", "dbt", "ELT Pipelines", "Event Streams"] },
  { layer: "Feature Store", items: ["Feature Engineering", "Temporal Validation", "Leakage Prevention"] },
  { layer: "Model Layer", items: ["Training", "Cross-Validation", "Hyperparameter Tuning", "Experiment Tracking"] },
  { layer: "Serving & Inference", items: ["FastAPI", "Batch Scoring", "Real-time Predictions", "A/B Routing"] },
  { layer: "Monitoring & Governance", items: ["Drift Detection", "SHAP Explainability", "Model Registry", "Alerting"] },
  { layer: "Decision Layer", items: ["Dashboards", "Recommendations", "Agent Interfaces", "Stakeholder APIs"] },
];

// ═══════════════════════════════════════════════════════
// DEMO RESPONSES
// ═══════════════════════════════════════════════════════

const COPILOT_RESPONSES = {
  "running shoes": "Based on your interest, here are my top picks:\n\n🏃 **Nike Pegasus 41** — $130\nBest daily trainer. Responsive ZoomX foam, breathable mesh.\n\n🏃 **ASICS Gel-Nimbus 26** — $160\nPremium cushioning for long distances. GEL technology.\n\n🏃 **New Balance 1080v13** — $165\nPlush ride, excellent energy return. Hypoknit upper.\n\n💡 *Why these?* Covers daily trainers to premium cushioners — comfort + performance optimized.",
  "gift for wife": "Curated suggestions across categories:\n\n🎁 **Personalized Jewelry Box** — $85\nHandcrafted walnut with custom engraving.\n\n🎁 **Luxury Skincare Set** — $120\nPremium serums and moisturizers collection.\n\n🎁 **Kindle Paperwhite Bundle** — $170\nLeather case + 3-month Kindle Unlimited.\n\n💡 Covers sentimental, self-care, and experiential. Want to narrow by interests or budget?",
  "wireless headphones": "Top picks across categories:\n\n🎧 **Sony WH-1000XM5** — $350\nBest ANC. 30-hour battery. Exceptional sound.\n\n🎧 **AirPods Pro 2** — $250\nApple ecosystem. Adaptive transparency. Compact.\n\n🎧 **Bose QC Ultra** — $430\nSpatial audio. Plush all-day comfort.\n\n💡 *Cross-sell:* Consider a headphone stand ($25) or travel case.",
  "default": "I help you find exactly what you need — searching by intent, comparing options, and explaining why items match.\n\nTry asking about a product category, use case, or describe what you're looking for."
};

const AGENT_RESPONSES = {
  "why are conversions down": "📊 **Conversion Analysis — Last 14 Days**\n\n**Finding:** CR dropped 12% (3.8% → 3.3%).\n\n**Root Causes:**\n→ **Mobile checkout** — CR fell 18% after redesign. Payment bounce +23%.\n→ **Paid search** — New keywords at 0.8% CR vs. 4.1% core.\n→ **Stock-outs** — 3 of top-10 SKUs unavailable 5+ days.\n\n**Actions:**\n• Revert mobile checkout, A/B test incrementally\n• Pause low-intent keywords, shift $12K to branded\n• Back-in-stock alerts for high-demand SKUs\n\n*Recovery estimate: 80% within 2 weeks.*",
  "which segments should we target": "🎯 **Segment Targeting**\n\n**P1: At-Risk High-Value (2,400)**\n$500+ past year, 60+ days dormant. Win-back ROI: 5-7x.\n→ Personalized email + exclusive offer.\n\n**P2: New Explorers (4,200)**\n5+ sessions, no purchase. Need a nudge.\n→ Social proof + first-purchase incentive.\n\n**P3: Rising AOV Deal Seekers (6,100)**\nBasket size increasing. Migrate to full-price.\n→ Bundle offers for higher cart values.\n\n*Projected: $340K next quarter.*",
  "compare channel performance": "📈 **Channel Performance — Q4**\n\n| Channel | Spend | ROAS | iROAS |\n|---------|-------|------|-------|\n| Paid Search | $180K | 4.0x | 2.7x |\n| Social | $95K | 3.0x | 1.5x |\n| Email | $12K | 28.3x | 25.8x |\n| Affiliates | $45K | 4.0x | 2.0x |\n\n**Insight:** Social has low incrementality. Email massively underinvested.\n\n**Action:** Shift $20K Social → Email. Gain: $85K/quarter.",
  "default": "I'm your Commerce & Growth Decision Agent — I analyze data, surface insights, and recommend actions.\n\nTry:\n• \"Why are conversions down?\"\n• \"Which segments should we target?\"\n• \"Compare channel performance\""
};

const SEGMENTS = [
  { name: "High-Value Loyalists", count: "12,340", color: "#C9A84C", metrics: { frequency: 92, recency: 88, monetary: 95, engagement: 90 }, persona: "Frequent buyers with strong brand affinity. AOV 3.2x site-wide mean. Respond well to early-access programs.", strategy: "Exclusive loyalty tier with personalized recs. Estimated CLV uplift: 18%." },
  { name: "Deal Seekers", count: "28,720", color: "#8B7A3D", metrics: { frequency: 55, recency: 70, monetary: 35, engagement: 65 }, persona: "Price-sensitive, convert during promotions. Cart abandonment 2x average.", strategy: "Targeted flash-sale notifications and bundles. Dynamic pricing to protect margins." },
  { name: "At-Risk Churners", count: "8,150", color: "#6b7280", metrics: { frequency: 20, recency: 15, monetary: 45, engagement: 18 }, persona: "Declining engagement over 90 days. Possible negative experience or competitor switch.", strategy: "Win-back campaign with personalized incentives. Exit surveys for high-CLV accounts." },
  { name: "New Explorers", count: "15,890", color: "#9ca3af", metrics: { frequency: 30, recency: 95, monetary: 25, engagement: 72 }, persona: "Recently acquired, evaluation phase. High browse ratios, low purchase frequency.", strategy: "Education sequences + social proof + first-purchase incentive within 30 days." },
];

// ═══════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsInView(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isInView];
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

const smoothScroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

// ═══════════════════════════════════════════════════════
// STYLES — Dark Charcoal + Vermillion Red Accent
// ═══════════════════════════════════════════════════════

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap');

:root {
  --bg-deep: #050505;
  --bg-primary: #0a0a0a;
  --bg-elevated: #111;
  --bg-card: rgba(10, 10, 10, 0.92);
  --bg-card-hover: rgba(18, 18, 18, 0.96);
  --bg-glass: rgba(255,255,255,0.018);
  --bg-input: rgba(255,255,255,0.035);
  --border: rgba(201,168,76,0.1);
  --border-hover: rgba(201,168,76,0.22);
  --border-focus: rgba(201,168,76,0.5);
  --text-primary: #e8e4dc;
  --text-secondary: #918a7e;
  --text-muted: #5a5549;
  --accent: #C9A84C;
  --accent-hover: #B8943F;
  --accent-glow: rgba(201,168,76,0.14);
  --accent-soft: rgba(201,168,76,0.07);
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Source Sans 3', sans-serif;
  --font-mono: 'Source Code Pro', monospace;
}

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--bg-deep);color:var(--text-primary);line-height:1.6;-webkit-font-smoothing:antialiased}
.portfolio-root{min-height:100vh;overflow-x:hidden;position:relative}

.ambient-bg{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ambient-orb{position:absolute;border-radius:50%;filter:blur(180px);opacity:0.04;animation:orbF 32s ease-in-out infinite}
.ambient-orb:nth-child(1){width:700px;height:700px;background:var(--accent);top:-300px;left:-200px}
.ambient-orb:nth-child(2){width:500px;height:500px;background:#1a1708;top:50%;right:-250px;animation-delay:-10s}
.ambient-orb:nth-child(3){width:350px;height:350px;background:var(--accent);bottom:-200px;left:35%;animation-delay:-18s}
@keyframes orbF{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15px,-20px) scale(1.02)}66%{transform:translate(-10px,12px) scale(0.98)}}

.noise{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.018;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 2rem;transition:all 0.4s cubic-bezier(.4,0,.2,1)}
.nav.scrolled{background:rgba(5,5,5,0.94);backdrop-filter:blur(18px) saturate(1.2);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:var(--font-display);font-size:1.35rem;font-weight:600;color:var(--text-primary);text-decoration:none;letter-spacing:0.01em}
.nav-logo span{color:var(--accent)}
.nav-links{display:flex;gap:1.75rem;list-style:none;align-items:center}
.nav-links a{color:var(--text-muted);text-decoration:none;font-size:0.76rem;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;transition:color 0.3s;cursor:pointer}
.nav-links a:hover{color:var(--text-primary)}
.nav-cta{background:var(--accent)!important;color:#0a0a0a!important;padding:0.4rem 1rem;border-radius:6px;font-weight:600!important;font-size:0.74rem!important;letter-spacing:0.04em!important;transition:all 0.3s}
.nav-cta:hover{background:var(--accent-hover)!important}
.mobile-toggle{display:none;background:none;border:none;color:var(--text-primary);font-size:1.4rem;cursor:pointer}

.section{position:relative;z-index:1;max-width:1280px;margin:0 auto;padding:6.5rem 2rem}
.section-label{font-family:var(--font-mono);font-size:0.7rem;color:var(--accent);text-transform:uppercase;letter-spacing:0.18em;margin-bottom:0.6rem;display:block}
.section-title{font-family:var(--font-display);font-size:clamp(2.1rem,4.2vw,3rem);font-weight:600;color:var(--text-primary);line-height:1.15;margin-bottom:0.6rem;letter-spacing:-0.01em}
.section-desc{color:var(--text-secondary);font-size:0.95rem;max-width:580px;line-height:1.7}
.section-rule{width:36px;height:2px;background:var(--accent);margin:1rem 0 0;border-radius:1px}

.fade-up{opacity:0;transform:translateY(22px);transition:opacity 0.55s cubic-bezier(.4,0,.2,1),transform 0.55s cubic-bezier(.4,0,.2,1)}
.fade-up.visible{opacity:1;transform:translateY(0)}

.hero{min-height:100vh;display:flex;align-items:center;position:relative;z-index:1;padding:7rem 2rem 5rem}
.hero-inner{max-width:1280px;margin:0 auto;width:100%}
.hero-badge{display:inline-flex;align-items:center;gap:0.5rem;padding:0.35rem 0.9rem;border:1px solid var(--border);border-radius:100px;font-size:0.75rem;color:var(--text-secondary);margin-bottom:1.75rem;background:var(--bg-glass)}
.hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(1.6)}}
.hero-name{font-family:var(--font-display);font-size:clamp(3.2rem,7.5vw,6rem);font-weight:600;line-height:0.98;margin-bottom:1.5rem;letter-spacing:-0.02em}
.hero-name .accent{color:var(--accent)}
.hero-desc{font-size:clamp(0.95rem,1.5vw,1.1rem);color:var(--text-secondary);max-width:620px;line-height:1.75;margin-bottom:2.25rem;font-weight:300}
.hero-ctas{display:flex;gap:0.65rem;flex-wrap:wrap;margin-bottom:3rem}
.btn-primary{display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:var(--accent);color:#0a0a0a;border:none;border-radius:7px;font-weight:600;font-size:0.84rem;cursor:pointer;transition:all 0.3s;text-decoration:none;font-family:var(--font-body);letter-spacing:0.01em}
.btn-primary:hover{background:var(--accent-hover);transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,0.2)}
.btn-secondary{display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:transparent;color:var(--text-secondary);border:1px solid var(--border-hover);border-radius:7px;font-weight:500;font-size:0.84rem;cursor:pointer;transition:all 0.3s;text-decoration:none;font-family:var(--font-body)}
.btn-secondary:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-2px)}
.hero-metrics{display:flex;gap:2.5rem;flex-wrap:wrap}
.hero-metric-value{font-family:var(--font-display);font-size:1.3rem;font-weight:700;color:var(--accent)}
.hero-metric-label{font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:0.1rem}

.card{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:1.6rem;backdrop-filter:blur(6px);transition:all 0.3s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}
.card:hover{border-color:var(--border-hover);background:var(--bg-card-hover);transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,0,0,0.2)}

.expertise-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));gap:1.1rem;margin-top:2.25rem}
.expertise-card-icon{font-size:1.7rem;margin-bottom:0.6rem}
.expertise-card-title{font-family:var(--font-display);font-size:1rem;font-weight:600;margin-bottom:0.3rem}
.expertise-card-desc{color:var(--text-secondary);font-size:0.82rem;line-height:1.55;margin-bottom:0.5rem}
.expertise-card-cases{font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono)}

.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:1.1rem;margin-top:2.25rem}
.project-card-accent{position:absolute;top:0;left:0;right:0;height:2px;border-radius:12px 12px 0 0;background:linear-gradient(90deg,var(--accent),transparent)}
.project-card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.6rem}
.project-card-icon{font-size:1.9rem}
.project-card-badge{font-size:0.63rem;font-family:var(--font-mono);padding:0.18rem 0.5rem;border-radius:4px;background:var(--accent-soft);color:var(--accent);text-transform:uppercase;letter-spacing:0.08em;font-weight:500}
.project-card-title{font-family:var(--font-display);font-size:1.1rem;font-weight:600;margin-bottom:0.15rem}
.project-card-subtitle{font-size:0.75rem;color:var(--accent);font-weight:500;margin-bottom:0.55rem}
.project-card-problem{font-size:0.82rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.9rem}
.project-card-tags{display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:1.1rem}
.project-tag{font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:3px;background:rgba(255,255,255,0.03);color:var(--text-muted);font-family:var(--font-mono);border:1px solid var(--border)}
.project-card-actions{display:flex;gap:0.5rem}
.project-btn{flex:1;padding:0.5rem;text-align:center;border-radius:6px;font-size:0.76rem;font-weight:600;cursor:pointer;transition:all 0.3s;border:none;font-family:var(--font-body)}
.project-btn-primary{background:var(--accent);color:#0a0a0a}
.project-btn-primary:hover{background:var(--accent-hover);box-shadow:0 3px 14px rgba(201,168,76,0.2)}
.project-btn-secondary{background:rgba(255,255,255,0.035);color:var(--text-secondary);border:1px solid var(--border)}
.project-btn-secondary:hover{border-color:var(--accent);color:var(--accent)}

.demo-tabs{display:flex;gap:0.35rem;margin-bottom:1.25rem;flex-wrap:wrap}
.demo-tab{padding:0.5rem 1rem;border-radius:6px;font-size:0.8rem;font-weight:500;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--text-muted);transition:all 0.3s;font-family:var(--font-body)}
.demo-tab.active{background:var(--accent);color:#0a0a0a;border-color:transparent;font-weight:600}
.demo-tab:hover:not(.active){border-color:var(--border-hover);color:var(--text-secondary)}
.demo-container{border:1px solid var(--border);border-radius:12px;background:var(--bg-card);backdrop-filter:blur(6px);overflow:hidden;min-height:460px}
.demo-header{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1.15rem;border-bottom:1px solid var(--border);background:rgba(255,255,255,0.012)}
.demo-header-title{font-weight:600;font-size:0.82rem}
.demo-header-status{display:flex;align-items:center;gap:0.35rem;font-size:0.7rem;color:var(--accent)}
.demo-body{padding:1.15rem}

.chat-messages{max-height:300px;overflow-y:auto;margin-bottom:0.65rem;display:flex;flex-direction:column;gap:0.5rem;padding-right:0.4rem}
.chat-messages::-webkit-scrollbar{width:3px}
.chat-messages::-webkit-scrollbar-thumb{background:var(--border-hover);border-radius:3px}
.chat-msg{max-width:85%;padding:0.65rem 0.9rem;border-radius:10px;font-size:0.82rem;line-height:1.5;animation:msgIn 0.25s ease}
@keyframes msgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.chat-msg.user{align-self:flex-end;background:var(--accent-soft);border:1px solid rgba(201,168,76,0.12);color:var(--text-primary)}
.chat-msg.ai{align-self:flex-start;background:rgba(255,255,255,0.025);border:1px solid var(--border);color:var(--text-secondary)}
.chat-input-row{display:flex;gap:0.5rem}
.chat-input{flex:1;padding:0.65rem 0.9rem;border-radius:8px;border:1px solid var(--border);background:var(--bg-input);color:var(--text-primary);font-size:0.84rem;font-family:var(--font-body);outline:none;transition:border-color 0.3s}
.chat-input:focus{border-color:var(--accent)}
.chat-input::placeholder{color:var(--text-muted)}
.chat-send{padding:0.65rem 1rem;border-radius:8px;background:var(--accent);color:#0a0a0a;border:none;font-weight:600;font-size:0.8rem;cursor:pointer;font-family:var(--font-body);transition:all 0.3s;white-space:nowrap}
.chat-send:hover{background:var(--accent-hover)}
.chat-send:disabled{opacity:0.35;cursor:not-allowed}
.sample-prompts{display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.65rem}
.sample-prompt{font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:100px;border:1px solid var(--border);background:transparent;color:var(--text-muted);cursor:pointer;font-family:var(--font-body);transition:all 0.3s}
.sample-prompt:hover{border-color:var(--accent);color:var(--accent)}

.stack-categories{display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:1.1rem;margin-top:2.25rem}
.stack-category-title{font-family:var(--font-mono);font-size:0.7rem;color:var(--accent);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:0.55rem}
.stack-items{display:flex;flex-wrap:wrap;gap:0.3rem}
.stack-item{font-size:0.72rem;padding:0.2rem 0.55rem;border-radius:4px;background:rgba(255,255,255,0.03);border:1px solid var(--border);color:var(--text-secondary);font-family:var(--font-mono);transition:all 0.3s}
.stack-item:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}

.arch-flow{display:flex;flex-direction:column;margin-top:2.25rem;border:1px solid var(--border);border-radius:12px;overflow:hidden}
.arch-layer{display:flex;align-items:stretch;transition:all 0.3s;position:relative}
.arch-layer:not(:last-child){border-bottom:1px solid var(--border)}
.arch-layer:hover{background:rgba(255,255,255,0.015)}
.arch-layer-label{width:195px;flex-shrink:0;padding:0.85rem 1.1rem;font-family:var(--font-mono);font-size:0.68rem;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;display:flex;align-items:center;border-right:1px solid var(--border);color:var(--text-muted)}
.arch-layer:nth-child(odd) .arch-layer-label{color:var(--accent)}
.arch-layer-items{flex:1;padding:0.85rem 1.1rem;display:flex;flex-wrap:wrap;gap:0.3rem;align-items:center}
.arch-item{font-size:0.72rem;padding:0.18rem 0.5rem;border-radius:3px;background:rgba(255,255,255,0.03);color:var(--text-secondary);font-family:var(--font-mono);border:1px solid var(--border)}
.arch-connector{display:flex;justify-content:center;color:var(--text-muted);font-size:0.6rem;padding:0.15rem 0}

.exp-timeline{margin-top:2.25rem;display:flex;flex-direction:column;gap:1.1rem}
.exp-card-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.65rem}
.exp-role{font-family:var(--font-display);font-size:1.05rem;font-weight:600}
.exp-company{color:var(--accent);font-weight:500;font-size:0.82rem;margin-top:0.08rem}
.exp-period{font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);padding:0.2rem 0.55rem;border:1px solid var(--border);border-radius:3px;white-space:nowrap}
.exp-highlights{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:0.35rem}
.exp-highlight{font-size:0.82rem;color:var(--text-secondary);line-height:1.5;padding-left:0.8rem;position:relative}
.exp-highlight::before{content:'';position:absolute;left:0;top:0.5rem;width:3px;height:3px;border-radius:50%;background:var(--accent)}

.philosophy-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(225px,1fr));gap:0.65rem;margin-top:2rem}
.philosophy-item{padding:1.1rem;border-left:2px solid var(--accent);background:var(--bg-glass)}
.philosophy-item h4{font-family:var(--font-display);font-size:0.9rem;font-weight:600;margin-bottom:0.25rem}
.philosophy-item p{font-size:0.8rem;color:var(--text-secondary);line-height:1.5}

.why-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1.1rem;margin-top:2.25rem}

.contact-wrapper{position:relative;border:1px solid var(--border);border-radius:16px;overflow:hidden;background:var(--bg-card);backdrop-filter:blur(8px);margin-top:2.25rem}
.contact-top{padding:2.5rem 2.5rem 0;display:flex;align-items:flex-start;justify-content:space-between;gap:2rem;flex-wrap:wrap}
.contact-top-text h3{font-family:var(--font-display);font-size:1.6rem;font-weight:700;line-height:1.2;margin-bottom:0.4rem;letter-spacing:-0.02em}
.contact-top-text h3 span{color:var(--accent)}
.contact-top-text p{color:var(--text-secondary);font-size:0.88rem;max-width:420px;line-height:1.65}
.contact-quick-links{display:flex;gap:0.5rem;flex-wrap:wrap;align-items:flex-start}
.contact-pill{display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.9rem;border:1px solid var(--border);border-radius:100px;color:var(--text-secondary);text-decoration:none;font-size:0.78rem;font-weight:500;transition:all 0.3s;background:rgba(255,255,255,0.02)}
.contact-pill:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-soft);transform:translateY(-1px)}
.contact-pill-icon{font-size:0.85rem}
.contact-divider{height:1px;background:var(--border);margin:2rem 2.5rem 0}
.contact-bottom{display:grid;grid-template-columns:1fr 1fr;gap:0}
.contact-form-side{padding:2rem 2.5rem 2.5rem;border-right:1px solid var(--border)}
.contact-form{display:flex;flex-direction:column;gap:0.75rem}
.contact-form-title{font-family:var(--font-mono);font-size:0.68rem;color:var(--accent);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:0.5rem}
.form-group{display:flex;flex-direction:column;gap:0.2rem}
.form-group label{font-size:0.65rem;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em}
.form-input,.form-textarea{padding:0.6rem 0.85rem;border-radius:7px;border:1px solid var(--border);background:var(--bg-input);color:var(--text-primary);font-size:0.85rem;font-family:var(--font-body);outline:none;transition:border-color 0.3s}
.form-input:focus,.form-textarea:focus{border-color:var(--accent)}
.form-input::placeholder,.form-textarea::placeholder{color:var(--text-muted)}
.form-textarea{resize:vertical;min-height:100px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.form-submit{padding:0.7rem 1.5rem;background:var(--accent);color:#0a0a0a;border:none;border-radius:7px;font-weight:600;font-size:0.85rem;cursor:pointer;font-family:var(--font-body);transition:all 0.3s;width:fit-content}
.form-submit:hover{background:var(--accent-hover);transform:translateY(-1px);box-shadow:0 5px 18px rgba(201,168,76,0.2)}
.form-success{padding:2rem;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:280px}
.contact-details-side{padding:2rem 2.5rem 2.5rem;display:flex;flex-direction:column;gap:1.25rem}
.contact-details-title{font-family:var(--font-mono);font-size:0.68rem;color:var(--accent);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:0.25rem}
.contact-detail-item{display:flex;flex-direction:column;gap:0.12rem}
.contact-detail-label{font-size:0.65rem;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em}
.contact-detail-value{font-size:0.9rem;color:var(--text-primary)}
.contact-detail-value a{color:var(--accent);text-decoration:none;transition:opacity 0.3s}
.contact-detail-value a:hover{opacity:0.8}
.contact-status{margin-top:auto;padding:0.85rem 1rem;border-radius:9px;border:1px solid rgba(201,168,76,0.15);background:var(--accent-soft);display:flex;align-items:center;gap:0.6rem}
.contact-status-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);animation:pulse 2s ease-in-out infinite;flex-shrink:0}
.contact-status-text{font-size:0.82rem;color:var(--text-secondary)}
.contact-status-text strong{color:var(--accent);font-weight:600}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.9);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:center;justify-content:center;padding:2rem;animation:fadeIn 0.2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal-content{background:var(--bg-primary);border:1px solid var(--border);border-radius:16px;max-width:760px;width:100%;max-height:80vh;overflow-y:auto;padding:2.25rem}
.modal-content::-webkit-scrollbar{width:3px}
.modal-content::-webkit-scrollbar-thumb{background:var(--border-hover);border-radius:3px}
.modal-close{position:sticky;top:0;float:right;background:rgba(255,255,255,0.035);border:1px solid var(--border);color:var(--text-muted);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;transition:all 0.3s;z-index:10}
.modal-close:hover{border-color:var(--accent);color:var(--accent)}
.modal-section{margin-bottom:1.1rem}
.modal-section-label{font-family:var(--font-mono);font-size:0.65rem;color:var(--accent);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:0.3rem}
.modal-section p{color:var(--text-secondary);font-size:0.85rem;line-height:1.7}

.seg-dashboard{display:flex;flex-direction:column;gap:0.65rem}
.seg-clusters{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:0.5rem}
.seg-cluster{padding:0.75rem;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.012);cursor:pointer;transition:all 0.3s}
.seg-cluster.active{border-color:var(--accent);background:var(--accent-soft)}
.seg-cluster:hover{border-color:var(--border-hover)}
.seg-cluster-name{font-weight:600;font-size:0.82rem;margin-bottom:0.1rem}
.seg-cluster-count{font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono)}
.seg-detail{padding:1rem;border-radius:9px;border:1px solid var(--border);background:rgba(255,255,255,0.012)}
.seg-detail h4{font-family:var(--font-display);font-size:1rem;font-weight:600;margin-bottom:0.5rem}
.seg-bar-row{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem}
.seg-bar-label{font-size:0.72rem;color:var(--text-muted);width:85px;flex-shrink:0}
.seg-bar-track{flex:1;height:6px;background:rgba(255,255,255,0.035);border-radius:3px;overflow:hidden}
.seg-bar-fill{height:100%;border-radius:3px;transition:width 0.5s ease}
.seg-bar-val{font-size:0.7rem;color:var(--text-secondary);font-family:var(--font-mono);width:34px;text-align:right}
.seg-persona{padding:0.75rem;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.012);margin-top:0.5rem}
.seg-persona p{font-size:0.8rem;color:var(--text-secondary);line-height:1.5}
.seg-persona-label{font-family:var(--font-mono);font-size:0.65rem;color:var(--accent);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.2rem}

.edu-row{display:flex;gap:1.25rem;margin-top:1.25rem;flex-wrap:wrap}
.edu-card{flex:1;min-width:230px;padding:1.1rem;border-left:2px solid var(--accent);background:var(--bg-glass)}
.edu-degree{font-family:var(--font-display);font-size:0.9rem;font-weight:600;margin-bottom:0.1rem}
.edu-school{font-size:0.8rem;color:var(--text-secondary)}
.edu-period{font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:0.15rem}

.mobile-nav{display:none;position:fixed;top:64px;left:0;right:0;bottom:0;background:rgba(5,5,5,0.98);backdrop-filter:blur(18px);z-index:99;padding:1.5rem;flex-direction:column;gap:1.1rem}
.mobile-nav.open{display:flex}
.mobile-nav a{color:var(--text-secondary);text-decoration:none;font-size:1rem;font-weight:500;padding:0.35rem 0;border-bottom:1px solid var(--border);cursor:pointer}

.footer{position:relative;z-index:1;border-top:1px solid var(--border);padding:1.75rem;text-align:center}
.footer p{color:var(--text-muted);font-size:0.75rem}

@media(max-width:900px){
  .nav-links{display:none}.mobile-toggle{display:block}
  .projects-grid{grid-template-columns:1fr}.hero-metrics{gap:1.5rem}
  .section{padding:4rem 1.15rem}.hero{padding:6.5rem 1.15rem 3rem}
  .modal-content{padding:1.25rem}.expertise-grid{grid-template-columns:1fr}
  .contact-bottom{grid-template-columns:1fr}
  .contact-form-side{border-right:none;border-bottom:1px solid var(--border)}
  .contact-top{padding:2rem 1.5rem 0}
  .contact-divider{margin:1.5rem 1.5rem 0}
  .contact-form-side,.contact-details-side{padding:1.5rem}
  .arch-layer{flex-direction:column}
  .arch-layer-label{width:100%;border-right:none;border-bottom:1px solid var(--border);padding:0.5rem 0.9rem}
  .form-row{grid-template-columns:1fr}
}
`;

// ═══════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════

function AnimatedSection({ children, className = "", delay = 0 }) {
  const [ref, isInView] = useInView();
  return (
    <div ref={ref} className={`fade-up ${isInView ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function CaseStudyModal({ project, onClose }) {
  if (!project) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ marginBottom: "1.1rem" }}>
          <span style={{ fontSize: "2rem" }}>{project.icon}</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginTop: "0.35rem" }}>{project.title}</h2>
          <p style={{ color: "var(--accent)", fontWeight: 500, fontSize: "0.82rem" }}>{project.subtitle}</p>
        </div>
        {[
          ["Business Problem", project.problem],
          ["Technical Solution", project.solution],
          ["Business Value", project.value],
        ].map(([label, text]) => (
          <div className="modal-section" key={label}>
            <div className="modal-section-label">{label}</div>
            <p>{text}</p>
          </div>
        ))}
        <div className="modal-section">
          <div className="modal-section-label">Key Features</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
            {project.features.map((f, i) => (
              <span key={i} style={{ fontSize: "0.78rem", padding: "0.2rem 0.65rem", borderRadius: "4px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{f}</span>
            ))}
          </div>
        </div>
        <div className="modal-section">
          <div className="modal-section-label">Stack</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
            {project.tags.map((t, i) => (<span key={i} className="project-tag">{t}</span>))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatDemo({ responses, placeholder, samplePrompts, title }) {
  const [messages, setMessages] = useState([{ role: "ai", text: responses["default"] }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const send = useCallback((text) => {
    const t = text || input;
    if (!t.trim()) return;
    setInput("");
    setMessages(p => [...p, { role: "user", text: t }]);
    setLoading(true);
    setTimeout(() => {
      const k = Object.keys(responses).find(k => k !== "default" && t.toLowerCase().includes(k));
      setMessages(p => [...p, { role: "ai", text: responses[k] || responses["default"] }]);
      setLoading(false);
    }, 600 + Math.random() * 500);
  }, [input, responses]);

  return (
    <>
      <div className="demo-header">
        <span className="demo-header-title">{title}</span>
        <span className="demo-header-status"><span className="hero-badge-dot" /> Live</span>
      </div>
      <div className="demo-body">
        <div className="sample-prompts">
          {samplePrompts.map((p, i) => (<button key={i} className="sample-prompt" onClick={() => send(p)}>{p}</button>))}
        </div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>') }} />
            </div>
          ))}
          {loading && <div className="chat-msg ai" style={{ display: "flex", gap: "4px", padding: "0.65rem 0.9rem" }}><span style={{ animation: "pulse 1s infinite" }}>●</span><span style={{ animation: "pulse 1s infinite", animationDelay: "0.2s" }}>●</span><span style={{ animation: "pulse 1s infinite", animationDelay: "0.4s" }}>●</span></div>}
          <div ref={end} />
        </div>
        <div className="chat-input-row">
          <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={placeholder} />
          <button className="chat-send" onClick={() => send()} disabled={loading || !input.trim()}>Send →</button>
        </div>
      </div>
    </>
  );
}

function SegmentationDemo() {
  const [active, setActive] = useState(0);
  const seg = SEGMENTS[active];
  return (
    <>
      <div className="demo-header">
        <span className="demo-header-title">Customer Segmentation Studio</span>
        <span className="demo-header-status"><span className="hero-badge-dot" /> Interactive</span>
      </div>
      <div className="demo-body seg-dashboard">
        <div className="seg-clusters">
          {SEGMENTS.map((s, i) => (
            <div key={i} className={`seg-cluster ${i === active ? "active" : ""}`} onClick={() => setActive(i)}>
              <div className="seg-cluster-name" style={{ color: i === active ? s.color : "var(--text-primary)" }}>{s.name}</div>
              <div className="seg-cluster-count">{s.count} customers</div>
            </div>
          ))}
        </div>
        <div className="seg-detail">
          <h4 style={{ color: seg.color }}>{seg.name}</h4>
          {Object.entries(seg.metrics).map(([k, v]) => (
            <div className="seg-bar-row" key={k}>
              <span className="seg-bar-label">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
              <div className="seg-bar-track"><div className="seg-bar-fill" style={{ width: `${v}%`, background: seg.color }} /></div>
              <span className="seg-bar-val">{v}%</span>
            </div>
          ))}
        </div>
        <div className="seg-persona">
          <div className="seg-persona-label">AI Persona</div>
          <p>{seg.persona}</p>
        </div>
        <div className="seg-persona">
          <div className="seg-persona-label" style={{ color: "#B8943F" }}>Campaign Strategy</div>
          <p>{seg.strategy}</p>
        </div>
      </div>
    </>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  if (sent) return (
    <div className="form-success">
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✓</div>
      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.1rem", fontFamily: "var(--font-display)", marginBottom: "0.2rem" }}>Message sent</div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Thanks for reaching out — I'll respond within 24 hours.</div>
    </div>
  );
  return (
    <>
      <div className="contact-form-title">Send a message</div>
      <div className="contact-form">
        <div className="form-row">
          <div className="form-group"><label>Name</label><input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="form-group"><label>Email</label><input className="form-input" placeholder="you@company.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        </div>
        <div className="form-group"><label>Subject</label><input className="form-input" placeholder="Role, project, or idea" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
        <div className="form-group"><label>Message</label><textarea className="form-textarea" placeholder="Tell me about what you're working on..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
        <button className="form-submit" onClick={() => { if (form.name && form.email && form.message) setSent(true); }}>Send Message →</button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

export default function Portfolio() {
  const scrollY = useScrollY();
  const [mobileNav, setMobileNav] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [caseStudy, setCaseStudy] = useState(null);

  const navItems = [
    { label: "About", id: "about" }, { label: "Expertise", id: "expertise" },
    { label: "Projects", id: "projects" }, { label: "Demos", id: "demos" },
    { label: "Stack", id: "stack" }, { label: "Experience", id: "experience" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="portfolio-root">
        <div className="ambient-bg"><div className="ambient-orb" /><div className="ambient-orb" /><div className="ambient-orb" /></div>
        <div className="noise" />

        <nav className={`nav ${scrollY > 50 ? "scrolled" : ""}`}>
          <div className="nav-inner">
            <a className="nav-logo" href="#" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Karthikraj<span>.</span></a>
            <ul className="nav-links">
              {navItems.map(item => (<li key={item.id}><a onClick={() => smoothScroll(item.id)}>{item.label}</a></li>))}
              <li><a className="nav-cta" onClick={() => smoothScroll("contact")}>Let's Connect</a></li>
            </ul>
            <button className="mobile-toggle" onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? "✕" : "☰"}</button>
          </div>
        </nav>
        <div className={`mobile-nav ${mobileNav ? "open" : ""}`}>
          {navItems.map(item => (<a key={item.id} onClick={() => { smoothScroll(item.id); setMobileNav(false); }}>{item.label}</a>))}
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <AnimatedSection><div className="hero-badge"><span className="hero-badge-dot" />Open to Data, AI & Marketing Science roles in Canada</div></AnimatedSection>
            <AnimatedSection delay={100}><h1 className="hero-name">Karthikraj<br /><span className="accent">Subramanian</span></h1></AnimatedSection>
            <AnimatedSection delay={200}><p className="hero-desc">Driven by curiosity for statistics and a passion for intelligent systems, I build at the intersection of data, machine learning, customer analytics, and marketing strategy. My background in Computer Science and Business Analysis helps me bridge technical depth with business value — creating solutions that are both rigorous and practical.</p></AnimatedSection>
            <AnimatedSection delay={300}><div className="hero-ctas"><button className="btn-primary" onClick={() => smoothScroll("demos")}>Try Live Demos →</button><button className="btn-secondary" onClick={() => smoothScroll("projects")}>Explore Projects</button></div></AnimatedSection>
            <AnimatedSection delay={400}>
              <div className="hero-metrics">
                {[["3+ Years","Analytics & ML"],["6 Projects","Production Portfolio"],["ML + LLM","Applied AI"],["Full Stack","Data → Decision"]].map(([v,l],i) => (
                  <div key={i}><div className="hero-metric-value">{v}</div><div className="hero-metric-label">{l}</div></div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section" id="about">
          <AnimatedSection>
            <span className="section-label">About</span>
            <h2 className="section-title">Where Analytics Meets<br />Business Intelligence</h2>
            <div className="section-rule" />
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.25rem", marginTop: "2rem" }}>
            <AnimatedSection delay={100}>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "0.9rem" }}>I'm a Data & AI professional based in Toronto with 3+ years spanning marketing analytics, machine learning, customer intelligence, and analytics engineering. My work sits at the intersection of data science and business strategy — I build systems that make decisions better.</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.8 }}>Most energized by problems at the intersection of ecommerce, marketing science, customer behavior, and applied AI — where the right system directly moves revenue, retention, and experience metrics.</p>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {[["Core Strength","Connecting ML & analytics to measurable business outcomes"],["Domain Focus","Ecommerce, marketing science, customer intelligence, finance"],["Approach","Design backward from the business decision, not forward from the data"],["Philosophy","The best analytical systems feel invisible — they make good decisions effortless"]].map(([label, text], i) => (
                  <div key={i} style={{ padding: "0.9rem 1rem", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-glass)" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.15rem" }}>{label}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{text}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* EXPERTISE */}
        <section className="section" id="expertise">
          <AnimatedSection>
            <span className="section-label">Expertise</span>
            <h2 className="section-title">What I Build</h2>
            <p className="section-desc">Capabilities spanning the full data-to-decision pipeline.</p>
            <div className="section-rule" />
          </AnimatedSection>
          <div className="expertise-grid">
            {EXPERTISE.map((exp, i) => (
              <AnimatedSection key={i} delay={i * 60}><div className="card" style={{ height: "100%" }}>
                <div className="expertise-card-icon">{exp.icon}</div>
                <div className="expertise-card-title">{exp.title}</div>
                <div className="expertise-card-desc">{exp.desc}</div>
                <div className="expertise-card-cases">↳ {exp.cases}</div>
              </div></AnimatedSection>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className="section" id="projects">
          <AnimatedSection>
            <span className="section-label">Featured Projects</span>
            <h2 className="section-title">Production-Grade Portfolio</h2>
            <p className="section-desc">Applied ML, LLM systems, marketing science, and AI agents — each solving real business problems.</p>
            <div className="section-rule" />
          </AnimatedSection>
          <div className="projects-grid">
            {PROJECTS.map((proj, i) => (
              <AnimatedSection key={proj.id} delay={i * 70}><div className="card project-card">
                <div className="project-card-accent" />
                <div className="project-card-header">
                  <span className="project-card-icon">{proj.icon}</span>
                  {proj.isAgent && <span className="project-card-badge">AI Agent</span>}
                </div>
                <div className="project-card-title">{proj.title}</div>
                <div className="project-card-subtitle">{proj.subtitle}</div>
                <div className="project-card-problem">{proj.problem}</div>
                <div className="project-card-tags">{proj.tags.slice(0, 4).map((t, j) => (<span key={j} className="project-tag">{t}</span>))}</div>
                <div className="project-card-actions">
                  <button className="project-btn project-btn-primary" onClick={() => { const m = {"commerce-copilot":0,"segmentation-studio":1,"growth-agent":2}; if (m[proj.id]!==undefined) setActiveDemo(m[proj.id]); smoothScroll("demos"); }}>Live Demo</button>
                  <button className="project-btn project-btn-secondary" onClick={() => setCaseStudy(proj)}>Case Study</button>
                </div>
              </div></AnimatedSection>
            ))}
          </div>
        </section>

        {/* DEMOS */}
        <section className="section" id="demos">
          <AnimatedSection>
            <span className="section-label">Interactive Demo Lab</span>
            <h2 className="section-title">Try the Systems</h2>
            <p className="section-desc">Real product thinking, not just technical capability.</p>
            <div className="section-rule" />
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="demo-tabs" style={{ marginTop: "1.75rem" }}>
              {["🛒 Commerce Copilot","👥 Segmentation Studio","🤖 Growth Agent"].map((label, id) => (
                <button key={id} className={`demo-tab ${activeDemo === id ? "active" : ""}`} onClick={() => setActiveDemo(id)}>{label}</button>
              ))}
            </div>
            <div className="demo-container">
              {activeDemo === 0 && <ChatDemo title="Conversational Commerce Copilot" responses={COPILOT_RESPONSES} placeholder="Try: 'running shoes' or 'gift for wife'..." samplePrompts={["running shoes","gift for wife","wireless headphones"]} />}
              {activeDemo === 1 && <SegmentationDemo />}
              {activeDemo === 2 && <ChatDemo title="Commerce & Growth Decision Agent" responses={AGENT_RESPONSES} placeholder="Ask a business question..." samplePrompts={["why are conversions down","which segments should we target","compare channel performance"]} />}
            </div>
          </AnimatedSection>
        </section>

        {/* ML ARCHITECTURE */}
        <section className="section" id="architecture">
          <AnimatedSection>
            <span className="section-label">System Architecture</span>
            <h2 className="section-title">How I Build ML Systems</h2>
            <p className="section-desc">Layered, production-oriented — designed backward from the business decision.</p>
            <div className="section-rule" />
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="arch-flow">
              {ARCH_LAYERS.map((layer, i) => (
                <div className="arch-layer" key={i}>
                  <div className="arch-layer-label">{layer.layer}</div>
                  <div className="arch-layer-items">{layer.items.map((item, j) => (<span className="arch-item" key={j}>{item}</span>))}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <div className="philosophy-grid">
            {[["Decision-Backward Design","Start from the business decision, design the system that enables it."],["Models as Products","Ships with monitoring, docs, and stakeholder interfaces."],["Explainability First","If it can't explain reasoning in business terms, it doesn't ship."],["Measurable Impact","Every system ties to a KPI. No metric, no deploy."]].map(([t,d], i) => (
              <AnimatedSection key={i} delay={i * 60 + 200}><div className="philosophy-item"><h4>{t}</h4><p>{d}</p></div></AnimatedSection>
            ))}
          </div>
        </section>

        {/* TECH STACK */}
        <section className="section" id="stack">
          <AnimatedSection>
            <span className="section-label">Tech Stack</span>
            <h2 className="section-title">Tools & Technologies</h2>
            <div className="section-rule" />
          </AnimatedSection>
          <div className="stack-categories">
            {Object.entries(TECH_STACK).map(([cat, tools], i) => (
              <AnimatedSection key={cat} delay={i * 45}><div className="card" style={{ height: "100%" }}>
                <div className="stack-category-title">{cat}</div>
                <div className="stack-items">{tools.map((t, j) => (<span key={j} className="stack-item">{t}</span>))}</div>
              </div></AnimatedSection>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="section" id="experience">
          <AnimatedSection>
            <span className="section-label">Experience</span>
            <h2 className="section-title">Professional Journey</h2>
            <div className="section-rule" />
          </AnimatedSection>
          <div className="exp-timeline">
            {EXPERIENCE.map((exp, i) => (
              <AnimatedSection key={i} delay={i * 80}><div className="card">
                <div className="exp-card-header">
                  <div><div className="exp-role">{exp.role}</div><div className="exp-company">{exp.company} — {exp.location}</div></div>
                  <span className="exp-period">{exp.period}</span>
                </div>
                <div className="exp-highlights">{exp.highlights.map((h, j) => (<div key={j} className="exp-highlight">{h}</div>))}</div>
              </div></AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={250}>
            <div style={{ marginTop: "1.25rem" }}>
              <span className="section-label">Education</span>
              <div className="edu-row">{EDUCATION.map((edu, i) => (
                <div key={i} className="edu-card"><div className="edu-degree">{edu.degree}</div><div className="edu-school">{edu.school}</div><div className="edu-period">{edu.period}</div></div>
              ))}</div>
            </div>
          </AnimatedSection>
        </section>

        {/* WHY */}
        <section className="section">
          <AnimatedSection>
            <span className="section-label">Value Proposition</span>
            <h2 className="section-title">Why Work With Me</h2>
            <div className="section-rule" />
          </AnimatedSection>
          <div className="why-grid">
            {[["🔗","Technical Depth + Business Fluency","Bridge advanced ML systems and executive decision-making."],["🎯","Customer-Centric AI","Every system designed around the end user."],["🏗️","Production Mindset","Monitoring, explainability, clean APIs, stakeholder-ready interfaces."],["📊","Marketing Science Depth","Incrementality, attribution, experimentation, campaign analytics."],["⚡","Full-Stack Analytics","Raw pipelines → ML models → interactive dashboards."],["💬","Clear Communication","Complex findings become clear narratives."]].map(([icon,title,desc], i) => (
              <AnimatedSection key={i} delay={i * 60}><div className="card" style={{ height: "100%" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.25rem" }}>{title}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</div>
              </div></AnimatedSection>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact">
          <AnimatedSection>
            <span className="section-label">Connect</span>
            <h2 className="section-title">Let's Build Something<br /><span style={{ color: "var(--accent)" }}>Intelligent</span></h2>
            <div className="section-rule" />
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="contact-wrapper">
              <div className="contact-top">
                <div className="contact-top-text">
                  <h3>Have a project or role <span>in mind?</span></h3>
                  <p>Whether it's a data science challenge, an AI product idea, a marketing analytics problem, or a team that needs someone who bridges technical and business — I'm all ears.</p>
                </div>
                <div className="contact-quick-links">
                  <a href="mailto:karthicksubramani97@gmail.com" className="contact-pill"><span className="contact-pill-icon">✉</span> Email</a>
                  <a href="https://linkedin.com/in/karthik-raj" target="_blank" rel="noopener noreferrer" className="contact-pill"><span className="contact-pill-icon">↗</span> LinkedIn</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-pill"><span className="contact-pill-icon">↗</span> GitHub</a>
                </div>
              </div>
              <div className="contact-divider" />
              <div className="contact-bottom">
                <div className="contact-form-side">
                  <ContactForm />
                </div>
                <div className="contact-details-side">
                  <div className="contact-details-title">Details</div>
                  <div className="contact-detail-item">
                    <div className="contact-detail-label">Email</div>
                    <div className="contact-detail-value"><a href="mailto:karthicksubramani97@gmail.com">karthicksubramani97@gmail.com</a></div>
                  </div>
                  <div className="contact-detail-item">
                    <div className="contact-detail-label">Phone</div>
                    <div className="contact-detail-value">+1 (437) 974-9725</div>
                  </div>
                  <div className="contact-detail-item">
                    <div className="contact-detail-label">Location</div>
                    <div className="contact-detail-value">Ontario, Canada</div>
                  </div>
                  <div className="contact-detail-item">
                    <div className="contact-detail-label">Preferred Roles</div>
                    <div className="contact-detail-value" style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>Data Scientist, ML Engineer, Marketing Science Analyst, Analytics Engineer, AI Solutions</div>
                  </div>
                  <div className="contact-status">
                    <span className="contact-status-dot" />
                    <div className="contact-status-text"><strong>Available</strong> — open to full-time, contract, and consulting opportunities across Canada</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <footer className="footer"><p>© 2026 Karthikraj Subramanian</p></footer>
        {caseStudy && <CaseStudyModal project={caseStudy} onClose={() => setCaseStudy(null)} />}
      </div>
    </>
  );
}
