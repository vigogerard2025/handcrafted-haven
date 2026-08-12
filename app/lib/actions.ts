"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { sql } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const RegisterSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  businessName: z.string().optional(),
  email: z.string().email("Invalid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
  role: z.enum(["buyer", "seller"]),
});

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    businessName: formData.get("businessName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }
  const { name, businessName, email, password, confirmPassword, role } =
    parsed.data;

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return "An account with that email already exists.";
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const bio = role === "seller" && businessName ? businessName : null;

    await sql`
      INSERT INTO users (name, email, password, role, bio)
      VALUES (${name}, ${email}, ${passwordHash}, ${role}, ${bio})
    `;
  } catch (error) {
    console.error(error);
    return "Something went wrong creating your account.";
  }

  await signIn("credentials", { email, password, redirectTo: "/" });
}
