import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { site } from "@/content/site";
import { organisationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieNotice } from "@/components/site/CookieNotice";
import { StickyCta } from "@/components/site/StickyCta";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  keywords: [
    "children's home Bangalore",
    "orphanage Hennur",
    "orphanage Bangalore",
    "sponsor a child Bangalore",
    "donate children's home Karnataka",
    "volunteer orphanage Bangalore",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf8f3",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Structured data is static and built from our own content — safe.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organisationJsonLd(), websiteJsonLd()]),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />

        {/* Clears the fixed mobile CTA so the footer's last row is never left
            sitting underneath it. Desktop has no dock, so no space is taken. */}
        <div aria-hidden className="h-20 md:hidden" />

        {/*
          One fixed stack at the bottom so the cookie notice and the mobile CTA
          can never overlap each other — they simply sit in a column. The
          wrapper ignores pointer events so it does not blanket the page; each
          child re-enables them for itself.
        */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-90 flex flex-col">
          <StickyCta />
          <CookieNotice />
        </div>

        {/* Cookieless and carries no identifier, so it needs no consent. */}
        <Analytics />
      </body>
    </html>
  );
}
