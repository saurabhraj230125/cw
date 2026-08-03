import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Bypassing the alias by using a direct relative path to the components folder outside of 'app'
import { ClickSoundProvider } from "../components/ClickSoundProvider"; 
import "./globals.css";

// The Geist font offers incredible legibility for data-dense ERP dashboards
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoachingWala | Executive ERP Panel",
  description: "Enterprise-grade operating system for coaching institutes. Manage student records, attendance, fees, study materials, and analytics securely.",
};

export const viewport: Viewport = {
  themeColor: "#0055a5", // Updated to match the classic CW Blue branding
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents forced zooming on mobile devices when tapping inputs
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning 
    >
      <body 
        className="min-h-full font-sans antialiased bg-[#f3f4f6] text-gray-900 selection:bg-[#0055a5]/20 selection:text-[#0055a5]" 
        suppressHydrationWarning
      >
        {/* Global Sound Provider wrapped around the entire application */}
        <ClickSoundProvider>
          {children}
        </ClickSoundProvider>
      </body>
    </html>
  );
}