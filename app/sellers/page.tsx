import { sql } from "@/app/lib/db";

async function getSellers() {
  try {
    return await sql`
      SELECT u.id, u.name, u.bio, COUNT(p.id) AS product_count
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
      <h1 className="text-4xl font-semibold mb-2">Our Artisans</h1>
      <p className="text-gray-600 mb-10 max-w-xl">
        Meet the independent creators behind every handcrafted piece.
      </p>

      {sellers.length === 0 ? (
        <p className="text-gray-500">
          No artisans yet. Visit{" "}
          <code className="bg-gray-100 px-1 rounded">/seed</code> to load sample
          data.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {sellers.map((s: any) => (
            <div
              key={s.id}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="w-12 h-12 rounded-full bg-[#254441] text-white flex items-center justify-center font-semibold text-lg mb-4">
                {s.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-lg">{s.name}</h3>
              <p className="text-gray-600 text-sm mt-2">
                {s.bio || "Independent artisan at Handcrafted Haven."}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                {s.product_count} product{s.product_count !== "1" ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
