import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Loader2, CheckCircle2, ArrowRight, ShieldCheck, Zap, Bot } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { startAiCall } from "@/lib/backend-api";

export const Route = createFileRoute("/qualify")({
  head: () => ({
    meta: [
      { title: "Start AI Qualification — Volta" },
      {
        name: "description",
        content: "Drop in a phone number and watch Volta's AI voice agent qualify the lead in real time.",
      },
      { property: "og:title", content: "Start AI Qualification — Volta" },
      {
        property: "og:description",
        content: "Trigger a live AI qualification call in seconds.",
      },
    ],
  }),
  component: QualifyPage,
});

type Phase = "idle" | "calling" | "done";

function QualifyPage() {
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const steps = ["Dialing lead…", "Connecting agent…", "Starting call…"];

  const valid = phone.replace(/\D/g, "").length >= 7;

  async function startCall(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || phase === "calling") return;
    setPhase("calling");
    setStep(0);
    setResult(null);
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 850));
      setStep(i + 1);
    }
    try {
      const resp = await startAiCall(phone.trim());
      setResult({ ok: true, message: resp?.message || "Call started" });
      setPhase("done");
    } catch (err: any) {
      console.error("startAiCall failed:", err);
      setResult({ ok: false, message: err?.message || "Failed to start call" });
      setPhase("done");
    }
  }

  function reset() {
    setPhase("idle");
    setStep(0);
    setResult(null);
    setPhone("");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="relative">
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.35]" />
        <div
          aria-hidden
          className="absolute inset-x-0 -top-32 -z-10 h-[420px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-2xl"
        />

        <section className="container-x py-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-soft">
              <Bot className="h-3.5 w-3.5 text-primary" /> Live AI agent
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Trigger an AI qualification call
            </h1>
            <p className="mt-3 text-muted-foreground">
              Enter a phone number. Volta's voice agent will call, qualify, and add the lead to your dashboard.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-xl animate-fade-up [animation-delay:120ms]">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-8">
              {phase !== "done" ? (
                <form onSubmit={startCall} className="space-y-5">
                  <label className="block">
                    <span className="text-sm font-medium">Lead phone number</span>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (415) 555-0142"
                        inputMode="tel"
                        disabled={phase === "calling"}
                        className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                      />
                    </div>
                    <span className="mt-2 block text-xs text-muted-foreground">
                      This will trigger a real outbound call via your backend.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!valid || phase === "calling"}
                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {phase === "calling" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI calling…
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4" /> Start AI Call
                      </>
                    )}
                  </button>

                  {phase === "calling" && (
                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                        </span>
                        Live call in progress
                      </div>
                      <ul className="space-y-2 text-sm">
                        {steps.map((s, i) => {
                          const active = i < step;
                          const current = i === step;
                          return (
                            <li key={s} className="flex items-center gap-2">
                              {active ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : current ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              ) : (
                                <span className="h-4 w-4 rounded-full border border-border" />
                              )}
                              <span
                                className={
                                  active
                                    ? "text-foreground"
                                    : current
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }
                              >
                                {s}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </form>
              ) : (
                <SuccessCard phone={phone} result={result} onReset={reset} />
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
              <Trust icon={Zap} label="Sub-second latency" />
              <Trust icon={ShieldCheck} label="SOC2 in progress" />
              <Trust icon={Bot} label="Voice agent v3" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SuccessCard({
  phone,
  result,
  onReset,
}: {
  phone: string;
  result: { ok: boolean; message: string } | null;
  onReset: () => void;
}) {
  const tone = result?.ok ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive";
  return (
    <div className="text-center">
      <div
        className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${
          result?.ok ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"
        }`}
      >
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight">{result?.ok ? "Call started" : "Call failed"}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {result?.message || "Request complete."} Open the dashboard to see the lead once the webhook arrives.
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-background p-5 text-left text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Phone</span>
          <span className="text-right font-medium">{phone}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Result</span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
            {result?.ok ? "Success" : "Error"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
        <button
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-medium hover:bg-muted"
        >
          Qualify another
        </button>
        <Link
          to="/dashboard"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
        >
          Open dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Trust({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 px-2 py-2">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span>{label}</span>
    </div>
  );
}
