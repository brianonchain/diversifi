// next
import { unstable_cache } from "next/cache";
// db
import VaultModel, { Vault } from "@/db/VaultModel";
import dbConnect from "@/db/dbConnect";

const getCachedVaultDetails = unstable_cache(async (vaultId) => getVaultDetails(vaultId), ["vaultDetails"]);

async function getVaultDetails(vaultId: string) {
  await dbConnect();
  const vaultTitle = vaultId.replaceAll("_", " ");
  const result = await VaultModel.findOne({ "vaults.title": vaultTitle }, { vaults: { $elemMatch: { title: vaultTitle } } });
  const vaultDetails = result.vaults[0];
  return vaultDetails;
}

export default async function VaultDetails({ vaultId }: { vaultId: string }) {
  // time
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // get vaultDetails
  const vaultDetails = await getCachedVaultDetails(vaultId);

  console.log("\nVaultDetails.tsx", time, "\nvaultId", vaultId, "\nvaultDetails.title:", vaultDetails.title);

  return (
    <>
      {/*--- title ---*/}
      <div className="pb-[16px] lg:py-[16px] font-bold text-xl">{vaultDetails?.title}</div>
      {/*---description---*/}
      <div className="flex-1 flex flex-col justify-center text-base">
        {vaultDetails?.text.map((i: string, index: number) => (
          <p key={index}>{i}</p>
        ))}
      </div>
    </>
  );
}
