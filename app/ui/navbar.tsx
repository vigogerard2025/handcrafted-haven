import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-[#254441]">
          Handcrafted Haven
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-[#254441]">
            Home
          </Link>
          <Link href="/products" className="hover:text-[#254441]">
            Products
          </Link>
          <Link href="/sellers" className="hover:text-[#254441]">
            Artisans
          </Link>

          {session?.user ? (
            <>
              {(session.user as any).role === "seller" && (
                <Link href="/dashboard" className="hover:text-[#254441]">
                  Dashboard
                </Link>
              )}
              <span className="text-gray-500">
                Hi, {session.user.name?.split(" ")[0]}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="text-gray-700 hover:text-[#254441] cursor-pointer">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#254441]">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#254441] text-white px-4 py-2 rounded-md hover:bg-[#1a312e]"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
