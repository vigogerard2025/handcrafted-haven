import Link from "next/link";
import { sql } from "@/app/lib/db";

async function getSellers() {
  try {
    return await sql`
      SELECT
        u.id,
        u.name,
        u.bio,
        COUNT(p.id) AS product_count,
        MODE() WITHIN GROUP (ORDER BY p.category) AS specialty
      FROM users u
      LEFT JOIN products p ON p.seller_id = u.id
      WHERE u.role = 'seller'
      GROUP BY u.id
      ORDER BY u.name
    `;
  } catch {
    return [];
  }
}

export default async function SellersPage() {
  const sellers = await getSellers();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-[#B5563C] font-semibold mb-2">
            Meet the makers
          </p>
          <h1 className="text-5xl font-bold tracking-tight">Our artisans</h1>
        </div>
        <p className="text-gray-600 max-w-sm">
          Learn about the creators behind every handcrafted piece — discover
          their stories, skills, and the traditions they carry forward.
        </p>
      </div>

      {sellers.length === 0 ? (
        <p className="text-gray-500">
          No artisans yet. Visit{" "}
          <code className="bg-gray-100 px-1 rounded">/seed</code> to load sample
          data.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {sellers.map((s: any) => (
            <Link
              key={s.id}
              href={`/sellers/${s.id}`}
              className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-3 leading-tight">
                {s.name}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">
                {s.bio || "Independent artisan at Handcrafted Haven."}
              </p>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm">
                  <span className="font-semibold">Specialty:</span>{" "}
                  <span className="text-gray-600">
                    {s.specialty || "Handmade goods"}
                  </span>
                </p>
                <p className="text-sm font-semibold text-[#254441] mt-4 group-hover:underline">
                  View artisan profile →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
