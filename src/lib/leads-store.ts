// Simple cross-page in-memory store for mock leads (no backend).
// Persists to localStorage so dashboard survives reloads.

export type LeadStatus = "Hot" | "Warm" | "Cold";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  requirement: string;
  budget: string;
  timeline: string;
  status: LeadStatus;
  createdAt: number;
};

const KEY = "volta.leads.v1";

const SEED: Lead[] = [
  {
    id: "ld_001",
    name: "Amelia Carter",
    phone: "+1 (415) 555-0142",
    requirement: "3BHK apartment in downtown",
    budget: "$650K – $800K",
    timeline: "30 days",
    status: "Hot",
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: "ld_002",
    name: "Marcus Lin",
    phone: "+1 (212) 555-0188",
    requirement: "B2B SaaS demo — 50 seats",
    budget: "$2K / month",
    timeline: "This quarter",
    status: "Warm",
    createdAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: "ld_003",
    name: "Sofia Reyes",
    phone: "+34 612 555 091",
    requirement: "Marketing agency retainer",
    budget: "Exploring",
    timeline: "6+ months",
    status: "Cold",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "ld_004",
    name: "Daniel Okafor",
    phone: "+44 20 7946 1234",
    requirement: "Commercial loft, 2,000 sqft",
    budget: "$1.2M",
    timeline: "Immediate",
    status: "Hot",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "ld_005",
    name: "Priya Shah",
    phone: "+91 98201 55432",
    requirement: "Freelance design pipeline",
    budget: "$3K project",
    timeline: "2 weeks",
    status: "Warm",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
];

function read(): Lead[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as Lead[];
  } catch {
    return SEED;
  }
}

function write(leads: Lead[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(leads));
  window.dispatchEvent(new CustomEvent("volta:leads-changed"));
}

export function getLeads(): Lead[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function addLead(lead: Lead) {
  const next = [lead, ...read()];
  write(next);
}

export function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("volta:leads-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("volta:leads-changed", handler);
    window.removeEventListener("storage", handler);
  };
}

const FIRST = ["Jordan", "Riley", "Maya", "Ethan", "Noor", "Liam", "Aria", "Kai", "Zoe", "Theo"];
const LAST = ["Bennett", "Patel", "Nguyen", "Silva", "Hassan", "Kim", "Rossi", "Andersen", "Cohen", "Wallace"];
const REQS = [
  "2BHK apartment, sea view",
  "Enterprise CRM integration",
  "Performance marketing retainer",
  "Office space — 3,500 sqft",
  "Series A pitch coaching",
  "Custom landing page build",
];
const BUDGETS = ["$25K – $40K", "$1.5K / month", "$200K", "Exploring", "$5K project", "$80K – $120K"];
const TIMELINES = ["This week", "30 days", "Q2", "Immediate", "6+ months", "Flexible"];

export function generateMockQualification(phone: string): Lead {
  const status: LeadStatus = (["Hot", "Warm", "Cold"] as LeadStatus[])[Math.floor(Math.random() * 3)];
  const name = `${FIRST[Math.floor(Math.random() * FIRST.length)]} ${LAST[Math.floor(Math.random() * LAST.length)]}`;
  return {
    id: `ld_${Math.random().toString(36).slice(2, 8)}`,
    name,
    phone,
    requirement: REQS[Math.floor(Math.random() * REQS.length)],
    budget: BUDGETS[Math.floor(Math.random() * BUDGETS.length)],
    timeline: TIMELINES[Math.floor(Math.random() * TIMELINES.length)],
    status,
    createdAt: Date.now(),
  };
}
