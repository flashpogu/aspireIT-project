import mongoose from "mongoose";
import bcrypt from "bcryptjs";

type UserType = {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePic: string;
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: {
    type: String,
    required: false,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 9);
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
