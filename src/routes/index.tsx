import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  LayoutDashboard,
  Sparkles,
  Clock,
  TrendingDown,
  AlertTriangle,
  Bot,
  Filter,
  Webhook,
  Activity,
  ArrowRight,
  Building2,
  Megaphone,
  Code2,
  User,
  CheckCircle2,
  PhoneCall,
  MessageSquareQuote,
  ListChecks,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AICallVisual } from "@/components/ai-call-visual";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Volta — Automate Lead Qualification with AI Voice Agents" },
      {
        name: "description",
        content:
          "Volta's AI voice agents call, qualify, and categorize every lead in under a minute. Stop wasting hours on cold prospects — close more, faster.",
      },
      { property: "og:title", content: "Volta — AI Lead Qualification on Autopilot" },
      {
        property: "og:description",
        content: "AI voice agents that qualify every lead in under a minute.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <UseCases />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.4]" />
      <div
        aria-hidden
        className="absolute inset-x-0 -top-40 -z-10 h-[480px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-2xl"
      />
      <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            New · Voice agent v3 with sub-second latency
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Automate Lead Qualification with{" "}
            <span className="text-gradient">AI Voice Agents</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Let AI call, qualify, and categorize your leads — so your team focuses only on
            closing. No scripts to write. No reps to hire.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/qualify"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-6 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4" /> Start Qualification
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium shadow-soft transition-colors hover:bg-muted"
            >
              <LayoutDashboard className="h-4 w-4" /> View Dashboard
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6 text-left">
            <Stat label="Avg. call time" value="48s" />
            <Stat label="Qualification accuracy" value="94%" />
            <Stat label="Lift in pipeline" value="3.2×" />
          </dl>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <AICallVisual />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function SocialProof() {
  const logos = ["Atlas Realty", "NorthCRM", "Helio Agency", "Loomstack", "Finch & Co", "Northwind"];
  return (
    <section className="border-y border-border/60 bg-surface/50">
      <div className="container-x flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-6">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by modern revenue teams
        </span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-muted-foreground/80">
          {logos.map((l) => (
            <span key={l} className="opacity-70">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Problem ---------------- */
function Problem() {
  const items = [
    {
      icon: Clock,
      title: "Manual follow-ups take too long",
      desc: "Reps burn hours dialing cold lists when they should be closing live opportunities.",
    },
    {
      icon: TrendingDown,
      title: "Low-quality leads waste effort",
      desc: "Most inbound leads aren't ready — but you don't know that until you've already called.",
    },
    {
      icon: AlertTriangle,
      title: "Missed opportunities, slow response",
      desc: "Speed-to-lead under 5 minutes wins. Most teams take hours, and the buyer moves on.",
    },
  ];
  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="The problem"
          title="Sales Teams Waste Hours on Unqualified Leads"
          subtitle="Every minute spent dialing the wrong prospect is a minute not spent closing the right one."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Solution ---------------- */
function Solution() {
  return (
    <section className="bg-foreground py-24 text-background">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="The solution"
            title="AI That Calls, Qualifies, and Filters Instantly"
            subtitle="Volta's voice agent picks up every lead the moment it arrives, runs your discovery script, and hands your team a ranked, ready-to-close pipeline."
            invert
          />
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Calls leads within 30 seconds of capture",
              "Asks structured, branching qualification questions",
              "Auto-categorizes every lead as Hot, Warm or Cold",
              "Streams transcripts and tags into your CRM",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-background/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <FlowDiagram />
      </div>
    </section>
  );
}

function FlowDiagram() {
  const nodes = [
    { icon: User, label: "New lead" },
    { icon: PhoneCall, label: "AI call" },
    { icon: MessageSquareQuote, label: "Qualification" },
    { icon: LayoutDashboard, label: "Dashboard" },
  ];
  return (
    <div className="rounded-3xl border border-background/15 bg-background/5 p-6 backdrop-blur">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {nodes.map((n, i) => (
          <div key={n.label} className="relative">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-background/15 bg-background/10 p-5 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/30 text-background">
                <n.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-medium text-background/90">{n.label}</div>
            </div>
            {i < nodes.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-background/40 sm:block" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-background/15 bg-gradient-to-br from-primary/30 to-primary-glow/20 p-5 text-sm text-background/90">
        <div className="flex items-center justify-between">
          <span className="font-medium">Lead #4821 · Amelia Carter</span>
          <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
            Hot 🔥
          </span>
        </div>
        <div className="mt-2 text-xs text-background/70">
          Budget $650K – $800K · Timeline 30 days · Intent: high
        </div>
      </div>
    </div>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  const steps = [
    { n: "01", icon: Phone, title: "Enter lead phone number", desc: "Drop a number into Volta — manually, via webhook, or from your CRM." },
    { n: "02", icon: Bot, title: "AI agent calls instantly", desc: "Sub-second latency voice agent dials within seconds of capture." },
    { n: "03", icon: ListChecks, title: "Collects structured responses", desc: "Branches through your script, captures budget, intent, timeline." },
    { n: "04", icon: LayoutDashboard, title: "Lead appears in dashboard", desc: "Categorized, scored, and ready for your reps to close." },
  ];
  return (
    <section id="how" className="py-24">
      <div className="container-x">
        <SectionHeading eyebrow="How it works" title="From phone number to qualified pipeline in under a minute" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1">
              <div className="text-xs font-semibold tracking-widest text-primary">{s.n}</div>
              <div className="mt-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
function Features() {
  const items = [
    { icon: Filter, title: "Smart Lead Qualification", desc: "Branching scripts, intent detection, and objection handling." },
    { icon: Activity, title: "Real-time Dashboard", desc: "Watch calls land, filter by status, jump straight to hot leads." },
    { icon: Bot, title: "AI Voice Conversations", desc: "Natural, low-latency dialogue powered by frontier voice models." },
    { icon: Sparkles, title: "Automated Classification", desc: "Hot, Warm, or Cold — auto-tagged with reasoning you can audit." },
    { icon: Webhook, title: "API & Webhook Integration", desc: "Plug Volta into your CRM, forms, and Zapier in minutes." },
    { icon: LayoutDashboard, title: "Built for revenue teams", desc: "Roles, queues, and exports designed around the SDR workflow." },
  ];
  return (
    <section id="features" className="bg-surface/60 py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to qualify at the speed of inbound"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div
                aria-hidden
                className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 60%)",
                }}
              />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Use cases ---------------- */
function UseCases() {
  const items = [
    { icon: Building2, title: "Real Estate Agencies", desc: "Qualify property buyers by budget, area and timeline before a human picks up." },
    { icon: Megaphone, title: "Marketing Agencies", desc: "Filter retainers from tire-kickers and route only serious briefs to your team." },
    { icon: Code2, title: "SaaS Companies", desc: "Pre-qualify demo requests for ICP fit, seat count and buying authority." },
    { icon: User, title: "Freelancers & Consultants", desc: "Never lose a lead — Volta handles intake while you ship client work." },
  ];
  return (
    <section id="use-cases" className="py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Use cases" title="Built for any team that lives or dies on inbound" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((u) => (
            <div key={u.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <u.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold">{u.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="pb-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-foreground to-foreground/95 p-10 text-center text-background shadow-elevated md:p-16">
          <div
            aria-hidden
            className="absolute -top-40 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
          />
          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
            Start automating your lead qualification today
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-background/70">
            Spin up your first AI voice agent in minutes. No credit card. No setup calls.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link
              to="/qualify"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-background px-6 text-sm font-medium text-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Helpers ---------------- */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  invert,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  invert?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <div
          className={`text-xs font-semibold uppercase tracking-widest ${
            invert ? "text-primary-glow" : "text-primary"
          }`}
        >
          {eyebrow}
        </div>
      )}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-base ${invert ? "text-background/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
