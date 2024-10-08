// nextjs
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
// wagmi & AppKit
import { cookieToInitialState } from "wagmi";
import { config } from "@/config/wagmiConfig";
import AppKitProvider from "@/contexts/AppKitProvider";
// components
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";
// react redux
import ReduxProvider from "@/state/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DiversiFi",
  description: "transparent, hyperdiversified, stablecoin yields",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className={`${inter.className} h-screen flex flex-col bg-blue1 text-slate-200 overflow-x-hidden overflow-y-auto`}>
        <ReduxProvider>
          <AppKitProvider initialState={initialState}>
            <Navbar />
            {children}
            <Footer />
          </AppKitProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
