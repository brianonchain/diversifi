"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// wagmi
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useAccount, useWalletClient, useDisconnect, useAccountEffect } from "wagmi";
// images
import { FaCircle } from "react-icons/fa";
// types
import { NavLink } from "@/app/page";

const Navbar = ({ navLinks, page, setPage }: { navLinks: NavLink[]; page: string; setPage: any }) => {
  // state

  // hooks
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
    <div className="px-[8px] sm:px-[16px] w-full sm:h-[64px] flex flex-col items-center py-5 space-y-5 sm:py-0 sm:space-y-0">
      <div className="w-full h-full flex items-center justify-between">
        {/*---logo---*/}
        <Image src="/logo.svg" alt="navLogo" width={0} height={0} className="ml-[2px] mr-[12px] w-[100px] sm:w-[140px]" />
        {/*--- desktop menu links---*/}
        <div className="hidden sm:flex space-x-4 md:space-x-12">
          {navLinks.map((i, index) => (
            <div
              className={`${
                i.id == page ? "underline underline-offset-[5px] decoration-[2px]" : ""
              } text-lg font-semibold text-center cursor-pointer hover:underline underline-offset-[5px] decoration-[2px]`}
              onClick={() => setPage(i.id)}
              key={index}
            >
              {i.title}
            </div>
          ))}
        </div>
        {/*--- connect button---*/}
        {isConnected ? (
          <button className="buttonSecondary flex items-center" onClick={() => open({ view: "Account" })}>
            <FaCircle className="mr-2 text-green-500 w-[12px] h-[12px]" /> {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>
        ) : (
          <button className="buttonPrimary" onClick={() => open()}>
            Connect
          </button>
        )}
      </div>
      {/*--- mobile menu links---*/}
      <div className="sm:hidden flex space-x-[60px]">
        {navLinks.map((i, index) => (
          <div
            id={i.id}
            key={index}
            className={`text-lg font-semibold text-center cursor-pointer hover:text-blue-500`}
            onClick={() => setPage(i.id)}
          >
            {i.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
