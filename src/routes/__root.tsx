import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ScrollProgressBar } from "../components/site/ScrollProgressBar";
import { BackToTop } from "../components/site/BackToTop";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <img
          src="/assets/Trophy.png"
          alt=""
          aria-hidden="true"
          className="mx-auto mb-6"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "contain",
            filter: "grayscale(50%) opacity(0.6)",
            animation: "glowPulse 3s ease-in-out infinite",
          }}
        />
        <h1 className="text-7xl font-display text-gold-gradient">404</h1>
        <h2 className="mt-4 text-xl font-cinzel text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has wandered off the red carpet.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-gold">Return Home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-cinzel text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">Try again</button>
          <a href="/" className="btn-outline-gold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BCS Ratna Award — India's Premier Broadcasting & Media Award" },
      { name: "description", content: "BCS Ratna Award by Aavishkar Media Group — celebrating excellence in Broadcasting, Cable, Satellite, Digital Media & Technology since 2010." },
      { name: "author", content: "Aavishkar Media Group" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#C9A84C" },
      { property: "og:title", content: "BCS Ratna Award — India's Premier Broadcasting & Media Award" },
      { property: "og:description", content: "BCS Ratna Award by Aavishkar Media Group — celebrating excellence in Broadcasting, Cable, Satellite, Digital Media & Technology since 2010." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BCS Ratna Award — India's Premier Broadcasting & Media Award" },
      { name: "twitter:description", content: "BCS Ratna Award by Aavishkar Media Group — celebrating excellence in Broadcasting, Cable, Satellite, Digital Media & Technology since 2010." },
      { property: "og:image", content: "/assets/BCS-Website-Logo.png" },
      { name: "twitter:image", content: "/assets/BCS-Website-Logo.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/assets/Trophy.png" },
      { rel: "apple-touch-icon", href: "/assets/Trophy.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProgressBar />
      <Outlet />
      <BackToTop />
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919811120650?text=Hello%20BCS%20Ratna%20Award%202026"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-floating-btn"
        title="Chat on WhatsApp"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.447 0-2.817.561-3.846 1.51-.968.903-1.542 2.167-1.542 3.479 0 2.8 2.293 5.03 5.392 5.03 1.447 0 2.817-.561 3.846-1.51.968-.903 1.542-2.167 1.542-3.479 0-2.8-2.293-5.03-5.392-5.03M2.421 20.94l1.264-3.72c-.808-1.342-1.265-2.874-1.265-4.494C2.42 5.902 6.38 2 11.294 2c2.707 0 5.252 1.055 7.178 2.973.868.86 1.551 1.857 2.012 2.943.461 1.086.709 2.248.709 3.464 0 4.968-3.96 9.009-8.875 9.009-.869 0-1.713-.105-2.534-.31l-3.673 1.161z" />
        </svg>
      </a>
    </QueryClientProvider>
  );
}
