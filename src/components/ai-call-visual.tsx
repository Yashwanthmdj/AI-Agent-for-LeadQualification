import { Phone, Sparkles, CheckCircle2 } from "lucide-react";

export function AICallVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Soft glow */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-[3rem] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, color-mix(in oklab, var(--color-primary) 35%, transparent), transparent 70%)",
        }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-elevated">
        {/* Mock call card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
              <Phone className="h-5 w-5" />
              <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-pulse-ring" />
            </div>
            <div>
              <div className="text-sm font-medium">Live AI call</div>
              <div className="text-xs text-muted-foreground">+1 (415) 555-0142</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-xs font-medium text-success-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Connected
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <Bubble side="ai">Hi Amelia, this is Volta calling on behalf of Atlas Realty. Got a minute?</Bubble>
          <Bubble side="user">Sure, go ahead.</Bubble>
          <Bubble side="ai">Are you looking to move in the next 30 days?</Bubble>
          <Bubble side="user">Yes, ideally end of month.</Bubble>
        </div>

        {/* Live transcript / equalizer */}
        <div className="mt-5 flex items-end gap-1 rounded-xl bg-muted/60 p-3">
          {[6, 14, 9, 22, 11, 18, 7, 16, 10, 20, 8, 13].map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-primary/70"
              style={{
                height: `${h}px`,
                animation: `pulse-ring 1.4s ease-in-out ${i * 0.08}s infinite`,
              }}
            />
          ))}
          <span className="ml-auto text-xs text-muted-foreground">Transcribing…</span>
        </div>
      </div>

      {/* Floating chips */}
      <div className="absolute -left-4 -top-4 hidden rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-soft sm:flex sm:items-center sm:gap-2 animate-float">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Intent detected
      </div>
      <div className="absolute -bottom-4 -right-2 hidden rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-soft sm:flex sm:items-center sm:gap-2"
        style={{ animation: "float 6s ease-in-out 1.2s infinite" }}>
        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
        Classified <span className="font-semibold text-destructive">Hot</span>
      </div>
    </div>
  );
}

function Bubble({ side, children }: { side: "ai" | "user"; children: React.ReactNode }) {
  const isAi = side === "ai";
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
          isAi
            ? "bg-foreground text-background rounded-bl-sm"
            : "bg-muted text-foreground rounded-br-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
