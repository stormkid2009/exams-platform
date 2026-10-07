import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { type AuthFormData } from "src/shared/schemas/auth.schema";

/**
 * IUserDocument interface representing User document fields and methods.
 */
export interface IUserDocument extends Document {
  email: string;
  password: string;
  createdAt: Date;
  userId: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const MODEL_NAME = "User";

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual getter for userId
userSchema.virtual("userId").get(function (this: IUserDocument) {
  return this._id.toString();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUserDocument> =
  mongoose.models[MODEL_NAME] || mongoose.model<IUserDocument>(MODEL_NAME, userSchema);

