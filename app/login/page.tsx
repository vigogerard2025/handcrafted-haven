"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/lib/actions";
import Link from "next/link";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full bg-[#254441] text-white py-2.5 rounded-md font-medium hover:bg-[#1a312e] transition-colors disabled:opacity-50"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);
  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <p className="uppercase tracking-[0.2em] text-xs text-[#254441] font-semibold mb-2">
        Welcome back
      </p>
      <h1 className="text-3xl font-semibold mb-2">Sign in</h1>
      <p className="text-gray-600 mb-8">
        Access your artisan profile and manage your handcrafted products.
      </p>

      <div className="bg-[#F1E7D6] rounded-md p-4 text-sm mb-6">
        <p className="font-semibold mb-1">Demonstration seller</p>
        <p>
          Email: <code>maria@example.com</code>
        </p>
        <p>
          Password: <code>123456</code>
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#254441]"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#254441]"
          />
        </div>

        {errorMessage && (
          <p className="text-red-600 text-sm" role="alert">
            {errorMessage}
          </p>
        )}

        <LoginButton />
      </form>

      <p className="text-sm text-gray-600 mt-6">
        Do not have an account?{" "}
        <Link href="/register" className="text-[#254441] underline">
          Create one
        </Link>
      </p>
    </main>
  );
}
