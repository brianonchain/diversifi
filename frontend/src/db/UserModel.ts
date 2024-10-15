import mongoose, { Document, Schema } from "mongoose";

export type Vault = {
  id: string;
  title: string;
  principal: number;
  earned: number;
  performance: number; // in percentage
};

export interface IUser extends Document {
  user: string;
  userVaults: Vault[];
  chartData: any;
  vaultIndex: number;
  todos: string[];
}

const UserSchema: Schema = new Schema<IUser>({
  user: { type: String, unique: true },
  userVaults: [
    {
      id: String,
      title: String,
      principal: Number,
      earned: Number,
      performance: Number,
    },
  ],
  chartData: Object,
  vaultIndex: Number,
  todos: [String],
});

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
