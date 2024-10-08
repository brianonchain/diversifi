"use client";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
// wagmi
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useAccountEffect } from "wagmi";
// images
import { FaCircle } from "react-icons/fa";
import { PiX, PiList } from "react-icons/pi";

export type NavLink = { text: string; route: string };
export const navLinks: NavLink[] = [
  {
    text: "Dashboard",
    route: "/",
  },
  {
    text: "Vaults",
    route: "/vaults",
  },
];

export default function Navbar() {
  const [menuModal, setMenuModal] = useState(false);
  const pathname = usePathname();
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();

  useAccountEffect({
    onConnect(data) {
      console.log("WAGMI Connected!", data);
    },
    onDisconnect() {
      console.log("WAGMI Disconnected!");
    },
  });

  return (
    <nav className="w-full flex justify-center">
      <div className="sectionSize h-[64px] flex items-center justify-between">
        {/*---logo---*/}
        <Image src="/logo.svg" alt="navLogo" width={0} height={0} className="ml-[2px] w-[100px] sm:w-[140px]" />

        {/*--- desktop links---*/}
        <div className="hidden sm:flex space-x-4 md:space-x-12">
          {navLinks.map((i) => (
            <Link key={i.text} href={i.route} className={`${i.text == pathname ? "underlineStatic" : "underlineAni"} text-lg font-semibold text-center cursor-pointer  relative`}>
              {i.text}
            </Link>
          ))}
        </div>

        {/*--- button---*/}
        {isConnected ? (
          <button className="buttonSecondary flex items-center" onClick={() => open({ view: "Account" })}>
            <FaCircle className="mr-2 text-green-500 w-[12px] h-[12px]" /> {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>
        ) : (
          <button className="buttonPrimary" onClick={() => open()}>
            Connect
          </button>
        )}

        {/*--- harmbuger menu ---*/}
        <PiList
          size={40}
          onClick={async () => {
            setMenuModal(true);
            document.body.classList.add("halfHideScrollbar");
          }}
          className="sm:hidden cursor-pointer"
        />

        {/*---mobile menu modal---*/}
        <div
          className={`${menuModal ? "opacity-100 z-[100]" : "opacity-0 z-[-10] pointer-events-none"} fixed left-0 top-0 w-full h-screen bg-blue1 transition-all duration-[500ms]`}
        >
          {/*--- close button ---*/}
          <div className="pr-[10px] xs:pr-[21px] pt-[10px] transition-all duration-[800ms] w-full flex justify-end cursor-pointer">
            <PiX
              size={44}
              onClick={async () => {
                setMenuModal(false);
                document.body.classList.remove("halfHideScrollbar");
              }}
            />
          </div>
          {/*--- menu contents ---*/}
          <div className="font-medium text-2xl px-[9%] pt-[6%] pb-[48px] w-full flex flex-col items-start relative space-y-[44px]">
            {navLinks.map((i) => (
              <Link key={i.text} href={i.route} className="desktop:hover:underline decoration-[2px] underline-offset-[8px] cursor-pointer">
                {i.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
