import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: { default: "Garnishii — Explore India’s professions", template: "%s — Garnishii" },
  description: "Explore a structured map of Indian industries, career fields, specialisations and professions. Check the verification status on each guide.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`}><body><Navbar /><main className="page-main">{children}</main><Footer /></body></html>;
}
