import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

const FAVICON_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%234F46E5'/><stop offset='100%' stop-color='%237C3AED'/></linearGradient></defs><rect width='64' height='64' rx='14' fill='url(%23g)'/><path d='M32 16a10 10 0 0 0-10 10v8a10 10 0 0 0 20 0v-8a10 10 0 0 0-10-10zm0 32a14 14 0 0 1-14-14h4a10 10 0 0 0 20 0h4a14 14 0 0 1-14 14z' fill='white'/></svg>`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Volta — AI Lead Qualification on Autopilot" },
      {
        name: "description",
        content:
          "Volta deploys AI voice agents that call, qualify, and categorize your leads in real time — so your sales team only spends time closing.",
      },
      { name: "author", content: "Volta" },
      { property: "og:title", content: "Volta — AI Lead Qualification on Autopilot" },
      {
        property: "og:description",
        content: "AI voice agents that qualify every lead in under a minute.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", content: "#4F46E5" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: `data:image/svg+xml;utf8,${FAVICON_SVG}` },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
