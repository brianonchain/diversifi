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
      route: "/",
    },
    {
      id: "vaults",
      title: "Vaults",
      route: "/vaults",
    },
  ];

  return (
    <div className="h-[64px] xs:h-[52px] border-b border-gray-300 p-2 xs:px-4 w-full flex items-center justify-between">
      {/*---logo---*/}
      <div className="w-[76px] xs:w-[120px] h-full relative">
        <Image src="/logo.svg" alt="navLogo" fill />
      </div>
      {/*---DESKTOP menu links---*/}
      <div className="hidden md:flex space-x-4 lg:space-x-12">
        {navLinks.map((i, index) => (
          <div className="text-slate-800 text-lg font-semibold text-center cursor-pointer hover:text-blue-500" onClick={() => router.push(`${i.route}`)} key={index}>
            {i.title}
          </div>
        ))}
      </div>
      {/*---connect button---*/}
      <div className="flex mr-2 xs:mr-0 xs:space-x-2">
        <div className="hidden xs:block">
          <w3m-network-button />
        </div>
        <w3m-button balance="hide" />
      </div>
      {/*---MOBILE ONLY---*/}
      <div className="flex items-center justify-end md:hidden mr-2">
        {/*---need to wrap icon and menu into 1 div, for useRef---*/}
        <div ref={ref}>
          {/*---animated menu open/close icon ---*/}
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative h-[36px] w-[36px]">
            <div className={`${isMenuOpen ? "rotate-45 top-[16px] scale-110" : "top-[4px]"} absolute bg-black h-[3px] w-[36px] rounded transition-all duration-500`}></div>
            <div className={`${isMenuOpen ? "hidden" : ""} absolute bg-black h-[3px] w-[36px] rounded top-[16px] transition-all duration-500`}></div>
            <div className={`${isMenuOpen ? "-rotate-45 top-[16px] scale-110" : "top-[28px]"} absolute bg-black h-[3px] w-[36px] rounded transition-all duration-500`}></div>
          </div>
          {/*---menu contents---*/}
          <div
            className={`${
              isMenuOpen ? "right-[-2px]" : " right-[-220px]"
            } pl-9 py-10 absolute top-[70px] w-[200px] rounded-tl-2xl rounded-bl-2xl border-2 border-gray-200 bg-white duration-500 z-50`}
          >
            <div className="flex flex-col relative space-y-10">
              {navLinks.map((i, index) => (
                <div
                  id={i.id}
                  key={index}
                  onClick={() => {
                    router.push(`${i.route}`);
                    setIsMenuOpen(false);
                  }}
                  className="font-medium text-slate-700 text-2xl active:text-blue-500"
                >
                  {i.title}
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
