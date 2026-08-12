import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a2e2b] text-[#F1E7D6] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#F1E7D6] text-[#1a2e2b] flex items-center justify-center font-bold text-xs">
              HH
            </div>
            <span className="font-bold">Handcrafted Haven</span>
          </div>
          <p className="text-sm text-[#F1E7D6]/70 max-w-sm">
            A marketplace concept that celebrates handmade work, artisan
            stories, and creative communities.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:items-end text-sm">
          <Link
            href="/#categories"
            className="underline underline-offset-2 hover:text-white"
          >
            Categories
          </Link>
          <Link
            href="/#featured-products"
            className="underline underline-offset-2 hover:text-white"
          >
            Featured pieces
          </Link>
          <Link
            href="/sellers"
            className="underline underline-offset-2 hover:text-white"
          >
            Our artisans
          </Link>
        </div>
      </div>
      <div className="border-t border-[#F1E7D6]/10 py-4 text-center text-xs text-[#F1E7D6]/60">
        Handcrafted Haven · WDD 430 Individual Project
      </div>
    </footer>
  );
}
