import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { BottomNav } from '@/components/ui/BottomNav'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Backburner",
  description: "Log why tasks were postponed, then surface behavioral patterns over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen pb-24">
            {children}
          </div>
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
