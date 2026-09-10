import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qarty.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Qarty · 1-Tap In-Store QR Tags & Menus",
    template: "%s | Qarty",
  },
  description:
    "Instant in-store QR price tags and digital menus for physical retail, dining, and pop-up events in Ibadan, Nigeria. Point phone camera for instant verified prices with zero app download.",
  keywords: [
    "Qarty",
    "Digital Price Tag Nigeria",
    "QR Code Menu Ibadan",
    "Physical Retail Price Check",
    "Store Navigation Ibadan",
    "Retail SaaS Nigeria",
  ],
  authors: [{ name: "Qarty Technologies" }],
  creator: "Qarty",
  publisher: "Qarty",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Qarty",
    title: "Qarty · 1-Tap In-Store QR Tags & Menus",
    description:
      "Instant in-store QR price tags and digital menus for physical retail, dining, and pop-up events in Ibadan, Nigeria. Zero app download required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qarty · 1-Tap In-Store QR Tags & Menus",
    description:
      "Instant in-store QR price tags and digital menus for physical retail, dining, and pop-up events in Ibadan, Nigeria.",
    creator: "@qartyapp",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SurePrice",
    operatingSystem: "All Web Browsers (iOS / Android / Desktop)",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NGN",
    },
    description:
      "Zero-friction physical QR code price verification and digital menu layer tailored for Nigerian retail merchants and shoppers.",
  };

  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#0DCF4D" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
