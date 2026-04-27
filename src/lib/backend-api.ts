export type LeadStatus = "Hot" | "Warm" | "Cold";

export type LeadRecord = {
  id: string;
  name: string;
  phone: string;
  requirement: string;
  budget: number;
  timeline: string;
  status: LeadStatus;
  createdAt?: unknown;
};

type ApiListLeadsResponse = { success: true; leads: Array<Record<string, unknown>> };

type ApiStartCallResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
};

function apiBase() {
  // Set this in `.env.local` as VITE_BACKEND_URL=http://localhost:5000
  // If empty, we’ll use same-origin relative requests (works behind a reverse proxy).
  return (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/+$/, "") ?? "";
}

async function apiFetch(path: string, init?: RequestInit) {
  const url = `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg = json?.error || json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json;
}

export async function startAiCall(phone: string): Promise<ApiStartCallResponse> {
  return await apiFetch("/api/start-call", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function listLeads(): Promise<LeadRecord[]> {
  const resp = (await apiFetch("/api/leads")) as ApiListLeadsResponse;
  const leads = Array.isArray(resp?.leads) ? resp.leads : [];

  return leads.map((raw: any) => ({
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    phone: String(raw.phone ?? ""),
    requirement: String(raw.requirement ?? ""),
    budget: Number(raw.budget ?? 0),
    timeline: String(raw.timeline ?? ""),
    status: raw.status as LeadStatus,
    createdAt: raw.createdAt,
  }));
}

