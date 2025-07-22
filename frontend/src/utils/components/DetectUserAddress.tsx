"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { setUserAddressCookieAction } from "@/actions";

export default function DetectUserAddress({ userAddressFromCookies }: { userAddressFromCookies: string | undefined }) {
  const { address } = useAccount();

  console.log("/ DetectUserAddress.tsx address", address);

  useEffect(() => {
    console.log("DetectUserAddress.tsx useEffect");
    if (address != userAddressFromCookies) {
      console.log("setUserAddressCookieAction");
      setUserAddressCookieAction(address ?? "");
    }
  }, [address]);
  return <></>;
}
