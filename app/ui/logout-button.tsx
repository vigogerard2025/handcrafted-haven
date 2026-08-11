"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-gray-700 hover:text-[#254441] transition-colors"
    >
      Sign out
    </button>
  );
}
