import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roaming In The Know - Your Ultimate Travel Guide",
  description:
    "Discover the best travel destinations, tips, and itineraries with Roaming In The Know. Explore hidden gems, top attractions, and expert advice for your next adventure.",
  keywords:
    "travel, travel guide, best destinations, itineraries, travel tips, hidden gems, adventure, backpacking, Roaming In The Know",
  openGraph: {
    title: "Roaming In The Know - Travel Smarter",
    description:
      "Your ultimate travel guide to the world's most stunning destinations, hidden gems, and expert tips.",
    url: "https://www.roamingintheknow.com",
    type: "website",
    images: [
      {
        url: "https://www.roamingintheknow.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Roaming In The Know - Travel Blog",
      },
    ],
    videos: [
      {
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
        width: 1280,
        height: 720,
        type: "text/html",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roaming In The Know - Travel Smarter",
    description:
      "Explore travel tips, itineraries, and hidden gems with Roaming In The Know.",
    site: "@roamingintheknow",
    images: ["https://www.roamingintheknow.com/twitter-card.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data for SEO & Social Media */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Roaming In The Know",
              "url": "https://www.roamingintheknow.com",
              "description":
                "Discover the best travel destinations, tips, and itineraries with Roaming In The Know.",
              "sameAs": [
                "https://www.instagram.com/roamingintheknow",
                "https://www.youtube.com/c/RoamingInTheKnow",
                "https://www.facebook.com/RoamingInTheKnow",
                "https://twitter.com/roamingintheknow",
              ],
              "publisher": {
                "@type": "Organization",
                "name": "Roaming In The Know",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.roamingintheknow.com/logo.png",
                  "width": 500,
                  "height": 500,
                },
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.roamingintheknow.com",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
