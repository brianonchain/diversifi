// db
import VaultModel, { Vault } from "@/db/VaultModel";
import dbConnect from "@/db/dbConnect";
// components
import SelectVaultClient from "./SelectVaultClient";

export default async function SelectVaultServer({ vaultId }: { vaultId: string }) {
  // time
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;

  // chainState
  const chainState = vaultId.split("_")[0];

  // call db to get vaultTitles
  await dbConnect();
  const data = await VaultModel.findOne({ chain: chainState });
  const vaults = data.vaults;
  const vaultIds = vaults.map((i: any) => i.title.replaceAll(" ", "_"));

  console.log("\nSelectVaultServer.tsx", time, "\nvaultId:", vaultId, "\nvaultIds:", vaultIds);

  return <SelectVaultClient vaultIds={vaultIds} vaultId={vaultId} />;
}
