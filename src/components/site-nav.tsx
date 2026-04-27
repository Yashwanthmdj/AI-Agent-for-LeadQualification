import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-soft">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 3a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4zm-7 9h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.93V21h-2v-2.07A7 7 0 0 1 5 12z" />
            </svg>
          </span>
          <span>Volta</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="/#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="/#use-cases" className="transition-colors hover:text-foreground">Use cases</a>
          <Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/qualify"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Start Qualification
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="container-x flex flex-col gap-3 py-4 text-sm">
            <a href="/#features" onClick={() => setOpen(false)}>Features</a>
            <a href="/#how" onClick={() => setOpen(false)}>How it works</a>
            <a href="/#use-cases" onClick={() => setOpen(false)}>Use cases</a>
            <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
            <Link
              to="/qualify"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-4 font-medium text-background"
            >
              Start Qualification
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
