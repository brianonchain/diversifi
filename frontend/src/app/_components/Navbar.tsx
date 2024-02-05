"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const checkClickedOutside = (e: React.MouseEvent) => {
        if (isMenuOpen && !ref.current?.contains(e.target as HTMLElement)) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener("click", () => checkClickedOutside);
    }
  }, [isMenuOpen]);

  const navLinks = [
    {
      id: "dashboard",
      title: "Dashboard",
    },
    {
      id: "vaults",
      title: "Vaults",
    },
  ];

  return (
    <div className="h-[52px] border-b border-gray-300 px-4 w-full flex items-center justify-between">
      {/*---logo---*/}
      <div className="w-[160px] h-full flex items-center">
        <div className="w-[120px] h-full relative">
          <Image src="/logo.svg" alt="navLogo" fill />
        </div>
      </div>
      {/*---menu links---*/}
      <div className="hidden md:flex space-x-4 lg:space-x-12">
        {navLinks.map((navLink, index) => (
          <div
            className="text-slate-800 text-lg font-semibold text-center cursor-pointer hover:text-blue-500"
            id={navLink.id}
            onClick={() => router.push(`${navLink.id}`)}
            key={index}
          >
            {navLink.title}
          </div>
        ))}
      </div>
      {/*---login + signup button---*/}
      <div className="flex space-x-2">
        <w3m-network-button />
        <w3m-button balance="hide" />
      </div>
      {/*---MOBILE ONLY---*/}
      <div className="flex items-center justify-end md:hidden mr-6">
        {/*---need to wrap icon and menu into 1 div, for useRef---*/}
        <div ref={ref} className="">
          {/*---animated menu open/close icon ---*/}
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative h-[36px] w-[36px]">
            <div className={`${isMenuOpen ? "rotate-45 top-[16px] scale-110" : "top-[4px]"} absolute bg-black h-[3px] w-[36px] rounded transition-all duration-500`}></div>
            <div className={`${isMenuOpen ? "hidden" : ""} absolute bg-black h-[3px] w-[36px] rounded top-[16px] transition-all duration-500`}></div>
            <div className={`${isMenuOpen ? "-rotate-45 top-[16px] scale-110" : "top-[28px]"} absolute bg-black h-[3px] w-[36px] rounded transition-all duration-500`}></div>
          </div>
          {/*---menu contents---*/}
          <div className={`${isMenuOpen ? "right-[-2px]" : " right-[-250px]"} pl-6 py-10 absolute top-[72px] w-[240px] duration-500`}>
            <div className="w-full h-full absolute bg-white opacity-95 backdrop-blur-md top-0 left-0 rounded-tl-2xl rounded-bl-2xl border"></div>
            <div className="flex flex-col z-50 relative space-y-10">
              {navLinks.map((navLink, index) => (
                <div
                  key={index}
                  id={navLink.id}
                  // onClick={handleOnNavClick}
                  className="font-medium text-slate-700 cursor-pointer text-2xl"
                >
                  {navLink.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
