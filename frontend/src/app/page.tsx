"use client";
// nextjs
import { useState, useEffect } from "react";
// components
import Navbar from "@/app/_components/Navbar";
import Dashboard from "@/app/_components/Dashboard";
import Vaults from "@/app/_components/Vaults";
import About from "@/app/_components/About";
import Footer from "@/app/_components/Footer";

export type NavLink = { id: string; title: string };

export default function Home() {
  const [page, setPage] = useState("dashboard");

  const navLinks: NavLink[] = [
    {
      id: "dashboard",
      title: "Dashboard",
    },
    {
      id: "vaults",
      title: "Vaults",
    },
  ];
  // wrap each components with 2 divs. 1st div is to provide full width background color, 2nd div is to limit widht in case of ultrawide screens
  return (
    <main className="w-full h-screen overflow-x-hidden overflow-y-auto bg-blue1 text-white">
      <div id="Navbar" className="w-full flex justify-center">
        <div className="w-full flex justify-center xl:max-w-[1440px]">
          <Navbar navLinks={navLinks} page={page} setPage={setPage} />
        </div>
      </div>

      {page == "dashboard" && (
        <div id="Dashboard" className="w-full flex justify-center">
          <div className="w-full flex justify-center xl:max-w-[1440px]">
            <Dashboard />
          </div>
        </div>
      )}

      {page == "vaults" && (
        <div id="Vaults" className="w-full flex justify-center ">
          <div className="w-full flex justify-center xl:max-w-[1440px]">
            <Vaults />
          </div>
        </div>
      )}

      {page == "about" && (
        <div id="About" data-show="yes" className="w-full flex justify-center">
          <div className="w-full flex justify-center xl:max-w-[1440px]">
            <About />
          </div>
        </div>
      )}

      <div id="Footer" className="w-full flex justify-center">
        <div className="w-full flex justify-center xl:max-w-[1440px]">
          <Footer navLinks={navLinks} setPage={setPage} />
        </div>
      </div>
    </main>
  );
}
