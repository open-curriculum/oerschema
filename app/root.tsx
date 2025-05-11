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
import { ThemeProvider } from "~/components/ui/theme-provider";
import { useTheme } from "~/components/ui/theme-provider";
import { withBase } from "~/lib/utils";

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

function ThemeAwareContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const logoSrc = withBase(
    theme === "dark"
      ? "oerschema-logo-white.png"
      : "oerschema-logo-black.png"
  );

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        {/* Top bar for mobile - with space for hamburger on left */}
        <div className="h-14 border-b lg:hidden flex items-center justify-center relative">
          <div className="w-14"></div> {/* Space for hamburger */}
          <img src={logoSrc} alt="OER Schema" className="h-8" />
          <div className="w-14"></div> {/* Keep symmetrical padding */}
        </div>
        <main className="flex-1">
          <div className="mx-auto w-full px-2 sm:px-4 lg:px-6 py-6 md:max-w-7xl">
            {children}
          </div>
          <ScrollRestoration />
          <Scripts />
        </main>
        <Footer />
      </div>
    </div>
  );
}

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
        <ThemeProvider defaultTheme="system" storageKey="oerschema-theme">
          <ThemeAwareContent>{children}</ThemeAwareContent>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
