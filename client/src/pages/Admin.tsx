import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, LogOut, RefreshCw, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Inquiry = {
  id: string;
  created_at: string;
  inquiry_type: "contact" | "quote";
  name: string;
  company: string | null;
  country: string | null;
  business_type: string | null;
  email: string;
  phone: string | null;
  product: string | null;
  quantity: string | null;
  message: string | null;
  status: "new" | "contacted" | "qualified" | "closed";
};

const statusOptions: Inquiry["status"][] = ["new", "contacted", "qualified", "closed"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<{ email?: string } | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<"all" | "contact" | "quote">("all");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function loadInquiries() {
    if (!supabase || !session) return;
    setWorking(true);
    const { data, error: queryError } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
    setWorking(false);
    if (queryError) {
      setError(queryError.message);
      return;
    }
    setInquiries((data ?? []) as Inquiry[]);
  }

  async function checkSession() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.auth.getSession();
    const current = data.session;
    if (!current) {
      setLoading(false);
      return;
    }
    setSession({ email: current.user.email });
    const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", current.user.id).maybeSingle();
    if (adminError || !admin) {
      setError("This Supabase user is not listed as a DivineGrow admin.");
      setLoading(false);
      return;
    }
    setAuthorized(true);
    setLoading(false);
  }

  useEffect(() => {
    void checkSession();
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => {
      if (!current) {
        setSession(null);
        setAuthorized(false);
        setInquiries([]);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authorized) void loadInquiries();
  }, [authorized]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setWorking(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.user) {
      setWorking(false);
      setError(authError?.message ?? "Unable to sign in.");
      return;
    }
    const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
    setWorking(false);
    if (adminError || !admin) {
      await supabase.auth.signOut();
      setError("Your account is valid, but it has not been granted DivineGrow admin access.");
      return;
    }
    setSession({ email: data.user.email });
    setAuthorized(true);
  }

  async function updateStatus(id: string, status: Inquiry["status"]) {
    if (!supabase) return;
    const { error: updateError } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setInquiries((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setSession(null);
    setAuthorized(false);
    setInquiries([]);
  }

  const visible = filter === "all" ? inquiries : inquiries.filter((item) => item.inquiry_type === filter);

  return (
    <main className="min-h-screen bg-[#f7f3e8] text-[#1c2e24]">
      <header className="border-b border-[#dfd5be] bg-[#fbf8f0]">
        <div className="container flex min-h-[78px] items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#4c684f]"><ArrowLeft className="size-4" /> Back to website</a>
          {session && <button onClick={() => void signOut()} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8d6a35]"><LogOut className="size-4" /> Sign out</button>}
        </div>
      </header>
      <div className="container py-12 sm:py-16">
        {!supabase ? (
          <div className="mx-auto max-w-xl rounded-[1.5rem] border border-[#d7c49d] bg-[#fffaf0] p-8 text-center"><ShieldAlert className="mx-auto size-10 text-[#9f6925]" /><h1 className="mt-5 font-display text-3xl">Admin portal needs Supabase</h1><p className="mt-3 text-sm leading-6 text-[#6e6a5e]">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the deployment environment, then rebuild.</p></div>
        ) : !authorized ? (
          <div className="mx-auto max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a86d27]">DivineGrow LLP</p>
            <h1 className="mt-4 font-display text-5xl leading-none">Trade desk <em>portal.</em></h1>
            <p className="mt-5 text-sm leading-6 text-[#6e6a5e]">Sign in with an approved DivineGrow admin account to view contact messages and quote requests.</p>
            <form onSubmit={signIn} className="mt-8 rounded-[1.5rem] border border-[#d7c49d] bg-[#fffaf0] p-6 shadow-[0_24px_70px_rgba(49,42,25,0.08)]">
              <label className="field-label">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@divinegrow.co.in" /></label>
              <label className="field-label mt-4">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your Supabase Auth password" /></label>
              {error && <p className="mt-4 rounded-xl bg-[#f8e3dc] px-4 py-3 text-sm text-[#8c3e2e]">{error}</p>}
              <button disabled={working || loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#1e3b2a] px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white disabled:opacity-60">{working || loading ? "Checking access…" : "Sign in"}</button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a86d27]">Private workspace</p><h1 className="mt-3 font-display text-5xl leading-none">Enquiry <em>inbox.</em></h1><p className="mt-4 text-sm text-[#6e6a5e]">Signed in as {session?.email}</p></div><button onClick={() => void loadInquiries()} className="inline-flex items-center gap-2 self-start rounded-full border border-[#b9aa8c] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#405644] hover:bg-[#fffaf0]"><RefreshCw className={`size-4 ${working ? "animate-spin" : ""}`} /> Refresh</button></div>
            <div className="mt-10 flex flex-wrap gap-2"><button onClick={() => setFilter("all")} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] ${filter === "all" ? "bg-[#1e3b2a] text-white" : "border border-[#d5cbb5] text-[#697064]"}`}>All ({inquiries.length})</button><button onClick={() => setFilter("contact")} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] ${filter === "contact" ? "bg-[#1e3b2a] text-white" : "border border-[#d5cbb5] text-[#697064]"}`}>Contact ({inquiries.filter((item) => item.inquiry_type === "contact").length})</button><button onClick={() => setFilter("quote")} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] ${filter === "quote" ? "bg-[#1e3b2a] text-white" : "border border-[#d5cbb5] text-[#697064]"}`}>Quotes ({inquiries.filter((item) => item.inquiry_type === "quote").length})</button></div>
            {error && <p className="mt-5 rounded-xl bg-[#f8e3dc] px-4 py-3 text-sm text-[#8c3e2e]">{error}</p>}
            <div className="mt-5 grid gap-4">{visible.length === 0 ? <div className="rounded-[1.5rem] border border-dashed border-[#cfc3a8] bg-[#fffaf0] p-12 text-center text-sm text-[#777266]">No enquiries in this view yet.</div> : visible.map((item) => <article key={item.id} className="rounded-[1.5rem] border border-[#ded4bf] bg-[#fffaf0] p-5 shadow-[0_14px_35px_rgba(54,45,27,0.05)] sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${item.inquiry_type === "contact" ? "bg-[#e7edf2] text-[#3f5e76]" : "bg-[#f5e8c9] text-[#8d6a35]"}`}>{item.inquiry_type === "contact" ? "Contact" : "Quote request"}</span><span className="text-xs text-[#958a76]">{formatDate(item.created_at)}</span></div><h2 className="mt-3 font-display text-2xl text-[#1d3327]">{item.name}</h2><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6e6a5e]"><a className="underline underline-offset-2" href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a className="underline underline-offset-2" href={`tel:${item.phone}`}>{item.phone}</a>}{item.company && <span>{item.company}</span>}{item.country && <span>{item.country}</span>}</div></div><select value={item.status} onChange={(event) => void updateStatus(item.id, event.target.value as Inquiry["status"])} className="h-10 rounded-full border border-[#d6cbb2] bg-[#f8f4e9] px-4 text-xs font-bold uppercase tracking-[0.1em] text-[#526250]">{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div><div className="mt-5 grid gap-3 border-t border-[#e4dbc8] pt-5 text-sm text-[#59675c] sm:grid-cols-3">{item.product && <p><span className="block text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#9b8c74]">Product</span>{item.product}</p>}{item.quantity && <p><span className="block text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#9b8c74]">Quantity</span>{item.quantity}</p>}{item.business_type && <p><span className="block text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#9b8c74]">Business</span>{item.business_type}</p>}</div>{item.message && <p className="mt-5 rounded-xl bg-[#f5f0e6] p-4 text-sm leading-6 text-[#59675c]">{item.message}</p>}</article>)}</div>
          </div>
        )}
      </div>
    </main>
  );
}
