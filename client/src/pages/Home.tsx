import { FormEvent, useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  FileCheck2,
  FlaskConical,
  Globe2,
  Handshake,
  Leaf,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Phone,
  Plane,
  ShieldCheck,
  Sparkles,
  Sprout,
  Truck,
  UsersRound,
  Wheat,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const navItems = [
  ["About", "#about"],
  ["Products", "#products"],
  ["Export Markets", "#markets"],
  ["Quality Assurance", "#quality"],
  ["Contact", "#contact"],
] as const;

const products = [
  {
    name: "Turmeric",
    latin: "Curcuma longa",
    description: "High-curcumin turmeric with vivid color and a clean, earthy finish.",
    image: "/assets/product-turmeric.webp",
    tone: "from-[#b96e09]/85",
  },
  {
    name: "Red Chilli",
    latin: "Capsicum annuum",
    description: "Rich aroma, excellent color value, and heat levels tailored to your brief.",
    image: "/assets/product-red-chilli.webp",
    tone: "from-[#a6371b]/90",
  },
  {
    name: "Cumin Seeds",
    latin: "Cuminum cyminum",
    description: "Uniform seeds selected for bold fragrance and dependable flavor release.",
    image: "/assets/product-cumin.webp",
    tone: "from-[#76512a]/90",
  },
  {
    name: "Coriander Seeds",
    latin: "Coriandrum sativum",
    description: "Naturally aromatic, clean, and export-grade for blending and milling.",
    image: "/assets/product-coriander.webp",
    tone: "from-[#5d6b3f]/90",
  },
  {
    name: "Black Pepper",
    latin: "Piper nigrum",
    description: "Bold, warm peppercorns with a consistent premium processing standard.",
    image: "/assets/product-black-pepper.webp",
    tone: "from-[#26352b]/95",
  },
  {
    name: "Green Cardamom",
    latin: "Elettaria cardamomum",
    description: "Handpicked pods chosen for freshness, aroma, and visual consistency.",
    image: "/assets/product-cardamom.webp",
    tone: "from-[#486948]/90",
  },
  {
    name: "Clove",
    latin: "Syzygium aromaticum",
    description: "Aromatic whole cloves with deep colour, warm flavour, and export-ready cleanliness.",
    image: "/assets/product-clove.webp",
    tone: "from-[#38251f]/95",
  },
  {
    name: "Cinnamon",
    latin: "Cinnamomum verum",
    description: "Fragrant cinnamon quills selected for natural sweetness, clean aroma, and consistency.",
    image: "/assets/product-cinnamon.webp",
    tone: "from-[#7a3f23]/90",
  },
  {
    name: "Nutmeg",
    latin: "Myristica fragrans",
    description: "Whole nutmeg with a rich warm profile for bakery, beverage, and savoury applications.",
    image: "/assets/product-nutmeg.webp",
    tone: "from-[#6d4d32]/90",
  },
  {
    name: "Saffron",
    latin: "Crocus sativus",
    description: "Carefully selected crimson threads with distinctive colour, aroma, and delicate flavour.",
    image: "/assets/product-saffron.webp",
    tone: "from-[#9a351f]/90",
  },
  {
    name: "Mace (Javitri)",
    latin: "Myristica fragrans aril",
    description: "Bright lace-like mace blades with an elegant aroma for premium culinary formulations.",
    image: "/assets/product-mace.webp",
    tone: "from-[#a53b20]/90",
  },
  {
    name: "Fox Nut (Makhana)",
    latin: "Euryale ferox",
    description: "Light, clean, and carefully graded lotus seeds for snack, wellness, and food applications.",
    image: "/assets/product-fox-nut.webp",
    tone: "from-[#8d806a]/70",
  },
  {
    name: "Flattened Rice (Poha)",
    latin: "Oryza sativa",
    description: "Clean, even rice flakes prepared for dependable texture across everyday food applications.",
    image: "/assets/product-poha.webp",
    tone: "from-[#9a885e]/65",
  },
  {
    name: "Star Anise",
    latin: "Illicium verum",
    description: "Distinctive star-shaped pods with a naturally sweet aroma and bold visual character.",
    image: "/assets/product-star-anise.webp",
    tone: "from-[#3d3525]/95",
  },
];

const features = [
  [Sprout, "Direct Farm Sourcing", "Reducing intermediaries while protecting freshness, origin, and value."],
  [ShieldCheck, "Stringent Quality Control", "Multiple checkpoints from incoming lots to export-ready cartons."],
  [Truck, "Global Logistics Support", "Clear coordination for dependable delivery across international markets."],
  [PackageCheck, "Flexible Packaging", "Bulk, retail-ready, and private-label formats built around your need."],
  [Handshake, "Transparent Business Practices", "Clear communication, practical documentation, dependable commitments."],
  [Globe2, "Long-Term Partnerships", "A sourcing relationship designed for repeat orders and shared growth."],
] as const;

const markets = [
  { name: "UAE", x: 57, y: 45, note: "Fast-moving Gulf hub" },
  { name: "Saudi Arabia", x: 54, y: 42, note: "Foodservice & wholesale" },
  { name: "Oman", x: 59, y: 49, note: "Regional distribution" },
  { name: "Europe", x: 47, y: 27, note: "Retail & ingredient supply" },
  { name: "USA", x: 19, y: 35, note: "Specialty & manufacturing" },
  { name: "Canada", x: 20, y: 23, note: "Import partners" },
  { name: "Africa", x: 46, y: 59, note: "Growing trade lanes" },
  { name: "Southeast Asia", x: 74, y: 56, note: "Blending & foodservice" },
];

function SectionEyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`eyebrow ${light ? "text-[#ddbd7a]" : "text-[#a86d27]"}`}>
      <span className="eyebrow-line" />
      {children}
    </div>
  );
}

function PrimaryButton({ children, href = "#quote", onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick} className="group inline-flex items-center gap-3 rounded-full bg-[#d5a049] px-6 py-3.5 text-[0.76rem] font-bold uppercase tracking-[0.13em] text-[#1c2e24] shadow-[0_10px_35px_rgba(213,160,73,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e5b965] active:scale-[0.97]">
      {children}
      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function AppLogo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className="group inline-flex items-center gap-3" aria-label="DivineGrow LLP home">
      <span className={`relative grid size-10 place-items-center overflow-hidden rounded-full border ${dark ? "border-white/20 bg-white/10" : "border-[#d8bd88] bg-[#f9f4e8]"}`}>
        <span className={`absolute -bottom-3 size-9 rounded-[44%] rotate-45 ${dark ? "bg-[#d6a44b]" : "bg-[#bc7828]"}`} />
        <Leaf className={`relative z-10 size-5 rotate-[-20deg] ${dark ? "text-[#183326]" : "text-[#fff8e7]"}`} />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[1.12rem] tracking-[-0.03em] ${dark ? "text-white" : "text-[#1c2e24]"}`}>DivineGrow</span>
        <span className={`mt-1 block text-[0.55rem] font-bold uppercase tracking-[0.24em] ${dark ? "text-white/55" : "text-[#8e7a5a]"}`}>LLP · Indian Spices</span>
      </span>
    </a>
  );
}

async function saveInquiry(values: Record<string, FormDataEntryValue>, inquiryType: "contact" | "quote") {
  if (!supabase) return null;
  const { error } = await supabase.from("inquiries").insert({
    inquiry_type: inquiryType,
    name: String(values.name ?? ""),
    company: values.company ? String(values.company) : null,
    country: values.country ? String(values.country) : null,
    business_type: values.businessType ? String(values.businessType) : null,
    email: String(values.email ?? ""),
    phone: values.phone ? String(values.phone) : null,
    product: values.product ? String(values.product) : null,
    quantity: values.quantity ? String(values.quantity) : null,
    message: values.message ? String(values.message) : null,
    consented_at: new Date().toISOString(),
  });
  return error;
}

function SuccessMessage({ quote = false, onReset }: { quote?: boolean; onReset: () => void }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.5rem] border border-[#d7c49d] bg-[#fffaf0] p-8 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-[#dfead4] text-[#2e613c]"><CheckCircle2 className="size-8" /></span>
      <p className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#8f6b35]">Confirmation saved</p>
      <p className="mt-2 font-display text-3xl text-[#1d3327]">{quote ? "Quote request received." : "Message received."}</p>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[#6e6a5e]">{quote ? "Our trade desk will review your requirements and reply with availability, pricing, and shipping options." : "Thank you for reaching out. A member of our team will respond within one business day."}</p>
      <button onClick={onReset} className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-[#9f6925] underline underline-offset-4">Send another message</button>
    </div>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const error = await saveInquiry(Object.fromEntries(new FormData(event.currentTarget).entries()), "contact");
    setSubmitting(false);
    if (error) {
      toast.error("We could not send your message.", { description: "Please try again or contact us directly." });
      return;
    }
    setSubmitted(true);
    toast.success("Your message has been sent.", { description: "We will respond within one business day." });
  }

  if (submitted) return <SuccessMessage onReset={() => setSubmitted(false)} />;

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white/15 bg-white p-5 text-[#1d3327] shadow-[0_24px_70px_rgba(9,23,17,0.14)] sm:p-7 lg:p-8">
      <div className="mb-6"><p className="font-display text-2xl">Send us a message</p><p className="mt-1 text-xs leading-5 text-[#7e7869]">A simple way to reach our team directly.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">Name*<input required name="name" type="text" placeholder="Your name" /></label>
        <label className="field-label">Mobile number*<input required name="phone" type="tel" placeholder="+ country code" /></label>
        <label className="field-label sm:col-span-2">Email address*<input required name="email" type="email" placeholder="you@company.com" /></label>
      </div>
      <label className="field-label mt-4">Message*<textarea required name="message" rows={5} placeholder="How can we help?" /></label>
      <button type="submit" disabled={submitting} aria-busy={submitting} className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#1e3b2a] px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:bg-[#2a5139] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70">{submitting ? <><Loader2 className="size-4 animate-spin text-[#d9ac5d]" aria-hidden="true" /><span>Sending message…</span></> : <><span>Send message</span><ArrowUpRight className="size-4 text-[#d9ac5d]" /></>}</button>
      {submitting && <p role="status" aria-live="polite" className="mt-3 text-center text-[0.68rem] font-semibold text-[#7e7869]">Sending your message securely…</p>}
    </form>
  );
}

function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    setSubmitting(true);
    const error = await saveInquiry(values, "quote");
    setSubmitting(false);
    if (error) {
      toast.error("We could not send your quote request.", { description: "Please try again or contact us directly by WhatsApp or email." });
      return;
    }

    setSubmitted(true);
    toast.success("Thank you — your enquiry is ready for our trade desk.", {
      description: "We will respond within one business day.",
    });
  }

  if (submitted) {
    return (
      <SuccessMessage quote onReset={() => setSubmitted(false)} />
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-[1.5rem] border border-[#d7c49d] bg-[#fffaf0] p-5 shadow-[0_24px_70px_rgba(49,42,25,0.08)] sm:p-7 ${compact ? "" : "lg:p-8"}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-[#1d3327]">Request a quote</p>
          <p className="mt-1 text-xs leading-5 text-[#7e7869]">Tell us what you are looking to source.</p>
        </div>
        <span className="rounded-full bg-[#e5efde] px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#2c6041]">24h response</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">Full name*<input required name="name" type="text" placeholder="Your name" /></label>
        <label className="field-label">Company name*<input required name="company" type="text" placeholder="Company / organization" /></label>
        <label className="field-label">Country*<input required name="country" type="text" placeholder="Where are you based?" /></label>
        <label className="field-label">Business type<select name="businessType" defaultValue=""><option value="" disabled>Select one</option><option>Importer</option><option>Distributor</option><option>Food manufacturer</option><option>Retailer</option><option>Wholesaler</option></select></label>
        <label className="field-label">Email address*<input required name="email" type="email" placeholder="you@company.com" /></label>
        <label className="field-label">Phone number<input name="phone" type="tel" placeholder="+ country code" /></label>
        <label className="field-label">Product interested in<select name="product" defaultValue=""><option value="" disabled>Choose a product</option>{products.map((product) => <option key={product.name}>{product.name}</option>)}<option>Multiple products</option></select></label>
        <label className="field-label">Estimated quantity<input name="quantity" type="text" placeholder="e.g. 5 MT / month" /></label>
      </div>
      <label className="field-label mt-4">Message<textarea name="message" rows={compact ? 3 : 4} placeholder="Tell us about grade, packaging, destination, or timing." /></label>
      <button type="submit" disabled={submitting} aria-busy={submitting} className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#1e3b2a] px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a5139] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70">
        {submitting ? <><Loader2 className="size-4 animate-spin text-[#d9ac5d]" aria-hidden="true" /><span>Sending enquiry…</span></> : <><span>Get a free quote</span><ArrowUpRight className="size-4 text-[#d9ac5d]" /></>}
      </button>
      {submitting && <p role="status" aria-live="polite" className="mt-3 text-center text-[0.68rem] font-semibold text-[#7e7869]">Sending your quote request securely…</p>}
      <p className="mt-3 text-center text-[0.65rem] leading-5 text-[#928a78]">By submitting, you agree to be contacted about your sourcing enquiry.</p>
    </form>
  );
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMarket, setActiveMarket] = useState("UAE");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeMarketData = markets.find((market) => market.name === activeMarket) ?? markets[0];

  return (
    <div id="top" className="min-h-screen overflow-hidden bg-[#f8f4e9] text-[#1c2e24]">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-[#dfd5be]/80 bg-[#fbf8f0]/95 text-[#1c2e24] shadow-[0_8px_30px_rgba(33,49,38,0.05)] backdrop-blur-xl" : "bg-transparent text-white"}`}>
        <div className="container flex h-[78px] items-center justify-between gap-5">
          <AppLogo dark={!scrolled} />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {navItems.map(([label, href]) => <a key={label} href={href} className={`nav-link ${scrolled ? "nav-link-dark" : "nav-link-light"}`}>{label}</a>)}
          </nav>
          <div className="hidden items-center gap-4 sm:flex">
            <a href="tel:+919810610262" className={`hidden items-center gap-2 text-xs font-bold tracking-wide xl:flex ${scrolled ? "text-[#617064]" : "text-white/75"}`}><Phone className="size-3.5" /> +91 98106 10262</a>
            <PrimaryButton href="#quote">Request a quote</PrimaryButton>
          </div>
          <button onClick={() => setNavOpen((open) => !open)} className={`grid size-10 place-items-center rounded-full border lg:hidden ${scrolled ? "border-[#d7cbb0] text-[#1c2e24]" : "border-white/25 text-white"}`} aria-label="Toggle navigation" aria-expanded={navOpen}>
            {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {navOpen && <div className="border-t border-[#e0d7c4] bg-[#fbf8f0] px-5 py-5 text-[#1c2e24] shadow-xl lg:hidden"><div className="flex flex-col gap-4">{navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setNavOpen(false)} className="text-sm font-semibold">{label}</a>)}<a href="#quote" onClick={() => setNavOpen(false)} className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#1e3b2a] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white">Request a quote</a></div></div>}
      </header>

      <main>
        <section className="hero-section relative min-h-[740px] overflow-hidden bg-[#173022]" aria-labelledby="hero-title">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/divinegrow-hero.webp')" }} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,34,25,0.9)_0%,rgba(15,34,25,0.67)_39%,rgba(15,34,25,0.18)_75%,rgba(15,34,25,0.38)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(9,23,17,0.68)_0%,transparent_32%)]" />
          <div className="container relative z-10 flex min-h-[740px] items-end pb-16 pt-32 sm:pb-20 lg:pb-24">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#e7c780] backdrop-blur-md"><Sparkles className="size-3.5" /> Trusted global supplier</div>
              <h1 id="hero-title" className="max-w-4xl font-display text-[3.7rem] leading-[0.96] tracking-[-0.055em] text-white sm:text-[5rem] lg:text-[6.35rem]">Bringing India&apos;s finest <em className="font-display font-normal text-[#d5a049]">spices</em> to global markets.</h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/72 sm:text-lg">Export-grade Indian spices sourced from trusted farms, refined with care, and prepared for importers, manufacturers, and distributors worldwide.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton href="#quote">Get wholesale pricing</PrimaryButton>
                <a href="#products" className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/8 px-6 py-3.5 text-[0.76rem] font-bold uppercase tracking-[0.13em] text-white backdrop-blur-sm transition-all duration-200 hover:border-white/60 hover:bg-white/15 active:scale-[0.97]">Explore our products <ArrowDownRight className="size-4 transition-transform group-hover:translate-y-0.5" /></a>
              </div>
              <div className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/18 pt-5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/65 sm:gap-x-8">
                <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-[#d5a049]" /> Export ready</span>
                <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-[#d5a049]" /> Farm-to-market</span>
                <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-[#d5a049]" /> Quality assured</span>
                <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-[#d5a049]" /> Global supply</span>
              </div>
            </div>
            <div className="absolute bottom-16 right-8 hidden max-w-[210px] border-l border-[#d5a049]/70 pl-5 text-xs leading-5 text-white/65 xl:block"><span className="mb-2 block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#d5a049]">From India, with intent</span>Every shipment is shaped around consistency, clarity, and the confidence to reorder.</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-[#f8f4e9] to-transparent" />
        </section>

        <section className="relative z-20 -mt-3 pb-20 pt-8 sm:pt-0">
          <div className="container">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[[BadgeCheck, "Quality assured", "Batch-by-batch confidence"], [Truck, "Reliable supply", "Sourcing you can plan around"], [BarChart3, "Competitive pricing", "Direct procurement advantage"], [UsersRound, "Dedicated service", "From enquiry to shipment"]].map(([Icon, title, desc]) => <div key={title as string} className="trust-card"><Icon className="size-5 text-[#b47b2f]" /><div><p className="mt-3 text-sm font-bold text-[#25392b]">{title as string}</p><p className="mt-1 text-xs leading-5 text-[#777366]">{desc as string}</p></div></div>)}
            </div>
          </div>
        </section>

        <section id="about" className="section-pad bg-[#f8f4e9]">
          <div className="container">
            <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-24">
              <div className="relative mx-auto w-full max-w-[510px] lg:mx-0">
                <div className="absolute -left-5 -top-5 hidden size-24 rounded-full border border-[#d8bb7b] sm:block" />
                <div className="relative overflow-hidden rounded-[1.5rem] bg-[#324c38] shadow-[0_25px_65px_rgba(39,53,37,0.14)]">
                  <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85" alt="Aromatic spice ingredients arranged for careful preparation" className="aspect-[0.9] w-full object-cover object-center opacity-90 mix-blend-luminosity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c3326]/75 via-transparent to-[#1c3326]/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"><p className="max-w-[230px] font-display text-2xl leading-tight text-white">Origin matters. So does what happens next.</p><div className="mt-5 flex items-center gap-3 text-[0.63rem] font-bold uppercase tracking-[0.15em] text-[#dfc37d]"><span className="size-2 rounded-full bg-[#dfc37d]" /> New Delhi · India</div></div>
                </div>
                <div className="absolute -bottom-7 -right-4 rounded-2xl border border-[#d8c6a3] bg-[#fffaf0] px-5 py-4 shadow-[0_16px_35px_rgba(54,45,27,0.1)] sm:-right-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#e4eedb] text-[#39704a]"><Wheat className="size-5" /></span><div><p className="font-display text-xl text-[#1e3b2a]">20+</p><p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[#8b806e]">Markets served</p></div></div></div>
              </div>
              <div>
                <SectionEyebrow>About DivineGrow LLP</SectionEyebrow>
                <h2 className="section-title mt-5 max-w-xl">A reliable partner in <em>Indian spice trading.</em></h2>
                <p className="mt-6 max-w-xl text-[1.05rem] leading-8 text-[#666c61]">We source and supply premium-quality Indian spices for businesses that need authentic flavour, stable quality, and a partner who keeps communication clear. From first brief to final shipment, every detail is handled with intent.</p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#7b7b70]">Our relationships across origin markets help importers, wholesalers, food manufacturers, and distributors access the depth of Indian spice with confidence.</p>
                <div className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-7 border-t border-[#ded4bf] pt-7 sm:grid-cols-4">
                  {[['15+', 'Premium spices'], ['20+', 'Global markets'], ['100%', 'Quality focus'], ['24×7', 'Commitment']].map(([value, label]) => <div key={label}><p className="font-display text-3xl tracking-[-0.04em] text-[#1e3b2a]">{value}</p><p className="mt-1 text-[0.63rem] font-bold uppercase leading-4 tracking-[0.11em] text-[#8f826c]">{label}</p></div>)}
                </div>
                <a href="#contact" className="mt-9 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#9f6925] transition-colors hover:text-[#1e3b2a]">Meet your sourcing partner <ArrowUpRight className="size-4" /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="section-pad bg-[#eee8d9]">
          <div className="container">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div><SectionEyebrow>Our product portfolio</SectionEyebrow><h2 className="section-title mt-5 max-w-xl">The ingredients behind <em>better food.</em></h2></div>
              <p className="max-w-xs text-sm leading-6 text-[#777266] sm:text-right">Selected for colour, aroma, purity, and consistency across every application.</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => <a href="#quote" key={product.name} className="product-card group"><div className="relative aspect-[1.15] overflow-hidden"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className={`absolute inset-0 bg-gradient-to-t ${product.tone} via-transparent to-transparent opacity-80`} /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5"><div><p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-white/70">{String(index + 1).padStart(2, "0")} · {product.latin}</p><h3 className="mt-1 font-display text-2xl text-white">{product.name}</h3></div><span className="grid size-9 place-items-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition group-hover:bg-[#d5a049] group-hover:text-[#1d3327]"><ArrowUpRight className="size-4" /></span></div></div><div className="bg-[#fffaf0] px-5 py-4"><p className="text-sm leading-6 text-[#777266]">{product.description}</p></div></a>)}
            </div>
            <div className="mt-9 flex justify-center"><a href="#quote" className="inline-flex items-center gap-3 rounded-full border border-[#a99b80] px-6 py-3 text-xs font-bold uppercase tracking-[0.13em] text-[#344536] transition-colors hover:border-[#9f6925] hover:bg-[#fffaf0]">Explore complete product catalogue <ArrowUpRight className="size-4 text-[#9f6925]" /></a></div>
          </div>
        </section>

        <section id="why" className="section-pad relative overflow-hidden bg-[#1e3b2a] text-white">
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#e1c178 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="container relative">
            <div className="max-w-2xl"><SectionEyebrow light>Why DivineGrow</SectionEyebrow><h2 className="section-title mt-5 text-white">Value that travels <em className="text-[#d9b261]">beyond the box.</em></h2><p className="mt-6 max-w-xl text-base leading-7 text-white/60">A thoughtful supply partner does more than move product. We help you protect your own standard, your own promise, and your next order.</p></div>
            <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{features.map(([Icon, title, copy], index) => <div key={title} className="group border-t border-white/15 pt-5"><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-full border border-[#d1a554]/40 text-[#d9b261]"><Icon className="size-5" /></span><span className="text-[0.64rem] font-bold tracking-[0.14em] text-white/25">0{index + 1}</span></div><h3 className="mt-5 font-display text-xl text-white">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-white/55">{copy}</p></div>)}</div>
          </div>
        </section>

        <section id="markets" className="section-pad bg-[#f8f4e9]">
          <div className="container">
            <div className="grid gap-14 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
              <div><SectionEyebrow>Export markets</SectionEyebrow><h2 className="section-title mt-5">One origin. <em>Many destinations.</em></h2><p className="mt-6 max-w-md text-base leading-7 text-[#6f746a]">Our export-focused operations help international buyers source premium Indian spices with confidence through efficient logistics and quality-driven supply processes.</p><div className="mt-9 flex flex-wrap gap-2">{markets.map((market) => <button key={market.name} onClick={() => setActiveMarket(market.name)} className={`rounded-full border px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-all ${activeMarket === market.name ? "border-[#1e3b2a] bg-[#1e3b2a] text-white" : "border-[#d5cbb5] bg-transparent text-[#697064] hover:border-[#8e9a89]"}`}>{market.name}</button>)}</div><div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#ded4bf] bg-[#f3eee3] p-4"><CircleDot className="mt-0.5 size-4 shrink-0 text-[#b4782d]" /><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#405644]">{activeMarketData.name}</p><p className="mt-1 text-sm text-[#77766d]">{activeMarketData.note} · Ask us about your lane.</p></div></div></div>
              <div className="relative min-h-[370px] overflow-hidden rounded-[1.5rem] border border-[#d8cdb5] bg-[#eef0e7] p-4 sm:p-8"><div className="absolute right-7 top-6 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#8b957f]">Supply network · 2024—25</div><svg viewBox="0 0 800 410" className="relative z-10 mt-5 h-full w-full" role="img" aria-label="Stylized world map with highlighted export markets"><path d="M97 142c28-35 73-51 115-46l34 21 12 34-19 23-41-1-25 25-42-6-30-22zM272 185l46-12 47 28 8 33-22 28-43-9-24-31zM403 116l42-26 68 3 38 22-13 34-52 8-31 28-43-21zM490 198l42-16 45 31-15 45-38 36-31-22 12-37-20-20zM626 128l61 12 44 36-19 27-54-3-24-30-37-12zM634 242l72 17 36 36-29 31-57-5-30-30z" fill="#d8ddcf" stroke="#b4bfae" strokeWidth="2" strokeLinejoin="round" /><path d="M183 156 Q383 70 456 169 T674 274 M441 161 Q507 157 567 213 M438 171 Q338 212 313 235" fill="none" stroke="#bd8b3d" strokeDasharray="4 8" strokeWidth="2" opacity=".7" /><circle cx="456" cy="169" r="7" fill="#c88630" stroke="#fffaf0" strokeWidth="4" /><circle cx="456" cy="169" r="17" fill="none" stroke="#c88630" strokeOpacity=".3" strokeWidth="2" /><circle cx="397" cy="134" r="5" fill="#1e3b2a" /><circle cx="437" cy="147" r="5" fill="#1e3b2a" /><circle cx="474" cy="179" r="5" fill="#1e3b2a" /><circle cx="352" cy="205" r="5" fill="#1e3b2a" /><circle cx="560" cy="221" r="5" fill="#1e3b2a" /><circle cx="613" cy="267" r="5" fill="#1e3b2a" /><text x="467" y="160" fill="#55705c" fontSize="11" fontWeight="700">INDIA</text></svg><div className="absolute bottom-6 left-7 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#677666]"><span className="size-2 rounded-full bg-[#c88630]" /> Origin <span className="ml-4 size-2 rounded-full bg-[#1e3b2a]" /> Export lane</div></div>
            </div>
          </div>
        </section>

        <section id="quality" className="section-pad bg-[#e9e4d8]">
          <div className="container">
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div className="relative order-2 lg:order-1"><div className="overflow-hidden rounded-[1.5rem] bg-[#31513c]"><img src="/assets/divinegrow-quality.webp" alt="Quality inspection of Indian spices in a clean facility" className="aspect-[1.1] w-full object-cover" /></div><div className="absolute -bottom-5 -right-4 flex items-center gap-3 rounded-xl border border-[#d5c8ae] bg-[#fffaf0] px-4 py-3 shadow-lg sm:-right-7"><span className="grid size-9 place-items-center rounded-full bg-[#e0ebd8] text-[#376642]"><FlaskConical className="size-4" /></span><div><p className="text-xs font-bold text-[#274331]">Quality checkpoint</p><p className="text-[0.62rem] text-[#7e7d72]">Every order. Every time.</p></div></div></div>
              <div className="order-1 lg:order-2"><SectionEyebrow>Quality assurance</SectionEyebrow><h2 className="section-title mt-5">Quality is our <em>promise.</em></h2><p className="mt-6 max-w-lg text-base leading-8 text-[#6b7167]">We maintain rigorous quality standards throughout sourcing, processing, packaging, and shipment so each order meets the expectation behind your brand.</p><div className="mt-9 grid gap-3 sm:grid-cols-2">{['Purity testing', 'Moisture control', 'Hygienic processing', 'Consistent grading', 'Food safety compliance', 'Export documentation'].map((item) => <div key={item} className="flex items-center gap-3 border-b border-[#d7cdb7] pb-3 text-sm font-semibold text-[#36503d]"><span className="grid size-6 place-items-center rounded-full bg-[#dce9d4] text-[#3b7048]"><Check className="size-3.5" /></span>{item}</div>)}</div><a href="#quote" className="mt-9 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#9f6925]">Ask about documentation <ArrowUpRight className="size-4" /></a></div>
            </div>
          </div>
        </section>

        <section className="section-pad bg-[#f8f4e9]">
          <div className="container">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><SectionEyebrow>Buyer perspective</SectionEyebrow><h2 className="section-title mt-5">Good business <em>travels.</em></h2></div><p className="max-w-xs text-sm leading-6 text-[#777266] sm:text-right">The relationships we value most are the ones that become easier with every shipment.</p></div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">{[["“", "DivineGrow LLP consistently provides quality products and dependable service. Their professionalism makes them a trusted supplier.", "Food importer", "UAE"], ["“", "Excellent communication, competitive pricing, and great product consistency across shipments.", "Wholesale distributor", "Europe"], ["“", "A reliable sourcing partner for our spice requirements with excellent customer support.", "Food manufacturer", "India"]].map(([quote, text, role, region]) => <blockquote key={role} className="quote-card"><span className="font-display text-5xl leading-none text-[#c38b3b]">{quote}</span><p className="mt-3 text-[1.05rem] leading-7 text-[#455247]">{text}</p><footer className="mt-7 flex items-center justify-between border-t border-[#e0d7c4] pt-4"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#334d3c]">{role}</p><p className="mt-1 text-xs text-[#918977]">{region}</p></div><span className="flex gap-0.5 text-[#bd812d]">{[1,2,3,4,5].map((star) => <span key={star}>★</span>)}</span></footer></blockquote>)}</div>
          </div>
        </section>

        <section id="quote" className="quote-section relative overflow-hidden bg-[#d9c08a] py-16 sm:py-24">
          <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1800&q=80')" }} /><div className="absolute inset-0 bg-[linear-gradient(100deg,#c29b50_0%,#d9c08a_48%,rgba(217,192,138,0.7)_100%)]" />
          <div className="container relative"><div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div className="max-w-lg"><SectionEyebrow>Start a conversation</SectionEyebrow><h2 className="section-title mt-5">Looking for a reliable <em>spice supplier?</em></h2><p className="mt-6 text-base leading-7 text-[#5d5748]">Partner with DivineGrow LLP for quality-driven sourcing, wholesale supply solutions, and a relationship built to last.</p><div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#4d5547]"><span className="inline-flex items-center gap-2"><Check className="size-3.5 text-[#1e3b2a]" /> Export quality</span><span className="inline-flex items-center gap-2"><Check className="size-3.5 text-[#1e3b2a]" /> Competitive pricing</span><span className="inline-flex items-center gap-2"><Check className="size-3.5 text-[#1e3b2a]" /> Reliable deliveries</span><span className="inline-flex items-center gap-2"><Check className="size-3.5 text-[#1e3b2a]" /> Global reach</span></div></div><QuoteForm compact /></div></div>
        </section>

        <section id="contact" className="section-pad bg-[#1e3b2a] text-white">
          <div className="container"><div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24"><div><SectionEyebrow light>Contact DivineGrow</SectionEyebrow><h2 className="section-title mt-5 text-white">Let&apos;s grow <em className="text-[#d9b261]">together.</em></h2><p className="mt-6 max-w-md text-base leading-7 text-white/60">Whether you are an importer, distributor, wholesaler, retailer, or food manufacturer, our team is ready to support your next sourcing requirement.</p><div className="mt-9 space-y-5"><a href="https://www.google.com/maps/search/?api=1&query=%23397%2C+Sector-18B%2C+Phase-2%2C+Dwarka%2C+New+Delhi-110078" target="_blank" rel="noreferrer" className="contact-row"><MapPin className="size-5 text-[#d9b261]" /><span>#397, Sector-18B, Phase-2, Dwarka,<br />New Delhi-110078</span></a><a href="mailto:cemde.pankaj@gmail.com" className="contact-row"><Mail className="size-5 text-[#d9b261]" /><span>cemde.pankaj@gmail.com</span></a><a href="tel:+919810610262" className="contact-row"><Phone className="size-5 text-[#d9b261]" /><span>+91 98106 10262</span></a><a href="https://www.divinegrow.co.in" target="_blank" rel="noreferrer" className="contact-row"><Globe2 className="size-5 text-[#d9b261]" /><span>www.divinegrow.co.in</span></a></div><div className="mt-9 border-t border-white/15 pt-6"><div className="flex items-start gap-3"><Clock3 className="mt-0.5 size-4 text-[#d9b261]" /><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">Business hours</p><p className="mt-1 text-sm text-white/55">Monday — Saturday · 9:00 AM — 6:00 PM IST</p></div></div></div><div className="mt-8 grid gap-2 text-sm text-white/60 sm:grid-cols-2"><p className="col-span-full mb-1 text-xs font-bold uppercase tracking-[0.14em] text-white/80">Why contact us?</p>{['Request product catalogue', 'Get bulk pricing', 'Private label packaging', 'Export documentation'].map((item) => <p key={item} className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-[#d9b261]" />{item}</p>)}</div></div><div><ContactForm /><div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 sm:flex-row"><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">Prefer instant communication?</p><div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-white"><a href="https://wa.me/919810610262" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#d9b261]"><MessageCircle className="size-4 text-[#6dc38b]" /> WhatsApp us</a><a href="mailto:cemde.pankaj@gmail.com" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#d9b261]"><Mail className="size-4 text-[#d9b261]" /> Email us</a><a href="tel:+919810610262" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#d9b261]"><Phone className="size-4 text-[#d9b261]" /> Schedule a call</a></div></div></div></div></div>
        </section>

        <section className="map-section bg-[#f3eee3] py-5"><div className="container"><div className="overflow-hidden rounded-[1.25rem] border border-[#d8cdb5] bg-[#e5e6df] shadow-[0_16px_45px_rgba(37,53,39,0.08)]"><iframe title="DivineGrow LLP location in Dwarka, New Delhi" src="https://www.google.com/maps?q=%23397%2C%20Sector-18B%2C%20Phase-2%2C%20Dwarka%2C%20New%20Delhi-110078&output=embed" className="h-[280px] w-full grayscale-[0.25] sm:h-[330px]" loading="lazy" /></div></div></section>
      </main>

      <footer className="bg-[#172d21] pb-24 pt-14 text-white sm:pb-8"><div className="container"><div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]"><div><AppLogo dark /><p className="mt-6 max-w-xs text-sm leading-6 text-white/50">Bringing premium Indian spices to global markets, one dependable shipment at a time.</p><div className="mt-6 flex gap-3"><a href="https://wa.me/919810610262" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-[#d9b261] hover:text-[#d9b261]"><MessageCircle className="size-4" /></a><a href="mailto:cemde.pankaj@gmail.com" aria-label="Email" className="grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-[#d9b261] hover:text-[#d9b261]"><Mail className="size-4" /></a><a href="tel:+919810610262" aria-label="Phone" className="grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-[#d9b261] hover:text-[#d9b261]"><Phone className="size-4" /></a></div></div><div><p className="footer-heading">Explore</p><div className="footer-links">{[["Home", "#top"], ["About us", "#about"], ["Products", "#products"], ["Quality", "#quality"], ["Export markets", "#markets"], ["Contact", "#contact"]].map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div></div><div><p className="footer-heading">Products</p><div className="footer-links">{products.map((product) => <a key={product.name} href="#products">{product.name}</a>)}</div></div><div><p className="footer-heading">Trade desk</p><div className="footer-links"><a href="mailto:cemde.pankaj@gmail.com">cemde.pankaj@gmail.com</a><a href="tel:+919810610262">+91 98106 10262</a><a href="https://www.divinegrow.co.in" target="_blank" rel="noreferrer">divinegrow.co.in</a><a href="https://www.google.com/maps/search/?api=1&query=%23397%2C+Sector-18B%2C+Phase-2%2C+Dwarka%2C+New+Delhi-110078" target="_blank" rel="noreferrer">Dwarka, New Delhi</a></div></div></div><div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[0.65rem] uppercase tracking-[0.11em] text-white/35 sm:flex-row"><p>© {new Date().getFullYear()} DivineGrow LLP. All rights reserved.</p><p>Premium Indian spices · Global supply</p></div></div></footer>
      <div className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-2 rounded-full border border-[#d6c49e] bg-[#fffaf0]/95 p-2 shadow-[0_14px_35px_rgba(26,44,33,0.18)] backdrop-blur-xl sm:hidden"><a href="https://wa.me/919810610262" target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-[#dff0dc] text-[#25834b]" aria-label="WhatsApp us"><MessageCircle className="size-5" /></a><a href="tel:+919810610262" className="grid size-10 place-items-center rounded-full bg-[#e8eadf] text-[#31513d]" aria-label="Call DivineGrow"><Phone className="size-4" /></a><a href="#quote" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1e3b2a] px-4 py-3 text-[0.66rem] font-bold uppercase tracking-[0.13em] text-white">Request a quote <ArrowUpRight className="size-3.5 text-[#d9b261]" /></a></div>
    </div>
  );
}

export { Home };

// Keep these imports intentionally available for future catalogue expansions.
void FileCheck2;
void Plane;
