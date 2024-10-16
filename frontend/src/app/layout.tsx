// nextjs
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
// context
import ContextProvider from "@/contexts/ContextProvider";
// components
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://diversifi.vercel.app/"),
  title: "DiversiFi | Earn diversified yield (test app)",
  description:
    "DeFi offers high yields (10-20% APR), but the risks are often complex and not fully transparent to the average person. The mission of DiversiFi is to offer transparent, hyper-diversified stablecoin yields. When you deposit into our vaults, you will simultaneously earn yield on multiple low-risk protocols. By hyper-diversifying the source of yield, risk can be lowered.",
  openGraph: {
    url: "https://diversifi.vercel.app/",
    title: "DiversiFi | Earn diversified yield (test app)",
    description:
      "DeFi offers high yields (10-20% APR), but the risks are often complex and not fully transparent to the average person. The mission of DiversiFi is to offer transparent, hyper-diversified stablecoin yields. When you deposit into our vaults, you will simultaneously earn yield on multiple low-risk protocols. By hyper-diversifying the source of yield, risk can be lowered.",
    images: [
      {
        url: "/logoOG.png",
        width: 980,
        height: 194,
        alt: "DiversiFi",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookies = headers().get("cookie");

  return (
    <html lang="en">
      <body className={`${inter.className} h-screen flex flex-col bg-blue1 text-slate-200 overflow-x-hidden overflow-y-auto`}>
        <ContextProvider cookies={cookies}>
          <Navbar />
          {children}
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}
