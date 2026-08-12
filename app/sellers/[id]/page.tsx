import Link from "next/link";
import Image from "next/image";
import { sql } from "@/app/lib/db";
import { notFound } from "next/navigation";
import { getProductImage } from "@/app/lib/utils";

async function getSeller(id: string) {
  try {
    const [seller] = await sql`
      SELECT id, name, bio, email FROM users WHERE id = ${id} AND role = 'seller'
    `;
    if (!seller) return null;

    const products = await sql`
      SELECT p.*,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM products p
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE p.seller_id = ${id}
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    const [{ specialty }] = await sql`
      SELECT MODE() WITHIN GROUP (ORDER BY category) AS specialty
      FROM products WHERE seller_id = ${id}
    `;

    return { seller, products, specialty };
  } catch {
    return null;
  }
}

export default async function SellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSeller(id);
  if (!data) return notFound();

  const { seller, products, specialty } = data;

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <Link
        href="/sellers"
        className="text-sm text-gray-500 hover:text-[#254441]"
      >
        ← Back to artisans
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-center mt-8 mb-20">
        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/images/artisan-workshop.svg"
            alt={`${seller.name} at work`}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-[#B5563C] font-semibold mb-2">
            Artisan profile
          </p>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-5">
            {seller.name}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {seller.bio || "Independent artisan at Handcrafted Haven."}
          </p>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <p className="font-semibold text-sm">Craftsmanship:</p>
              <p className="text-gray-600 text-sm">
                {specialty || "Handmade goods"}
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Products:</p>
              <p className="text-gray-600 text-sm">
                View this artisan&apos;s handcrafted collection (
                {products.length}
                ).
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Contact:</p>
              <a
                href={`mailto:${seller.email}`}
                className="text-[#254441] text-sm font-semibold underline underline-offset-2"
              >
                Contact this artisan
              </a>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        Products by {seller.name.split(" ")[0]}
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">
          This artisan hasn&apos;t published any products yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="aspect-[4/3] bg-[#F1E7D6] relative overflow-hidden">
                <Image
                  src={getProductImage(p.category, p.image_url)}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#254441] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {p.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-semibold">${p.price}</p>
                  {Number(p.review_count) > 0 && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-[#C9962B]">★</span>
                      {Number(p.avg_rating).toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
