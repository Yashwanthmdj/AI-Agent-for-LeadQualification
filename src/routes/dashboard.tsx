import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Phone, Plus, Filter as FilterIcon, Inbox } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { listLeads, type LeadRecord, type LeadStatus } from "@/lib/backend-api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Volta" },
      {
        name: "description",
        content: "Live view of every lead Volta's AI agent has qualified, ranked by intent.",
      },
      { property: "og:title", content: "Dashboard — Volta" },
      {
        property: "og:description",
        content: "Hot, warm, cold — every lead, every call, in one view.",
      },
    ],
  }),
  component: DashboardPage,
});

const STATUSES: ("All" | LeadStatus)[] = ["All", "Hot", "Warm", "Cold"];

function DashboardPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | LeadStatus>("All");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await listLeads();
        if (active) setLeads(data);
      } catch (e) {
        console.error("Failed to load leads:", e);
        if (active) setLeads([]);
      }
    };
    void load();
    const interval = window.setInterval(load, 5000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "All" && l.status !== filter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.requirement.toLowerCase().includes(q)
      );
    });
  }, [leads, query, filter]);

  const counts = useMemo(
    () => ({
      All: leads.length,
      Hot: leads.filter((l) => l.status === "Hot").length,
      Warm: leads.filter((l) => l.status === "Warm").length,
      Cold: leads.filter((l) => l.status === "Cold").length,
    }),
    [leads]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="container-x py-10 lg:py-14">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Lead pipeline</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every call Volta has qualified for you, ranked by intent.
            </p>
          </div>
          <Link
            to="/qualify"
            className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> New qualification
          </Link>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total leads" value={counts.All} accent="bg-primary/10 text-primary" />
          <StatCard label="Hot 🔥" value={counts.Hot} accent="bg-destructive/10 text-destructive" />
          <StatCard label="Warm 🙂" value={counts.Warm} accent="bg-warning/20 text-warning-foreground" />
          <StatCard label="Cold ❄️" value={counts.Cold} accent="bg-info/20 text-info-foreground" />
        </div>

        {/* Toolbar */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-input bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone, or requirement…"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-muted p-1 text-xs">
            <FilterIcon className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`inline-flex h-8 items-center rounded-lg px-3 font-medium transition-colors ${
                  filter === s
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s} <span className="ml-1.5 text-muted-foreground/70">{counts[s as keyof typeof counts]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table (md+) */}
        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-border bg-card shadow-soft md:block">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <Th>Name</Th>
                <Th>Requirement</Th>
                <Th>Budget</Th>
                <Th>Timeline</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-t border-border transition-colors hover:bg-muted/30">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 text-xs font-semibold text-primary">
                        {initials(l.name)}
                      </div>
                      <div>
                        <div className="font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground">{l.phone}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{l.requirement}</Td>
                  <Td className="whitespace-nowrap">{formatBudget(l.budget)}</Td>
                  <Td className="whitespace-nowrap">{l.timeline}</Td>
                  <Td>
                    <StatusBadge status={l.status} />
                  </Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <Empty />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="mt-4 grid gap-3 md:hidden">
          {filtered.map((l) => (
            <div key={l.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 text-xs font-semibold text-primary">
                    {initials(l.name)}
                  </div>
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {l.phone}
                    </div>
                  </div>
                </div>
                <StatusBadge status={l.status} />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <Cell label="Need" value={l.requirement} />
                <Cell label="Budget" value={formatBudget(l.budget)} />
                <Cell label="Timeline" value={l.timeline} />
              </dl>
            </div>
          ))}
          {filtered.length === 0 && <Empty />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className={`inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium ${accent}`}>{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 font-medium">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-4 align-middle ${className}`}>{children}</td>;
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium leading-tight">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const map = {
    Hot: { cls: "bg-destructive/10 text-destructive ring-destructive/20", emoji: "🔥" },
    Warm: { cls: "bg-warning/20 text-warning-foreground ring-warning/30", emoji: "🙂" },
    Cold: { cls: "bg-info/20 text-info-foreground ring-info/30", emoji: "❄️" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${s.cls}`}>
      {s.emoji} {status}
    </span>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="h-5 w-5" />
      </div>
      <div className="text-sm font-medium">No leads match</div>
      <div className="text-xs text-muted-foreground">Try clearing filters or qualifying a new lead.</div>
      <Link
        to="/qualify"
        className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-medium text-background"
      >
        <Plus className="h-3.5 w-3.5" /> New qualification
      </Link>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatBudget(budget: number) {
  const b = Number(budget || 0);
  if (!Number.isFinite(b) || b <= 0) return "—";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(b);
  } catch {
    return String(b);
  }
}
