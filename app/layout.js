import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { DM_Sans, Playfair_Display } from "next/font/google";
import MainNavigation from "./MainNavigation";
import Providers from "./providers";
import KeyboardAccess from "./KeyboardAccess";
import { getSession } from "@/lib/session";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et",
  ),
  title: {
    template: "%s | Addis Eats",
    default: "Addis Eats — Ethiopian food delivery in Addis Ababa",
  },
  description:
    "Order Ethiopian favorites including Doro Wot, Tibs, Kitfo, and Shiro from Addis Eats.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ET",
    siteName: "Addis Eats",
    title: "Addis Eats — Ethiopian food delivery in Addis Ababa",
    description:
      "Discover Ethiopian favorites and order from Addis Eats for delivery across Addis Ababa.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Addis Eats Ethiopian food delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats — Ethiopian food delivery",
    description: "Ethiopian favorites delivered across Addis Ababa.",
    images: ["/opengraph-image"],
  },
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const user = await getSession();

  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>
        <Providers>
          <a className="skip-link" href="#main-content">Skip to main content</a>
          <KeyboardAccess />
          <header className="site-header">
            <div className="container nav">
              <Link className="brand" href="/" aria-label="Addis Eats home">
                <img className="brand-logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCYlCN2IPNQ1LiPjsaP0dK85SmwSbiZkKNjuOa-JRcw&s=10" alt="Addis Eats logo" />
                <span>Addis Eats</span>
              </Link>
              <MainNavigation user={user} />
            </div>
          </header>

          {/* Main content target for keyboard and assistive-technology users. */}
          <div id="main-content" tabIndex={-1}>{children}</div>

          {user?.role === "admin" ? null : <footer className="site-footer">
            <div className="container footer-grid">
              <div className="footer-brand-column">
                <Link className="brand" href="/" aria-label="Addis Eats home">
                  <img className="brand-logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCYlCN2IPNQ1LiPjsaP0dK85SmwSbiZkKNjuOa-JRcw&s=10" alt="Addis Eats logo" />
                  <span>Addis Eats</span>
                </Link>
                <p className="footer-tagline">The flavors of Ethiopia, delivered with care.</p>
                <p className="footer-location">Serving Ethiopian favorites across Addis Ababa</p>
              </div>
              <div className="footer-column">
                <strong>Explore</strong>
                <Link href="/menu">Browse the menu</Link>
                <Link href="/cart">Your cart</Link>
              </div>
              <div className="footer-column">
                <strong>Customer care</strong>
                <Link href="/signin">Sign in</Link>
                <Link href="/checkout">Checkout</Link>
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
            <div className="container footer-bottom">
              <span>© {new Date().getFullYear()} Addis Eats</span>
              <span>Made for the love of Ethiopian food.</span>
            </div>
          </footer>}
        </Providers>

        {process.env.NEXT_PUBLIC_ANALYTICS_SRC ? (
          <Script
            src={process.env.NEXT_PUBLIC_ANALYTICS_SRC}
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
