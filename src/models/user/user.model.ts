import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUserModel } from "src/types/auth";

/**
 * userSchema
 * 
 * This schema defines the structure of a user document in the MongoDB database.
 * It includes fields for the user's email, password, and the date of account creation.
 * 
 * Fields:
 * - email (string): The user's email address. This field is required, must be unique, 
 *   trimmed, and converted to lowercase.
 * - password (string): The user's password. This field is required.
 * - createdAt (Date): The date when the user account was created. Defaults to the current date.
 * 
 * The schema includes a pre-save hook to hash the password before saving it to the database, 
 * ensuring that passwords are stored securely.
 */

/**
 * User Model
 * 
 * This model represents the User in the MongoDB database.
 * It is created using the userSchema and is exported for use in the application.
 * 
 * The model ensures that we do not redefine it if it has already been declared in the 
 * mongoose models.
 */
const MODEL_NAME = "User";
const userSchema: Schema<IUserModel> = new Schema({
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

export const User = 
mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, userSchema);
