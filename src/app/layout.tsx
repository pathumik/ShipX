import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Cinzel, Crimson_Text, Caveat } from "next/font/google";
import { SessionProvider } from "@/context/SessionContext";
import "./globals.css";

// Original fonts for non-map pages
const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Explorer map fonts
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ShipX - Validate Your Ideas",
  description:
    "AI-guided uncertainty mapping for founders. Turn messy ideas into structured validation journeys.",
  keywords: ["startup", "validation", "AI", "uncertainty", "founder", "idea"],
  authors: [{ name: "ShipX" }],
  openGraph: {
    title: "ShipX - Validate Your Ideas",
    description: "AI-guided uncertainty mapping for founders",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f4e4c1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cinzel.variable} ${crimsonText.variable} ${caveat.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <main className="min-h-screen min-h-dvh">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
