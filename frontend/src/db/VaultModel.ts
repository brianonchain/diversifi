import mongoose, { Document, Schema } from "mongoose";

export type Vault = {
  title: string;
  text: string[];
};

export interface IVault extends Document {
  chain: string;
  vaults: Vault[];
}

const VaultSchema: Schema = new Schema<IVault>({
  chain: String,
  vaults: [{ title: { unique: true, type: String }, text: [String] }],
});

const VaultModel = mongoose.models.vault || mongoose.model<IVault>("vault", VaultSchema);

export default VaultModel;
