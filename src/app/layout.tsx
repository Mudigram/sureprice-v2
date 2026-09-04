import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sureprice.app'),
  title: {
    default: "SurePrice · Know Before You Buy",
    template: "%s | SurePrice",
  },
  description:
    "Digital price tag & menu layer over physical retail, dining, and event pop-ups in Nigeria. Scan any product QR code for instant verified prices with zero app download.",
  keywords: [
    "SurePrice",
    "Digital Price Tag Nigeria",
    "QR Code Menu Lagos",
    "Physical Retail Price Check",
    "Store Navigation",
    "Retail SaaS Nigeria",
  ],
  authors: [{ name: "SurePrice Technologies" }],
  creator: "SurePrice",
  publisher: "SurePrice",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://sureprice.app",
    siteName: "SurePrice",
    title: "SurePrice · Know Before You Buy",
    description:
      "Digital price tag & menu layer over physical retail, dining, and event pop-ups in Nigeria. Instant verified prices with zero app download.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SurePrice · Know Before You Buy",
    description:
      "Digital price tag & menu layer over physical retail, dining, and event pop-ups in Nigeria.",
    creator: "@sureprice_app",
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
