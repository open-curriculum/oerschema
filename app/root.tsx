import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Sidebar } from "~/components/sidebar";
import { Footer } from "~/components/footer";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen relative">
          <Sidebar />
          <div className="flex flex-col flex-1">
            {/* Top bar for mobile - with space for hamburger on left */}
            <div className="h-14 border-b lg:hidden flex items-center justify-center relative">
              <div className="w-14"></div> {/* Space for hamburger */}
              <img src="/logo.png" alt="OER Schema" className="h-8" />
              <div className="w-14"></div> {/* Balance the layout */}
            </div>
            <main className="flex-1 overflow-auto">
              {children}
              <ScrollRestoration />
              <Scripts />
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
