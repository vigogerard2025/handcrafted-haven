"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/app/lib/actions";
import Link from "next/link";

function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full bg-[#254441] text-white py-3 rounded-full font-medium hover:bg-[#1a312e] transition-colors disabled:opacity-50"
    >
      {pending ? "Creating account..." : "Create seller account"}
    </button>
  );
}

export default function RegisterPage() {
  const [errorMessage, formAction] = useActionState(register, undefined);
  const [role, setRole] = useState<"buyer" | "seller">("seller");

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <p className="uppercase tracking-[0.2em] text-xs text-[#B5563C] font-semibold mb-2 text-center">
          Join our community
        </p>
        <h1 className="text-4xl font-bold text-center leading-tight mb-3">
          Create your account
        </h1>
        <p className="text-gray-600 text-sm text-center mb-8">
          Become part of Handcrafted Haven to discover unique handmade products,
          support talented artisans, and manage your own collection.
        </p>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="role" value={role} />

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#254441]"
            />
          </div>

          {role === "seller" && (
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium mb-1"
              >
                Artisan business name
              </label>
              <input
                id="businessName"
                name="businessName"
                placeholder="Enter your studio or business name"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#254441]"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#254441]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#254441]"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="Enter the same password again"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#254441]"
            />
          </div>

          <div className="flex gap-4 text-sm pt-1">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={role === "buyer"}
                onChange={() => setRole("buyer")}
              />
              Buyer
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={role === "seller"}
                onChange={() => setRole("seller")}
              />
              Artisan / Seller
            </label>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm" role="alert">
              {errorMessage}
            </p>
          )}

          <RegisterButton />
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Do not have an account?{" "}
          <Link href="/register" className="text-[#254441] underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
