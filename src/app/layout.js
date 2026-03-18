// src/app/layout.js
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Digital ID Use Cases | MSC",
    template: "%s | MSC Use Cases",
  },
  description:
    "Explore a global repository of Digital ID use cases across Africa, Oceania, and beyond. Browse implementations across healthcare, agriculture, finance, transportation and more.",
  keywords: [
    "Digital ID",
    "Digital Identity",
    "Use Cases",
    "MSC",
    "MicroSave Consulting",
    "Identity Assurance",
    "Authentication",
    "Africa Digital ID",
    "Financial Inclusion",
    "MOSIP",
    "eKYC",
    "Biometric Authentication",
    "Digital Innovation",
    "Healthcare Digital ID",
    "Agriculture Digital ID",
  ],
  authors: [{ name: "MicroSave Consulting" }],
  creator: "MicroSave Consulting",
  publisher: "MicroSave Consulting",
  metadataBase: new URL("https://yoursite.com"), // ← update when deployed
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yoursite.com",
    siteName: "Digital ID Use Cases | MSC",
    title: "Digital ID Use Cases | MSC",
    description:
      "Explore a global repository of Digital ID use cases across Africa, Oceania, and beyond.",
    images: [
      {
        url: "/images/og-image.png", // ← add an og image to public/images/
        width: 1200,
        height: 630,
        alt: "MSC Digital ID Use Cases",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital ID Use Cases | MSC",
    description:
      "Explore a global repository of Digital ID use cases across Africa, Oceania, and beyond.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://yoursite.com" />
      </head>
      <body
        style={{
          minHeight: "100vh",
          background: "#fff",
          color: "#111827",
          fontFamily: '"Albert Sans", system-ui, sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <div>
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
