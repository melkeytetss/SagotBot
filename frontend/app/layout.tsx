import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SagotBot - AI Phone Receptionist for Philippine Businesses",
  description: "The AI phone receptionist that speaks fluent Taglish. Answers 100% of customer inquiries, qualifies leads, and books appointments straight into your Google Calendar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
