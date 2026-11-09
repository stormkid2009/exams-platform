import { z } from "zod";

/**
 * Builds the Zod schema for one multiple-choice option.
 *
 * @param option - The option identifier (e.g. "a", "b").
 * @returns A Zod string schema that requires a non-empty value.
 */
export const createOptionSchema = (option: string) =>
  z.string().min(1, `Option ${option.toUpperCase()} cannot be empty`);
