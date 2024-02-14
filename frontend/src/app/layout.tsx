import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
// components
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
// wagmi
import { config } from "@/config";
import { cookieToInitialState } from "wagmi";
import ContextProvider from "@/context/index";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "diversifi",
  description: "transparent, hyperdiversified, stablecoin yields",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden text-gray-800`}>
        <ContextProvider initialState={initialState}>
          <Navbar />
          {children}
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}
