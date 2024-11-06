"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { setUserAddressCookieAction } from "@/actions";
import { getCookie } from "cookies-next";

export default function DetectUserAddress() {
  const { address } = useAccount();
  const userAddressFromCookie = getCookie("userAddress");

  console.log("/ DetectUserAddress.tsx address", address);

  useEffect(() => {
    console.log("DetectUserAddress.tsx useEffect");
    if (address && address != userAddressFromCookie) {
      setUserAddressCookieAction(address);
    }
  }, [address]);
  return <></>;
}
