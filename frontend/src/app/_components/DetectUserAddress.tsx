"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { setUserAddressCookieAction } from "@/actions";
import { getCookie } from "cookies-next";

export default function DetectUserAddress() {
  const { address } = useAccount();
  const userAddressFromCookie = getCookie("userAddress");

  useEffect(() => {
    if (!userAddressFromCookie && address) {
      setUserAddressCookieAction(address);
    }
  }, []);
  return <></>;
}
