import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TopicVault | Book Knowledge & Topic Search",
  description:
    "Fast, intelligent topic search and indexing across your multi-volume book library.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col ambient-bg text-slate-100 selection:bg-indigo-500 selection:text-white`}
      >
        <Navbar />
        <main className="flex-1 w-full flex flex-col">{children}</main>
      </body>
    </html>
  );
}
