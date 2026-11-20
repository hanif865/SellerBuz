import { useMemo, useState } from "react";
import { BrandWordmark, LogoMark } from "./components/Brand";
import {
  Package,
  Layers,
  Rocket,
  Building2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  CalendarClock,
  Ban,
  ArrowRight,
  Plus,
  Minus,
  Star,
  BarChart3,
  Zap,
  Crown,
  Box,
  Calculator,
  BadgeCheck,
  Clock3,
  CreditCard,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Menu,
  Store,
  UserCheck,
  MessageCircle,
  Truck,
  DollarSign,
  Users2,
  PackageCheck,
  Columns3,
  LayoutList,
  MoveHorizontal,
  Loader2,
} from "lucide-react";

/* -------------------------------- CONSTANTS -------------------------------- */

/* WhatsApp number is intentionally kept private — only chat buttons are shown */
const WHATSAPP_CLEAN = "8801820701947";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_CLEAN}?text=${encodeURIComponent(
  "Hello SellerBuz team, I would like to discuss a custom plan and services for my business."
)}`;

/* FormSubmit.co destination for all trial / package / inquiry leads */
const FORMSUBMIT_EMAIL = "bellal24hr@gmail.com";
const FORMSUBMIT_AJAX = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;

async function submitToFormSubmit(fields: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(FORMSUBMIT_AJAX, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _template: "table",
        _captcha: "false",
        _subject: "SellerBuz CRM — New Inquiry",
        ...fields,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.length >= 8 && d.length <= 15;
};

/* ---------------------------------- DATA ---------------------------------- */

type PlanId = "basic" | "advance" | "ultra";
type CompareTabId = PlanId | "custom";
type Currency = "BDT" | "USD";

interface Plan {
  id: PlanId;
  name: string;
  short: string;
  tagline: string;
  price: number;
  limit: number;
  rangeLabel: string;
  icon: React.ElementType;
  popular?: boolean;
  merchants: number;
  staff: number;
  features: string[];
  ctaNote: string;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic Package",
    short: "Basic",
    tagline: "For new merchants getting started with parcels & order tracking.",
    price: 3000,
    limit: 1000,
    rangeLabel: "1 to 1,000 parcel",
    icon: Package,
    merchants: 1,
    staff: 1,
    features: [
      "1 Merchant account",
      "1 Staff account included",
      "Regular update",
      "7 days free trial",
      "Cancel anytime",
      "Parcel tracking dashboard",
      "Email support",
    ],
    ctaNote: "Perfect for new merchants",
  },
  {
    id: "advance",
    name: "Advance Package",
    short: "Advance",
    tagline: "For growing merchants who need more parcels & a bigger team.",
    price: 5000,
    limit: 3000,
    rangeLabel: "1,001 to 3,000 parcel",
    icon: Layers,
    popular: true,
    merchants: 1,
    staff: 3,
    features: [
      "1 Merchant account",
      "3 Staff accounts included",
      "Regular update",
      "7 days free trial",
      "Cancel anytime",
      "Advanced analytics & reports",
      "Priority support",
    ],
    ctaNote: "Best for growing merchants",
  },
  {
    id: "ultra",
    name: "Ultra Package",
    short: "Ultra",
    tagline: "For high-volume merchants running a full operations team.",
    price: 10000,
    limit: 10000,
    rangeLabel: "3,001 to 10,000 parcel",
    icon: Rocket,
    merchants: 1,
    staff: 7,
    features: [
      "1 Merchant account",
      "7 Staff accounts included",
      "Regular update",
      "7 days free trial",
      "Cancel anytime",
      "API access & integrations",
      "24/7 dedicated support",
    ],
    ctaNote: "Maximum capacity & team seats",
  },
];

/* Curated feature suite sections */
const FEATURE_MODULES = [
  {
    category: "Orders & Parcels",
    tagline: "From order intake to final doorstep delivery",
    icon: PackageCheck,
    color: "from-blue-600 to-brand-600",
    bgSoft: "bg-blue-50 text-blue-700 border-blue-100",
    features: [
      { name: "Orders & New order", desc: "Fast single & bulk order creation with quick autocompletes." },
      { name: "Pre-orders", desc: "Track advance bookings, stock reserves & fulfillment ETA." },
      { name: "Follow-ups & Incomplete", desc: "Automated alerts for abandoned or pending customer carts." },
      { name: "Needs code & Store view", desc: "Verification queues and unified multi-store operational views." },
    ],
  },
  {
    category: "Courier & Fulfillment",
    tagline: "Invoicing, automated reconciliations & risk alerts",
    icon: Truck,
    color: "from-emerald-600 to-teal-600",
    bgSoft: "bg-emerald-50 text-emerald-700 border-emerald-100",
    features: [
      { name: "Packaging & Labels", desc: "Smart batch packaging, barcode scanning & courier thermal labels." },
      { name: "Courier invoice & Payments", desc: "Automated courier COD payment match and fee audits." },
      { name: "Partial deliveries", desc: "Handle return-to-origin, item swaps & partial acceptances cleanly." },
      { name: "Danger zone & Over danger", desc: "Flag high return-risk customers & fake orders before dispatch." },
    ],
  },
  {
    category: "Finance & Profitability",
    tagline: "True net profit with live cost deduction",
    icon: DollarSign,
    color: "from-amber-600 to-orange-600",
    bgSoft: "bg-amber-50 text-amber-700 border-amber-100",
    features: [
      { name: "Approx profit & Net earnings", desc: "Live profit calculation deducting item cost, ads, courier & returns." },
      { name: "Finance & Courier payments", desc: "Real-time receivables, COD cash collection & bank reconciliations." },
      { name: "Billing & Invoicing", desc: "Automated merchant statements, tax summaries & monthly billing." },
      { name: "Customer ledger", desc: "Full transaction trail, store credits & customer lifetime values." },
    ],
  },
  {
    category: "Team & Operations",
    tagline: "Control who sees what across every department",
    icon: Users2,
    color: "from-brand-600 to-purple-600",
    bgSoft: "bg-brand-50 text-brand-700 border-brand-100",
    features: [
      { name: "Merchants & Multi-stores", desc: "Manage multiple brands or vendor channels from one master hub." },
      { name: "Staff & Attendance", desc: "Log shift check-ins, daily hours & order handling attendance." },
      { name: "Custom roles & Permissions", desc: "Lock financial data, restrict export actions & isolate store views." },
      { name: "Staff performance", desc: "Track orders processed, calls handled and error rates per team member." },
    ],
  },
];

const FAQS = [
  {
    q: "How does the 7 days free trial work?",
    a: "Every plan includes a full 7-day free trial with complete access to the CRM. No credit card is required to start. If you decide to continue, your plan activates automatically after the trial — or you can choose a plan anytime during the trial period.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. All monthly recurring plans are cancel-anytime with no lock-in contract and no cancellation fees. You can cancel in one click from your dashboard, and you will keep access until the end of your current billing period.",
  },
  {
    q: "What does “Regular update” include?",
    a: "Regular updates mean your CRM stays current with the latest features, security patches, and carrier integrations — delivered automatically at no extra cost. You will always be on the newest version without any manual work.",
  },
  {
    q: "Can I upgrade or downgrade my parcel limit?",
    a: "Absolutely. You can move between Basic, Advance, and Ultra at any time. If you upgrade mid-month, we prorate the difference. If you downgrade, the new limit applies from your next billing cycle.",
  },
  {
    q: "How do Merchant and Staff accounts work?",
    a: "Every plan includes one Merchant account — the owner of the store with full access to billing, settings, and reports. Staff accounts are additional team logins for order processing, parcels, and customer handling without access to billing. Basic includes 1 Staff account, Advance includes 3, and Ultra includes 7.",
  },
  {
    q: "What if I ship more than 10,000 parcels or need custom features?",
    a: "Our Custom Enterprise plan is specifically designed for high-volume merchants. We provide custom parcel capacity, unlimited staff, dedicated courier APIs, and direct WhatsApp support — tap any WhatsApp button on this page to talk to our team.",
  },
  {
    q: "What are “Danger zone” and “Over danger” features in SellerBuz?",
    a: "SellerBuz includes intelligent fraud-detection tools that analyze past delivery success rates across phone numbers and addresses. When an order matches known return-prone customers, it triggers 'Danger zone' or 'Over danger' alerts so your team can confirm COD before dispatch.",
  },
  {
    q: "Can international clients pay in USD?",
    a: "Yes. Use the currency toggle (৳ BDT / $ USD) near the pricing toggle. We convert at a flat friendly rate: Basic ৳3,000 = $30, Advance ৳5,000 = $50, and Ultra ৳10,000 = $100 per month. The 20% yearly discount applies in both currencies.",
  },
];

const fmt = (n: number) => n.toLocaleString("en-US");

/* ---------------------------------- APP ---------------------------------- */

export default function App() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<Currency>("BDT");
  const [parcels, setParcels] = useState(1800);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [customContactModal, setCustomContactModal] = useState(false);
  const [mobileCompareTab, setMobileCompareTab] = useState<CompareTabId>("advance");
  const [mobileTableMode, setMobileTableMode] = useState<"tabs" | "matrix">("tabs");

  const recommended: Plan = useMemo(() => {
    if (parcels <= 1000) return PLANS[0];
    if (parcels <= 3000) return PLANS[1];
    return PLANS[2];
  }, [parcels]);

  const priceFor = (plan: Plan) => (billing === "yearly" ? Math.round(plan.price * 0.8) : plan.price);
  const fillPct = ((parcels - 100) / (10000 - 100)) * 100;

  /* Currency conversion: ৳3,000 = $30 · ৳5,000 = $50 · ৳10,000 = $100 */
  const money = (bdt: number) =>
    currency === "BDT" ? `${fmt(bdt)}/=` : `$${fmt(Math.round(bdt / 100))}`;

  /* The equivalent in the other currency, useful for international clients */
  const altMoney = (bdt: number) =>
    currency === "BDT"
      ? `≈ $${fmt(Math.round(bdt / 100))} USD`
      : `≈ ৳${fmt(bdt)} BDT`;

  const comparisonRows: {
    label: string;
    note?: string;
    values: (string | boolean)[];
    custom: string | boolean;
    was?: (string | boolean)[];
    highlight?: boolean;
  }[] = [
    {
      label: "Monthly parcel limit",
      values: PLANS.map((p) => p.rangeLabel),
      custom: "10,000+ parcels (Custom volume)",
      highlight: true,
    },
    {
      label: "Price per month",
      note: billing === "yearly" ? "20% yearly discount applied" : "Billed monthly",
      values: PLANS.map((p) => money(priceFor(p))),
      was: PLANS.map((p) => money(p.price)),
      custom: "Tailored to volume",
      highlight: true,
    },
    {
      label: "Regular update",
      values: [true, true, true],
      custom: "Early access + Custom patches",
    },
    {
      label: "7 days free trial",
      values: [true, true, true],
      custom: "Custom POC & Demo",
    },
    {
      label: "Cancel anytime",
      values: [true, true, true],
      custom: "Flexible contract / SLA",
    },
    {
      label: "Merchant account",
      note: "Full owner access to billing & settings",
      values: PLANS.map((p) => `${p.merchants} Merchant`),
      custom: "Multi-merchant / Multi-store",
      highlight: true,
    },
    {
      label: "Staff accounts",
      note: "Team logins for order processing & calls",
      values: PLANS.map((p) => `${p.staff} Staff`),
      custom: "Unlimited / Custom seats",
      highlight: true,
    },
    {
      label: "Orders, Pre-orders & Follow-ups",
      note: "Quick orders, pre-order ETA & abandoned follow-ups",
      values: ["Orders only", "Orders + Follow-ups", true],
      custom: "Full suite + Bulk upload tools",
    },
    {
      label: "Packaging & Thermal labels",
      note: "Batch scan & direct courier thermal printing",
      values: [true, true, true],
      custom: "Automated warehouse scan workflow",
    },
    {
      label: "Danger zone & Over danger",
      note: "High-risk customer fraud detection before shipping",
      values: ["Basic alerts", true, true],
      custom: "Enterprise AI fraud scoring",
    },
    {
      label: "Courier invoice & Payments",
      note: "COD reconciliation & partial deliveries",
      values: ["Manual match", true, true],
      custom: "Auto bank & COD reconciliation",
    },
    {
      label: "Earnings & Approx profit",
      note: "Real-time net margin deducting item cost & courier",
      values: ["Basic reports", true, true],
      custom: "Multi-currency financial suite",
    },
    {
      label: "Staff attendance & Performance",
      note: "Shift tracking, call logs & order processing KPI",
      values: [false, "Basic logs", true],
      custom: "Advanced KPI dashboards & audits",
    },
    {
      label: "API & Integrations",
      values: [false, "Webhooks", "Full REST API"],
      custom: "Custom courier & ERP connectors",
    },
    {
      label: "Dedicated Support",
      values: ["Email support", "Priority support", "24/7 dedicated support"],
      custom: "WhatsApp line + Account Manager",
      highlight: true,
    },
  ];

  const activeMobilePlan = useMemo(
    () => PLANS.find((p) => p.id === mobileCompareTab) ?? null,
    [mobileCompareTab]
  );

  const activeMobilePlanIdx = useMemo(
    () => PLANS.findIndex((p) => p.id === mobileCompareTab),
    [mobileCompareTab]
  );

  const billingToggle = (
    <div className="inline-flex items-center bg-white border border-slate-200 p-1 rounded-full shadow-sm">
      <button
        onClick={() => setBilling("monthly")}
        className={`px-5 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
          billing === "monthly" ? "bg-brand-900 text-white shadow" : "text-slate-600 hover:text-slate-950"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setBilling("yearly")}
        className={`px-4 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 ${
          billing === "yearly" ? "bg-brand-900 text-white shadow" : "text-slate-600 hover:text-slate-950"
        }`}
      >
        <span>Yearly</span>
        <span
          className={`text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${
            billing === "yearly" ? "bg-emerald-400 text-emerald-950" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          SAVE 20%
        </span>
      </button>
    </div>
  );

  const currencyToggle = (
    <div className="inline-flex items-center bg-white border border-slate-200 p-1 rounded-full shadow-sm">
      <button
        onClick={() => setCurrency("BDT")}
        className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
          currency === "BDT" ? "bg-brand-600 text-white shadow" : "text-slate-600 hover:text-slate-950"
        }`}
        title="Prices in Bangladeshi Taka"
      >
        ৳ BDT
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
          currency === "USD" ? "bg-brand-600 text-white shadow" : "text-slate-600 hover:text-slate-950"
        }`}
        title="Prices in US Dollars"
      >
        $ USD
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-900 overflow-x-clip">
      {/* Top Banner with WhatsApp quick action (number kept private) */}
      <div className="bg-brand-900 text-white text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-6 relative z-30 border-b border-brand-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-accent-500/15 text-accent-300 border border-accent-400/30 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-300 shrink-0" />
              <span>7 Days Free</span>
              <span className="hidden sm:inline">Trial</span>
            </span>
            <span className="text-slate-300 hidden md:inline">No credit card required · Cancel anytime</span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden lg:inline text-emerald-400 font-medium">Save 20% on yearly plans</span>
            <span className="hidden xl:inline text-slate-500">•</span>
            <span className="hidden xl:inline text-slate-300">🌍 BDT &amp; USD pricing</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium">
            <span className="text-slate-400 hidden sm:inline">Custom needs &amp; 24/7 support:</span>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 sm:px-3 py-1 rounded-full font-bold transition shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-[68px] flex items-center justify-between gap-3">
          <a href="#" className="min-w-0 shrink" aria-label="SellerBuz home">
            <BrandWordmark />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#plans" className="hover:text-slate-950 transition">Plans</a>
            <a href="#services" className="hover:text-slate-950 transition">Platform Features</a>
            <a href="#compare" className="hover:text-slate-950 transition">Comparison</a>
            <a href="#custom-section" className="hover:text-slate-950 transition">Custom Enterprise</a>
            <a href="#faq" className="hover:text-slate-950 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-full transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>WhatsApp Us</span>
            </a>
            <button
              onClick={() => setSelectedPlan(recommended)}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-900 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-brand-800 transition shadow-lg shadow-brand-900/15"
            >
              <span>Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 active:bg-slate-100 transition"
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <>
            <div
              className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-brand-900/30 backdrop-blur-[2px] z-30"
              onClick={() => setMobileMenu(false)}
            />
            <div className="lg:hidden relative z-40 border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-1 text-sm font-medium animate-fadeIn shadow-xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
              <a href="#plans" onClick={() => setMobileMenu(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition">
                Pricing Plans
              </a>
              <a href="#services" onClick={() => setMobileMenu(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition">
                Platform Features
              </a>
              <a href="#compare" onClick={() => setMobileMenu(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition">
                Comparison Table
              </a>
              <a href="#custom-section" onClick={() => setMobileMenu(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition">
                Custom Enterprise (10k+ Parcels)
              </a>
              <a href="#faq" onClick={() => setMobileMenu(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition">
                Frequently Asked Questions
              </a>
              <div className="pt-2 mt-1 border-t border-slate-100 flex flex-col gap-2.5">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" /> Chat on WhatsApp
                </a>
                <button
                  onClick={() => {
                    setSelectedPlan(recommended);
                    setMobileMenu(false);
                  }}
                  className="bg-brand-900 text-white font-semibold py-3 rounded-xl"
                >
                  Start 7-Day Free Trial
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      {/* HERO / PRICING HEADER */}
      <section className="relative bg-grid">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-20 pb-8 sm:pb-10 text-center">
          <div className="animate-fadeUp inline-flex items-center justify-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full pl-2 pr-3.5 py-1.5 text-xs sm:text-[13px] font-medium text-slate-600 max-w-full">
            <span className="bg-accent-500 text-white text-[10px] sm:text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-full shrink-0">
              CRM
            </span>
            <span className="truncate">SellerBuz Monthly Recurring Plans</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          </div>

          <h1 className="animate-fadeUp delay-100 font-display font-extrabold tracking-tight text-[32px] leading-[1.12] sm:text-5xl md:text-6xl lg:text-[68px] sm:leading-[1.06] mt-5 sm:mt-6 text-slate-950">
            Simple pricing that<br className="hidden sm:block" /> scales with your{" "}
            <span className="relative inline-block text-accent-500">
              parcels.
              <svg
                className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full"
                height="10"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7 Q 100 -2 198 6"
                  stroke="#F97316"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.75"
                />
              </svg>
            </span>
          </h1>

          <p className="animate-fadeUp delay-200 max-w-2xl mx-auto mt-4 sm:mt-6 text-[15px] sm:text-lg text-slate-600 leading-relaxed">
            Choose the plan that fits your monthly parcel volume and team size. Every package includes Merchant &amp; Staff logins, regular updates, a 7-day free trial, and cancel anytime.
          </p>

          {/* Trust stats */}
          <div className="animate-fadeUp delay-300 mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-600">
            <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
              <span className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                ))}
              </span>
              <span>
                <strong className="text-slate-900">4.9/5</strong> from 2,400+ SellerBuz merchants
              </span>
            </span>
            <span className="hidden sm:block w-px h-4 bg-slate-300" />
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="w-4 h-4 text-brand-600 shrink-0" /> Setup in under 5 minutes
              </span>
            </div>
          </div>

          {/* Billing + Currency toggles */}
          <div className="animate-fadeUp delay-300 mt-8 sm:mt-10 flex flex-col items-center gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
              {billingToggle}
              {currencyToggle}
            </div>
            <p className="text-xs text-slate-500 px-2">
              {billing === "yearly"
                ? "Billed annually — 20% off every recurring package."
                : "Billed monthly. Switch to yearly anytime and get 20% off."}{" "}
              {currency === "USD"
                ? "International rate: $30 = ৳3,000 · $50 = ৳5,000 · $100 = ৳10,000."
                : "Prices shown in Bangladeshi Taka (৳)."}
            </p>
          </div>
        </div>
      </section>

      {/* PARCEL CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-1">
        <div className="animate-fadeUp delay-200 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/[0.04] p-5 sm:p-8">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 sm:gap-8 items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-600" />
                </span>
                <h2 className="font-display font-bold text-base sm:text-xl">Find your perfect plan</h2>
                <span className="hidden sm:inline text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-full">
                  Interactive
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6 leading-relaxed">
                Drag the slider to your monthly parcel volume — we will highlight the recommended package instantly.
              </p>

              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <label className="text-xs sm:text-sm font-medium text-slate-700">Parcels per month</label>
                <div className="text-right">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950">{fmt(parcels)}</span>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium"> parcels</span>
                </div>
              </div>

              <div className="py-1">
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={100}
                  value={parcels}
                  onChange={(e) => setParcels(Number(e.target.value))}
                  className="w-full block"
                  style={{ "--fill": `${fillPct}%` } as React.CSSProperties}
                  aria-label="Parcels per month"
                />
              </div>
              <div className="flex justify-between gap-1 text-[10px] sm:text-xs font-medium text-slate-500 mt-2">
                <span>100</span>
                <span className="text-brand-600 font-semibold">
                  <span className="sm:hidden">1k · Basic</span>
                  <span className="hidden sm:inline">1,000 · Basic</span>
                </span>
                <span className="text-brand-600 font-semibold">
                  <span className="sm:hidden">3k · Adv</span>
                  <span className="hidden sm:inline">3,000 · Advance</span>
                </span>
                <span>
                  <span className="sm:hidden">10k · Ultra</span>
                  <span className="hidden sm:inline">10,000 · Ultra</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-5">
                {[500, 1000, 2500, 5000, 9000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setParcels(v)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                      parcels === v
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700"
                    }`}
                  >
                    {fmt(v)}
                    <span className="hidden sm:inline"> parcels</span>
                  </button>
                ))}
                <a
                  href="#custom-section"
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-dashed border-brand-300 text-brand-700 bg-brand-50/50 hover:bg-brand-50 transition"
                >
                  10,000+? Custom →
                </a>
              </div>
            </div>

            <div className="bg-brand-900 text-white rounded-2xl p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-dark opacity-60 pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <p className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-brand-300">
                  Recommended for you
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    {(() => {
                      const Icon = recommended.icon;
                      return <Icon className="w-5 h-5 text-white" />;
                    })()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-lg sm:text-xl leading-tight truncate">{recommended.name}</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{recommended.rangeLabel} / month</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-5 flex flex-wrap items-end gap-x-2 gap-y-1">
                  <span className="font-display font-extrabold text-3xl sm:text-4xl leading-none">
                    {money(priceFor(recommended))}
                  </span>
                    <span className="text-slate-400 text-xs sm:text-sm mb-0.5">/ month</span>
                    {billing === "yearly" && (
                      <span className="text-slate-500 line-through text-xs sm:text-sm mb-0.5">
                        {money(recommended.price)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-accent-300 font-semibold mt-1.5">
                    {altMoney(priceFor(recommended))} for international clients
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2.5">
                  Covers up to {fmt(recommended.limit)} parcels — you need {fmt(parcels)}.
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Includes <strong className="text-white">{recommended.merchants} Merchant</strong> +{" "}
                  <strong className="text-white">{recommended.staff} Staff</strong> accounts.
                </p>
                <button
                  onClick={() => setSelectedPlan(recommended)}
                  className="mt-5 w-full bg-white text-slate-950 font-semibold px-4 py-3 rounded-xl hover:bg-brand-50 transition flex items-center justify-center gap-2 text-sm text-center"
                >
                  <span>Choose {recommended.short} — Free Trial</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">7 days free · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL PRICING / CURRENCY CONVERSION */}
      <section id="currency" className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 scroll-mt-20">
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-900/[0.03] p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                <LogoMark className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display font-bold text-base sm:text-lg text-slate-950">
                    International clients pay in USD
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-accent-50 text-accent-700 border border-accent-200 px-2 py-0.5 rounded-full">
                    Global pricing
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                  Switch currency to see your rate instantly. Fixed conversion: ৳3,000 = $30 · ৳5,000 = $50 · ৳10,000 = $100 per month.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {currencyToggle}
              <span className="text-xs text-slate-500">
                {currency === "USD" ? "Showing USD" : "Showing BDT"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            {[
              { bdt: 3000, usd: 30, plan: "Basic" },
              { bdt: 5000, usd: 50, plan: "Advance" },
              { bdt: 10000, usd: 100, plan: "Ultra" },
            ].map((rate, i) => (
              <div
                key={rate.plan}
                className={`rounded-2xl border p-3.5 sm:p-4 flex items-center justify-between gap-2 ${
                  i === 1 ? "border-brand-200 bg-brand-50/60" : "border-slate-200 bg-slate-50/70"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{rate.plan}</p>
                  <p className="font-display font-extrabold text-lg sm:text-xl text-slate-950 leading-tight">
                    {currency === "USD" ? `$${rate.usd}` : `৳${fmt(rate.bdt)}`}
                    <span className="text-[11px] font-medium text-slate-500"> /mo</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-slate-400">equals</p>
                  <p className="text-xs sm:text-sm font-bold text-accent-600">
                    {currency === "USD" ? `৳${fmt(rate.bdt)}` : `$${rate.usd} USD`}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            The 20% yearly discount applies in both currencies. Applicable bank / gateway fees may apply on international cards.
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-6 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch max-w-xl mx-auto lg:max-w-none">
          {PLANS.map((plan, idx) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;
            const isRecommended = recommended.id === plan.id;
            const price = priceFor(plan);
            const usage = Math.min(100, Math.round((parcels / plan.limit) * 100));
            const overLimit = parcels > plan.limit;

            return (
              <article
                key={plan.id}
                className={`animate-fadeUp relative rounded-3xl sm:rounded-[28px] p-5 sm:p-7 xl:p-8 flex flex-col transition-all duration-300 lg:hover:-translate-y-2 ${
                  idx === 1 ? "delay-100" : idx === 2 ? "delay-200" : ""
                } ${
                  isPopular
                    ? "bg-brand-900 text-white shadow-2xl shadow-brand-900/25 lg:scale-[1.03] ring-1 ring-slate-800 z-10"
                    : "bg-white border border-slate-200 shadow-lg shadow-slate-900/[0.04] hover:shadow-xl hover:shadow-slate-900/[0.07]"
                } ${isRecommended && !isPopular ? "ring-2 ring-brand-600 ring-offset-2 ring-offset-[#F6F7FB]" : ""} ${
                  isRecommended && isPopular ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-[#F6F7FB]" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute inset-0 rounded-3xl sm:rounded-[28px] overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-grid-dark opacity-50" />
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-600/25 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-brand-600/20 rounded-full blur-3xl" />
                  </div>
                )}

                {/* Badges */}
                <div className="relative flex items-start justify-between gap-2 min-h-[28px]">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {isPopular && (
                      <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] sm:text-[11px] font-extrabold tracking-wide px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase">
                        <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Most Popular
                      </span>
                    )}
                    {isRecommended && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold tracking-wide px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase bg-brand-600 text-white">
                        <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Recommended
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] font-bold tracking-widest uppercase shrink-0 ${isPopular ? "text-slate-500" : "text-slate-400"}`}>
                    0{idx + 1}
                  </span>
                </div>

                <div className="relative mt-4 sm:mt-5">
                  <span
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${
                      isPopular ? "bg-white/10 border border-white/15" : "bg-brand-50 border border-brand-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isPopular ? "text-white" : "text-brand-600"}`} />
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-[22px] mt-3.5 sm:mt-4">{plan.name}</h3>
                  <p className={`text-sm leading-relaxed mt-1.5 ${isPopular ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Parcel capacity */}
                <div
                  className={`relative mt-5 rounded-2xl px-3.5 sm:px-4 py-3 sm:py-3.5 ${
                    isPopular ? "bg-white/[0.07] border border-white/10" : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase opacity-70`}>
                      <Box className={`w-4 h-4 shrink-0 ${isPopular ? "text-brand-300" : "text-brand-600"}`} />
                      Parcel capacity
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        overLimit
                          ? isPopular
                            ? "bg-rose-400/20 text-rose-300"
                            : "bg-rose-100 text-rose-700"
                          : isPopular
                          ? "bg-emerald-400/20 text-emerald-300"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {overLimit ? "Over limit" : `${usage}% used`}
                    </span>
                  </div>
                  <p className="font-semibold text-sm mt-1.5">
                    {plan.rangeLabel} <span className="opacity-60 font-normal">/ month</span>
                  </p>
                </div>

                {/* Usage bar */}
                <div className={`relative mt-3 h-1.5 rounded-full overflow-hidden ${isPopular ? "bg-white/10" : "bg-slate-200"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      overLimit
                        ? "bg-rose-500"
                        : isPopular
                        ? "bg-gradient-to-r from-brand-400 to-brand-400"
                        : "bg-brand-600"
                    }`}
                    style={{ width: `${Math.min(100, usage)}%` }}
                  />
                </div>
                <p className={`relative text-[11px] mt-1.5 ${isPopular ? "text-slate-500" : "text-slate-400"}`}>
                  Your volume: {fmt(parcels)} of {fmt(plan.limit)} parcels
                </p>

                {/* Team seats */}
                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg ${
                      isPopular ? "bg-white/10 border border-white/10 text-slate-200" : "bg-slate-100 border border-slate-200 text-slate-700"
                    }`}
                  >
                    <Store className={`w-3.5 h-3.5 shrink-0 ${isPopular ? "text-brand-300" : "text-brand-600"}`} /> 1 Merchant
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg ${
                      isPopular ? "bg-white/10 border border-white/10 text-slate-200" : "bg-slate-100 border border-slate-200 text-slate-700"
                    }`}
                  >
                    <UserCheck className={`w-3.5 h-3.5 shrink-0 ${isPopular ? "text-brand-300" : "text-brand-600"}`} /> {plan.staff} Staff
                  </span>
                </div>

                {/* Price */}
                <div className="relative mt-5 sm:mt-6 flex items-end gap-2 flex-wrap">
                  <span className="font-display font-extrabold text-[36px] sm:text-[42px] xl:text-[44px] leading-none tracking-tight">
                    {money(price)}
                  </span>
                  <span className={`text-xs sm:text-sm mb-1 ${isPopular ? "text-slate-400" : "text-slate-500"}`}>
                    / month
                  </span>
                  {billing === "yearly" && (
                    <span className={`text-xs sm:text-sm line-through mb-1 ${isPopular ? "text-slate-500" : "text-slate-400"}`}>
                      {money(plan.price)}
                    </span>
                  )}
                </div>
                <p className={`relative text-xs mt-1 font-semibold ${isPopular ? "text-accent-300" : "text-accent-600"}`}>
                  {altMoney(price)}
                </p>
                <p className={`relative text-xs mt-1 ${isPopular ? "text-slate-500" : "text-slate-400"}`}>
                  {billing === "yearly"
                    ? `Billed annually · ${money(price * 12)} per year · save ${money(plan.price - price)}/mo`
                    : currency === "BDT"
                    ? "Billed monthly · Switch to yearly & save 20%"
                    : "Billed monthly · Yearly saves 20%"}
                </p>

                <div className={`relative my-5 sm:my-6 h-px ${isPopular ? "bg-white/10" : "bg-slate-200"}`} />

                {/* Features */}
                <ul className="relative space-y-2.5 sm:space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 sm:gap-3 text-sm">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isPopular ? "bg-emerald-400/15 text-emerald-300" : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                      <span className={isPopular ? "text-slate-200" : "text-slate-700"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative mt-6 sm:mt-8 w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isPopular
                      ? "bg-white text-slate-950 hover:bg-brand-50 shadow-lg"
                      : "bg-brand-900 text-white hover:bg-brand-600 shadow-lg shadow-brand-900/10"
                  }`}
                >
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <p className={`relative text-center text-xs mt-3 ${isPopular ? "text-slate-500" : "text-slate-400"}`}>
                  {plan.ctaNote} · No card required
                </p>
              </article>
            );
          })}
        </div>

        {/* Custom enterprise teaser card */}
        <div className="mt-8 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-brand-900/40 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4">
            <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-300" />
            </span>
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full mb-1.5">
                For Bigger Merchants
              </div>
              <h3 className="font-display font-bold text-lg sm:text-2xl leading-snug">
                Need custom requirements or 10,000+ parcels?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                Custom staff seats, multi-merchant setup, custom courier API endpoints, and direct WhatsApp engineering support.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="#compare"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-white/20 text-white hover:bg-white/10 font-semibold px-4 py-3 rounded-xl transition text-sm text-center"
            >
              View in comparison
            </a>
          </div>
        </div>

        {/* Trust bar */}
        <div className="animate-fadeUp mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {[
            { icon: RefreshCw, title: "Regular Update", desc: "Always on the newest SellerBuz version, automatically." },
            { icon: CalendarClock, title: "7 Days Free Trial", desc: "Full access for 7 days. No credit card needed." },
            { icon: Ban, title: "Cancel Anytime", desc: "No lock-in, no fees. Cancel in one click." },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 hover:border-brand-200 hover:shadow-md transition"
            >
              <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-brand-600" />
              </span>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SALERSLAB PLATFORM SERVICES */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" /> Full Platform Capabilities
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight mt-4">
            Everything your operations need, under one roof
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            SellerBuz combines order tracking, warehouse packaging, courier invoicing, staff KPI, and real-time net profit
            so you never have to juggle multiple disconnected tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURE_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.category}
                className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${module.bgSoft}`}>
                    Included
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-950">{module.category}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 sm:mb-5">{module.tagline}</p>

                <div className="space-y-3.5 flex-1 border-t border-slate-100 pt-4">
                  {module.features.map((feat) => (
                    <div key={feat.name} className="text-xs">
                      <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        {feat.name}
                      </p>
                      <p className="text-slate-500 pl-3 mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight ticker of all built-in services */}
        <div className="mt-6 sm:mt-8 bg-slate-900 text-slate-300 rounded-2xl p-4 sm:p-5 border border-brand-800 text-xs">
          <div className="flex items-center gap-2 mb-3 text-white font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Built-in SellerBuz Engine Covers:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[11px]">
            {[
              "Dashboard",
              "Packaging",
              "Earnings",
              "Approx profit",
              "Courier invoice",
              "Products",
              "Analytics",
              "Finance",
              "Stores",
              "Staff",
              "Attendance",
              "Roles",
              "Merchants",
              "Courier payments",
              "Partial deliveries",
              "Billing",
              "Orders",
              "New order",
              "Pre-orders",
              "Store view",
              "Follow-ups",
              "Customers",
              "Incomplete",
              "Needs code",
              "Danger zone",
              "Over danger",
              "Staff performance",
            ].map((tag) => (
              <span
                key={tag}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 px-2.5 py-1 rounded-lg transition font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE (Mobile Plan Tabs + Optional Sticky Matrix, Full Desktop Table) */}
      <section id="compare" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-14 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
            <BarChart3 className="w-3.5 h-3.5" /> Detailed Comparison
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight mt-4">
            Compare all plans side by side
          </h2>
          <p className="text-slate-500 mt-2.5 sm:mt-3 text-sm sm:text-base leading-relaxed">
            Includes standard plans (Basic, Advance, Ultra) plus a dedicated column for custom requirements for high-volume merchants.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {billingToggle}
            {currencyToggle}

            {/* Mobile/Tablet View Mode Toggle */}
            <div className="lg:hidden inline-flex items-center bg-white border border-slate-200 p-1 rounded-full shadow-sm">
              <button
                onClick={() => setMobileTableMode("tabs")}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                  mobileTableMode === "tabs" ? "bg-brand-600 text-white" : "text-slate-600"
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>By Plan</span>
              </button>
              <button
                onClick={() => setMobileTableMode("matrix")}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                  mobileTableMode === "matrix" ? "bg-brand-600 text-white" : "text-slate-600"
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>All Columns</span>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE / TABLET PLAN-BY-PLAN VIEW (zero horizontal scroll!) */}
        {mobileTableMode === "tabs" && (
          <div className="lg:hidden bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/[0.04] overflow-hidden mb-2">
            {/* Sticky/Segmented Plan Tabs */}
            <div className="p-2 bg-brand-900 grid grid-cols-4 gap-1">
              {PLANS.map((p) => {
                const active = mobileCompareTab === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setMobileCompareTab(p.id)}
                    className={`py-2.5 px-1.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                      active
                        ? "bg-brand-600 text-white shadow"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate max-w-full">{p.short}</span>
                    {p.popular && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-300 leading-none">
                        Popular
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setMobileCompareTab("custom")}
                className={`py-2.5 px-1.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                  mobileCompareTab === "custom"
                    ? "bg-amber-400 text-slate-950 shadow"
                    : "text-amber-300/90 hover:bg-white/5"
                }`}
              >
                <span className="truncate max-w-full">Custom</span>
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-wider leading-none ${
                    mobileCompareTab === "custom" ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  10k+
                </span>
              </button>
            </div>

            {/* Selected Plan Summary Header */}
            {activeMobilePlan ? (
              <div className={`p-5 border-b border-slate-200 ${activeMobilePlan.popular ? "bg-brand-50/70" : "bg-slate-50/80"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-lg text-slate-950">{activeMobilePlan.name}</h3>
                      {activeMobilePlan.popular && (
                        <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {activeMobilePlan.rangeLabel} · {activeMobilePlan.merchants} Merchant · {activeMobilePlan.staff} Staff
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-extrabold text-2xl text-slate-950 leading-none">
                      {money(priceFor(activeMobilePlan))}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {billing === "yearly" ? (
                        <>
                          <s>{money(activeMobilePlan.price)}</s> · /mo
                        </>
                      ) : (
                        "per month"
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlan(activeMobilePlan)}
                  className="mt-4 w-full py-3 rounded-xl bg-brand-900 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  <span>Choose {activeMobilePlan.short} — Start 7-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ) : (
              <div className="p-5 border-b border-brand-900/20 bg-gradient-to-r from-slate-900 to-brand-950 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                      For Bigger Merchants
                    </span>
                    <h3 className="font-display font-bold text-lg">Custom / Enterprise</h3>
                    <p className="text-xs text-brand-200 mt-0.5">10,000+ parcels · Multi-store · Custom SLA</p>
                  </div>
                  <Building2 className="w-7 h-7 text-amber-300 shrink-0" />
                </div>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            )}

            {/* Feature Rows for Selected Mobile Tab */}
            <div className="divide-y divide-slate-100">
              {comparisonRows.map((row) => {
                const val = mobileCompareTab === "custom" ? row.custom : row.values[activeMobilePlanIdx];
                return (
                  <div
                    key={row.label}
                    className={`px-4 sm:px-5 py-3.5 flex items-start justify-between gap-4 ${
                      row.highlight ? "bg-slate-50/70" : "bg-white"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs sm:text-sm text-slate-800 ${row.highlight ? "font-semibold" : "font-medium"}`}>
                        {row.label}
                      </p>
                      {row.note && <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{row.note}</p>}
                    </div>
                    <div className="text-right shrink-0 max-w-[48%]">
                      {val === true ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs sm:text-sm font-semibold">
                          <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                          <span>{mobileCompareTab === "custom" ? "Full Suite" : "Included"}</span>
                        </span>
                      ) : val === false ? (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                          <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <X className="w-3 h-3 text-slate-400" strokeWidth={2.5} />
                          </span>
                          <span>—</span>
                        </span>
                      ) : mobileCompareTab !== "custom" && row.highlight && row.was ? (
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-950">{val}</span>
                          {billing === "yearly" && activeMobilePlan && (
                            <span className="block text-[10px] text-slate-400">
                              <s>{row.was[activeMobilePlanIdx]}</s> · −20%
                            </span>
                          )}
                        </div>
                      ) : mobileCompareTab === "custom" ? (
                        <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-brand-900 leading-snug">
                          <Sparkles className="w-3 h-3 text-brand-600 shrink-0" />
                          <span>{val}</span>
                        </span>
                      ) : (
                        <span
                          className={`text-xs sm:text-sm leading-snug ${
                            row.highlight ? "font-semibold text-slate-900" : "text-slate-600"
                          }`}
                        >
                          {val}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Card Footer */}
            <div className="px-4 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <button
                onClick={() => setMobileTableMode("matrix")}
                className="text-brand-600 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <Columns3 className="w-3.5 h-3.5 shrink-0" /> View all 4 columns side by side
              </button>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* FULL 5-COLUMN COMPARISON TABLE (Always visible on lg+, toggleable on mobile with sticky 1st column) */}
        <div
          className={`${
            mobileTableMode === "matrix" ? "block" : "hidden lg:block"
          } bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/[0.04] overflow-hidden`}
        >
          {/* Swipe hint on mobile when in matrix mode */}
          <div className="lg:hidden px-4 py-2.5 bg-brand-50 border-b border-brand-100 flex items-center justify-between text-xs text-brand-800">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <MoveHorizontal className="w-4 h-4 text-brand-600 shrink-0" />
              Swipe horizontally to compare all columns
            </span>
            <button
              onClick={() => setMobileTableMode("tabs")}
              className="font-bold text-brand-700 underline shrink-0 ml-2"
            >
              Tab view
            </button>
          </div>

          <div className="overflow-x-auto table-scroll">
            <table className="w-full min-w-[860px] lg:min-w-[940px] text-left border-collapse">
              <thead>
                <tr className="bg-brand-900 text-white">
                  <th className="sticky left-0 z-20 bg-brand-900 px-4 sm:px-5 py-4 sm:py-5 text-xs sm:text-sm font-semibold w-[160px] min-w-[150px] sm:w-[22%] shadow-[2px_0_8px_rgba(0,0,0,0.2)] lg:shadow-none">
                    Feature &amp; Service
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.id} className={`px-4 sm:px-5 py-4 sm:py-5 w-[19%] ${p.popular ? "bg-brand-600" : ""}`}>
                      <div className="flex items-center gap-2">
                        <p.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                        <span className="font-display font-bold text-sm sm:text-[15px]">{p.name}</span>
                        {p.popular && (
                          <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-normal text-slate-300 mt-1">
                        {p.rangeLabel} · {money(priceFor(p))} /mo
                      </p>
                      <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                        {p.merchants} Merchant · {p.staff} Staff
                      </p>
                    </th>
                  ))}
                  {/* 4th Column: Custom requirements for bigger merchants */}
                  <th className="px-4 sm:px-5 py-4 sm:py-5 w-[21%] bg-gradient-to-b from-brand-900 to-slate-900 border-l border-brand-700/50">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 shrink-0" />
                      <span className="font-display font-bold text-sm sm:text-[15px] text-white">Custom / Enterprise</span>
                    </div>
                    <span className="inline-block text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wide mt-1">
                      For Bigger Merchants
                    </span>
                    <p className="text-xs font-normal text-brand-200 mt-1">10,000+ parcels · Custom SLA</p>
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {comparisonRows.map((row, rIdx) => {
                  const rowBg = row.highlight ? "bg-slate-50" : rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60";
                  return (
                    <tr
                      key={row.label}
                      className={`border-t border-slate-100 transition hover:bg-brand-50/40 ${rowBg}`}
                    >
                      <td
                        className={`sticky left-0 z-10 ${rowBg} px-4 sm:px-5 py-3.5 sm:py-4 align-middle shadow-[2px_0_6px_rgba(15,23,42,0.05)] lg:shadow-none`}
                      >
                        <p className={`text-slate-800 ${row.highlight ? "font-semibold" : "font-medium"}`}>{row.label}</p>
                        {row.note && <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">{row.note}</p>}
                      </td>

                      {/* Standard 3 plans */}
                      {row.values.map((v, i) => (
                        <td key={i} className={`px-4 sm:px-5 py-3.5 sm:py-4 align-middle ${i === 1 ? "bg-brand-50/70" : ""}`}>
                          {v === true ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" strokeWidth={3} />
                              </span>
                              <span>Included</span>
                            </span>
                          ) : v === false ? (
                            <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs">
                              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <X className="w-3 h-3 text-slate-400" strokeWidth={2.5} />
                              </span>
                              <span>Not included</span>
                            </span>
                          ) : row.highlight && row.was ? (
                            <div>
                              <span className="font-semibold text-slate-900">{v}</span>
                              {billing === "yearly" && (
                                <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                                  <s>{row.was[i]}</s> · save {money(PLANS[i].price - priceFor(PLANS[i]))}/mo
                                </span>
                              )}
                            </div>
                          ) : row.highlight ? (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">{v}</span>
                          ) : (
                            <span className="text-slate-600">{v}</span>
                          )}
                        </td>
                      ))}

                      {/* Custom 4th column */}
                      <td className="px-4 sm:px-5 py-3.5 sm:py-4 align-middle bg-brand-50/40 border-l border-brand-100/80 font-medium text-slate-900">
                        {row.custom === true ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </span>
                            <span>Full Custom Suite</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-brand-900 font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                            <span>{row.custom}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td className="sticky left-0 z-10 bg-slate-50 px-4 sm:px-5 py-4 sm:py-5 text-xs sm:text-sm font-semibold text-slate-700 shadow-[2px_0_6px_rgba(15,23,42,0.05)] lg:shadow-none">
                    Choose plan
                  </td>
                  {PLANS.map((p) => (
                    <td key={p.id} className={`px-4 sm:px-5 py-4 sm:py-5 ${p.popular ? "bg-brand-50/70" : ""}`}>
                      <button
                        onClick={() => setSelectedPlan(p)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                          p.popular
                            ? "bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/20"
                            : "bg-white border border-slate-300 text-slate-800 hover:border-slate-950 hover:bg-brand-900 hover:text-white"
                        }`}
                      >
                        Choose {p.short}
                      </button>
                    </td>
                  ))}
                  <td className="px-4 sm:px-5 py-4 sm:py-5 bg-brand-50/70 border-l border-brand-100">
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>WhatsApp Talk</span>
                    </a>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{billing === "yearly" ? "20% yearly discount applied" : "Switch to yearly and save 20%"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-brand-600 shrink-0" /> No hidden fees
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-slate-600 shrink-0" /> 1 Merchant on all standard packages
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-600">Enterprise support:</span>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED CUSTOM ENTERPRISE SECTION */}
      <section id="custom-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 scroll-mt-20">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 relative overflow-hidden shadow-2xl border border-brand-900/30">
          <div className="absolute inset-0 bg-grid-dark opacity-40 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-500/20 text-brand-300 border border-brand-400/30 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 shrink-0" /> High-Volume &amp; Custom
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight mt-4 leading-tight">
                Tailored for merchants with 10,000+ parcels
              </h2>
              <p className="text-slate-300 mt-3.5 sm:mt-4 leading-relaxed text-sm sm:text-base">
                Running high daily volume, multiple dispatch hubs, or need specialized courier integrations?
                Our engineering team configures custom database limits, role permissions, and direct warehouse integrations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
                {[
                  "Unlimited or 10k+ parcel scaling",
                  "Multiple merchants & store views",
                  "Custom staff & attendance roles",
                  "Danger zone AI fraud thresholds",
                  "Dedicated courier API bridges",
                  "Priority WhatsApp hotline",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/25 text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  onClick={() => setCustomContactModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-5 py-3.5 rounded-xl transition text-sm"
                >
                  Request Custom Quote
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
              <h3 className="font-display font-bold text-base sm:text-lg text-white mb-3 sm:mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Direct Merchant Assistance</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect directly with our solutions specialist. We will review your current order flow, courier partner list,
                and staff structure to build a package that fits your exact volume.
              </p>

              <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 bg-black/30 rounded-xl p-3.5 sm:p-4 text-xs font-mono text-slate-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 border-b border-white/10 pb-2.5">
                  <span className="text-slate-400">WhatsApp Line:</span>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline sm:text-right inline-flex items-center gap-1 sm:justify-end"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" /> Chat now
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 border-b border-white/10 pb-2.5">
                  <span className="text-slate-400">Response time:</span>
                  <span className="text-white sm:text-right">&lt; 15 minutes</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 border-b border-white/10 pb-2.5">
                  <span className="text-slate-400 shrink-0">Courier support:</span>
                  <span className="text-white sm:text-right">Steadfast, RedX, Pathao, Paperfly &amp; Custom</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                  <span className="text-slate-400">Onboarding:</span>
                  <span className="text-emerald-300 font-semibold sm:text-right">1-on-1 Dedicated Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 scroll-mt-20">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
            FAQ
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight mt-4">
            Frequently asked questions
          </h2>
          <p className="text-slate-500 mt-2.5 sm:mt-3 text-sm sm:text-base">
            Everything you need to know about SellerBuz CRM Monthly Recurring Plans.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {FAQS.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div
                key={i}
                className={`bg-white border rounded-2xl overflow-hidden transition ${
                  open ? "border-brand-200 shadow-lg shadow-brand-600/[0.05]" : "border-slate-200"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left"
                >
                  <span className="font-semibold text-sm sm:text-base leading-snug">{faq.q}</span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${
                      open ? "bg-brand-600 text-white rotate-180" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-[15px] text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Callout */}
        <div className="mt-6 sm:mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <MessageCircle className="w-5 h-5 fill-white" />
            </span>
            <div>
              <p className="font-semibold text-sm text-slate-900">
                Have a specific question about your courier or store?
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Chat with our support engineers on WhatsApp anytime.
              </p>
            </div>
          </div>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 sm:py-2.5 rounded-xl transition shrink-0"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12 sm:pb-16">
        <div className="relative bg-brand-900 rounded-3xl sm:rounded-[32px] overflow-hidden px-5 py-10 sm:px-12 sm:py-16 text-center text-white">
          <div className="absolute inset-0 bg-grid-dark opacity-60 pointer-events-none" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] h-[240px] sm:h-[300px] bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" /> Start today — free for 7 days
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-5xl tracking-tight mt-5 sm:mt-6 leading-tight">
              Ready to manage your parcels smarter?
            </h2>
            <p className="text-slate-400 mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed">
              Join 2,400+ merchants using SellerBuz. Pick your plan, start your free trial, and cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-7 sm:mt-8">
              <button
                onClick={() => setSelectedPlan(recommended)}
                className="w-full sm:w-auto bg-white text-slate-950 font-semibold px-5 sm:px-8 py-3.5 rounded-full hover:bg-brand-50 transition inline-flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>Start Free Trial — {recommended.short} Plan</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 sm:px-6 py-3.5 rounded-full transition inline-flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-5 leading-relaxed">
              No credit card required · Regular updates included · Cancel anytime · Save 20% on yearly
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <BrandWordmark showTagline />
            <p className="text-xs text-slate-400">CRM Monthly Recurring Plans</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span>Official WhatsApp Support:</span>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Chat with us
            </a>
          </div>

          <p className="text-xs text-slate-400 max-w-md md:max-w-none leading-relaxed">
            © {new Date().getFullYear()} SellerBuz. All plans include regular updates, 7 days free trial, Merchant &amp; Staff accounts.
          </p>
        </div>
      </footer>

      {/* PLAN TRIAL MODAL (FormSubmit.co → bellal24hr@gmail.com) */}
      {selectedPlan && (
        <TrialModal
          plan={selectedPlan}
          billing={billing}
          currency={currency}
          parcels={parcels}
          price={priceFor(selectedPlan)}
          priceLabel={money(priceFor(selectedPlan))}
          onClose={() => setSelectedPlan(null)}
        />
      )}

      {/* CUSTOM ENTERPRISE MODAL */}
      {customContactModal && <CustomContactModal onClose={() => setCustomContactModal(false)} />}
    </div>
  );
}

/* ---------------------------------- MODALS ---------------------------------- */

function TrialModal({
  plan,
  billing,
  currency,
  parcels,
  priceLabel,
  price,
  onClose,
}: {
  plan: Plan;
  billing: "monthly" | "yearly";
  currency: Currency;
  parcels: number;
  priceLabel: string;
  price: number;
  onClose: () => void;
}) {
  const international =
    currency === "BDT" ? `≈ $${fmt(Math.round(price / 100))} USD` : `≈ ৳${fmt(price)} BDT`;
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!isEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isPhone(form.phone)) {
      setError("Please enter a valid phone number (8–15 digits) so we can activate your trial.");
      return;
    }
    setError("");
    setSending(true);
    const ok = await submitToFormSubmit({
      _subject: `SellerBuz Trial Request — ${plan.name}`,
      _replyto: form.email,
      name: form.name,
      email: form.email,
      phone: form.phone,
      plan: plan.name,
      billing,
      currency,
      price: priceLabel,
      parcel_volume: `${fmt(parcels)} parcels / month`,
      team_seats: `${plan.merchants} Merchant · ${plan.staff} Staff`,
      message: `Trial request for ${plan.name} (${plan.rangeLabel}) at ${priceLabel}/month with ${billing} billing.`,
    });
    setSending(false);
    if (ok) {
      setSubmitted(true);
    } else {
      setError("We couldn't submit just now. Please try again, or chat with us on WhatsApp for instant activation.");
    }
  };

  const Icon = plan.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-[28px] shadow-2xl overflow-hidden animate-popIn max-h-[92dvh] overflow-y-auto overscroll-contain">
        {!submitted ? (
          <>
            <div className="bg-brand-900 text-white px-5 sm:px-7 py-5 sm:py-6 pr-14 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-dark opacity-50 pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition z-10"
              >
                <X className="w-4.5 h-4.5" />
              </button>
              <div className="relative flex items-start sm:items-center gap-3.5 sm:gap-4">
                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-brand-300">
                    SellerBuz · Start free trial
                  </p>
                  <h3 className="font-display font-bold text-lg sm:text-xl mt-0.5">{plan.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {plan.rangeLabel} · {plan.merchants} Merchant · {plan.staff} Staff
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {priceLabel} / month {billing === "yearly" ? "(20% yearly rate)" : ""} · {currency}
                  </p>
                  <p className="text-[11px] font-semibold text-accent-300 mt-0.5">
                    {international} for international clients
                  </p>
                </div>
              </div>
              <div className="relative flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
                {["7 days free", "Regular update", "Cancel anytime"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium bg-white/10 border border-white/10 px-2.5 py-1 rounded-full"
                  >
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300 shrink-0" /> {t}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-5 sm:px-7 py-5 sm:py-6 pb-safe space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1.5">
                  Full name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ahmed Khan"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-base sm:text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">
                  Email address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-base sm:text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">
                  Phone number / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+880 18XX-XXXXXX"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-base sm:text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="text-slate-500">Monthly parcel volume</span>
                <span className="font-bold">{fmt(parcels)} parcels</span>
              </div>

              {error && (
                <p className="text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-brand-900 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-sm"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Sending…
                  </>
                ) : (
                  <>
                    <span>Activate 7-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>No credit card required · Cancel anytime · {priceLabel} after trial</span>
              </p>
              <p className="text-center text-[11px] text-slate-400">
                Your request is emailed to our team. A valid phone number is required so we can set up your Merchant account.
              </p>
            </form>
          </>
        ) : (
          <div className="px-5 sm:px-7 py-10 sm:py-12 pb-safe text-center">
            <span className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center animate-floatY">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl mt-5 sm:mt-6">Trial activated!</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed break-words">
              Welcome aboard, <strong className="text-slate-900">{form.name.split(" ")[0]}</strong>. Your{" "}
              <strong className="text-slate-900">{plan.name}</strong> free trial on SellerBuz is ready. We have sent the login details to{" "}
              <strong className="text-slate-900">{form.email}</strong>.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mt-5 sm:mt-6 text-left space-y-2.5 text-xs sm:text-sm">
              <p className="flex justify-between gap-2">
                <span className="text-slate-500">Plan</span>
                <strong className="text-right">{plan.name}</strong>
              </p>
              <p className="flex justify-between gap-2">
                <span className="text-slate-500">Price after trial</span>
                <strong className="text-right">{priceLabel} / month</strong>
              </p>
              <p className="flex justify-between gap-2">
                <span className="text-slate-500">Billing</span>
                <strong className="text-right">{billing === "yearly" ? "Yearly · 20% off" : "Monthly"}</strong>
              </p>
              <p className="flex justify-between gap-2">
                <span className="text-slate-500">Currency</span>
                <strong className="text-right">
                  {currency} <span className="font-normal text-slate-400">({international})</span>
                </strong>
              </p>
              <p className="flex justify-between gap-2">
                <span className="text-slate-500">Parcel limit</span>
                <strong className="text-right">{plan.rangeLabel}</strong>
              </p>
              <p className="flex justify-between gap-2">
                <span className="text-slate-500">Team seats</span>
                <strong className="text-right">
                  {plan.merchants} Merchant · {plan.staff} Staff
                </strong>
              </p>
              <p className="flex justify-between gap-2">
                <span className="text-slate-500">Free trial</span>
                <strong className="text-emerald-700 text-right">7 days</strong>
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4 shrink-0" /> Message Support on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="w-full bg-brand-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-brand-800 transition text-sm"
              >
                Done — Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", store: "", email: "", parcels: "15,000", phone: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submitCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isPhone(form.phone)) {
      setError("Please enter a valid phone number (8–15 digits).");
      return;
    }
    setError("");
    setSending(true);
    const ok = await submitToFormSubmit({
      _subject: "SellerBuz — Custom Enterprise Quote Request",
      _replyto: form.email,
      name: form.name,
      store: form.store,
      email: form.email,
      phone: form.phone,
      estimated_monthly_parcels: form.parcels,
      message: `Custom enterprise quote request for ${form.store || "merchant"} shipping approx ${form.parcels} parcels/month.`,
    });
    setSending(false);
    if (ok) {
      setSent(true);
    } else {
      setError("We couldn't submit just now. Please try again, or chat with us on WhatsApp.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-[28px] shadow-2xl overflow-hidden animate-popIn max-h-[92dvh] overflow-y-auto overscroll-contain">
        <div className="bg-brand-900 text-white px-5 sm:px-7 py-5 sm:py-6 pr-14 relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4.5 h-4.5" />
          </button>
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 shrink-0" /> High-Volume Custom Quote
          </span>
          <h3 className="font-display font-bold text-lg sm:text-xl mt-1">SellerBuz Custom Requirements</h3>
          <p className="text-xs text-slate-400 mt-1">Tailored for 10,000+ parcels, custom roles &amp; API integrations.</p>
        </div>

        {!sent ? (
          <form onSubmit={submitCustom} className="p-5 sm:p-7 pb-safe space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tariq Mehmood"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-base sm:text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Brand or Store Name</label>
              <input
                value={form.store}
                onChange={(e) => setForm({ ...form, store: e.target.value })}
                placeholder="e.g. TrendyAttire Express"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-base sm:text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">
                Email address <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-base sm:text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Estimated Monthly Parcels</label>
              <input
                value={form.parcels}
                onChange={(e) => setForm({ ...form, parcels: e.target.value })}
                placeholder="e.g. 15,000 or 50,000"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-base sm:text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">
                Phone number / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+880 18XX-XXXXXX"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-base sm:text-sm outline-none focus:border-brand-500"
              />
            </div>

            {error && <p className="text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">{error}</p>}

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-brand-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Sending…
                  </>
                ) : (
                  "Submit Custom Plan Request"
                )}
              </button>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Or Chat Instantly on WhatsApp</span>
              </a>
            </div>
            <p className="text-center text-[11px] text-slate-400">
              Email + valid phone number are required so our enterprise team can reach you.
            </p>
          </form>
        ) : (
          <div className="p-6 sm:p-8 pb-safe text-center">
            <span className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </span>
            <h4 className="font-display font-bold text-xl">Request Received!</h4>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Thanks {form.name}. Our enterprise onboarding manager will reach out to you within 30 minutes. You can also ping us directly anytime via the WhatsApp button on this page.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-brand-900 text-white font-semibold py-3 rounded-xl hover:bg-brand-800 transition text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
