"use client";
import { useState } from "react";
import { Vault } from "@/db/UserModel";
import { revalidatePath } from "next/cache";
import { useRouter, useSearchParams } from "next/navigation";
// actions
import { changeColor } from "@/actions/actions";
// redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { selectVault } from "@/state/selectVaultSlice"; // import action
// zustand
import { useCounterStore } from "@/store";

export default function SelectVault({ userVaultsString }: { userVaultsString: string }) {
  const userVaults: Vault[] = JSON.parse(userVaultsString);

  const searchParams = useSearchParams();

  const selectedVaultIndex = useSelector((state: RootState) => state.selectedVaultIndex);
  const dispatch = useDispatch();

  const router = useRouter();
  const vaultIndex = searchParams.get("vaultIndex");
  console.log("client vaultIndex", vaultIndex);

  const colors = ["red", "green", "orange"];

  // zustand
  const counter = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  return (
    <div className="mt-10 mb-10 lg:mb-0 border border-slate-500 rounded-xl overflow-hidden">
      <div>count:{counter}</div>
      <div>selectedVault:{selectedVaultIndex}</div>
      {userVaults.map((i, index) => (
        <div
          id={i.id}
          key={index}
          onClick={async () => {
            dispatch(selectVault(index));
            await changeColor(colors[index]);
            router.push(`/?vaultIndex=${index}`);
            increment();
          }}
          className={`${selectedVaultIndex === index ? "bg-button1" : ""} ${
            index === userVaults.length - 1 ? "" : "border-b"
          } h-[52px] font-bold flex items-center px-4 hover:bg-blue4 border-slate-500 transition-color duration-300 cursor-pointer`}
        >
          {i.title}
        </div>
      ))}
    </div>
  );
}
