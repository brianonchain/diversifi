// nextjs
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
// wagmi & AppKit
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import AppKitProvider from "@/context";
// components
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DiversiFi",
  description: "transparent, hyperdiversified, stablecoin yields",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden text-white`}>
        <AppKitProvider initialState={initialState}>
          <Navbar />
          {children}
          <Footer />
        </AppKitProvider>
      </body>
    </html>
  );
}
