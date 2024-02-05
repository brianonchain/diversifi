import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { Web3Modal } from "../context/Web3Modal";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "diversifi",
  description: "transparent, hyperdiversified, stablecoin yields",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Modal>
          <Navbar />
          {children}
          <Footer />
        </Web3Modal>
      </body>
    </html>
  );
}
