import "~/styles/globals.css";

import React from "react";
import { Inter } from "next/font/google";

import { Toaster } from "@acme/ui/toaster";

import { Providers } from "~/app/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "AI Game - West world",
  description:
    "Creating On-chain Digital States Starting with an AI West world Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} tracking-tight text-white antialiased`}
      >
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          <Providers>{children}</Providers>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
