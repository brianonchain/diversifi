// Load environment variables first using require (works with ES modules)
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Debug the environment loading
const envPath = path.resolve("../frontend/.env.local");
console.log("🔍 Looking for .env.local at:", envPath);
console.log("📁 File exists:", fs.existsSync(envPath));

const result = dotenv.config({ path: "../frontend/.env.local" });
console.log("🔧 Dotenv result:", result);
console.log("🔑 MONGO_URI loaded:", !!process.env.MONGO_URI);
console.log(
  "🔑 All MONGO vars:",
  Object.keys(process.env).filter((k) => k.includes("MONGO"))
);

// Now we can safely import the database modules
const dbConnect = require("../frontend/src/db/dbConnect").default;
const VaultModel = require("../frontend/src/db/VaultModel").default;

async function run() {
  await dbConnect();

  await VaultModel.create({
    chain: "Ethereum Sepolia",
    vaults: [
      {
        title: "Ethereum Sepolia Stablecoin Vault",
        text: [
          "To test the vault:",
          "1. Get USDC (Ethereum Sepolia) from Circle's faucet",
          "2. Connect your wallet",
          "3. Select Ethereum Sepolia (left menu)",
          "4. Enter USDC amount and click Deposit",
          "5. Withdraw your USDC",
        ],
      },
    ],
  });

  console.log("✅ Vault created successfully!");
}

run().catch(console.error);
