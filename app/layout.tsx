import type { Metadata } from "next";
// import { Inter, Merriweather } from "next/font/google";
import { Quicksand, Playfair_Display } from "next/font/google";
import "./styles/globals.css";

// Load Google Fonts with optimal settings
const quicksand = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"], // Load only necessary weights
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"], // Load only necessary weights
});
// const inter = Inter({
//   variable: "--font-sans",
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["400", "600", "700"], // Load only necessary weights
// });

// const merriweather = Merriweather({
//   variable: "--font-serif",
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["400", "700"], // Load only necessary weights
// });

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
      </head>
      <body className={`${quicksand.variable} ${playfair.variable} antialiased`}>
      {/* <body className={`${inter.variable} ${merriweather.variable} antialiased`}> */}
        {children}
      </body>
    </html>
  );
}
