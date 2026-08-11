import Link from "next/link";
import Image from "next/image";
import { sql } from "@/app/lib/db";
import { getProductImage } from "@/app/lib/utils";

async function getProducts(category?: string, search?: string) {
  try {
    if (category && search) {
      return await sql`
        SELECT p.*, u.name AS seller_name,
          COALESCE(AVG(r.rating), 0) AS avg_rating,
          COUNT(r.id) AS review_count
        FROM products p
        JOIN users u ON u.id = p.seller_id
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE p.category = ${category} AND p.name ILIKE ${"%" + search + "%"}
        GROUP BY p.id, u.name
        ORDER BY p.created_at DESC
      `;
    }
    if (category) {
      return await sql`
        SELECT p.*, u.name AS seller_name,
          COALESCE(AVG(r.rating), 0) AS avg_rating,
          COUNT(r.id) AS review_count
        FROM products p
        JOIN users u ON u.id = p.seller_id
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE p.category = ${category}
        GROUP BY p.id, u.name
        ORDER BY p.created_at DESC
      `;
    }
    if (search) {
      return await sql`
        SELECT p.*, u.name AS seller_name,
          COALESCE(AVG(r.rating), 0) AS avg_rating,
          COUNT(r.id) AS review_count
        FROM products p
        JOIN users u ON u.id = p.seller_id
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE p.name ILIKE ${"%" + search + "%"}
        GROUP BY p.id, u.name
        ORDER BY p.created_at DESC
      `;
    }
    return await sql`
      SELECT p.*, u.name AS seller_name,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM products p
      JOIN users u ON u.id = p.seller_id
      LEFT JOIN reviews r ON r.product_id = p.id
      GROUP BY p.id, u.name
      ORDER BY p.created_at DESC
    `;
  } catch {
    return [];
  }
}

const categories = [
  "Pottery",
  "Textiles",
  "Woodwork",
  "Jewelry",
  "Home Decor",
  "Art",
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  const products = await getProducts(category, search);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <p className="uppercase tracking-[0.2em] text-xs text-[#254441] font-semibold mb-2">
        Our collection
      </p>
      <h1 className="text-4xl font-semibold mb-2">Handmade products</h1>
      <p className="text-gray-600 mb-8 max-w-xl">
        Explore unique handcrafted pieces created by independent artisans. Each
        product represents creativity, skill, and meaningful craftsmanship.
      </p>

      {/* Búsqueda */}
      <form className="mb-6 flex gap-3" action="/products" method="get">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by product name, category, or artisan..."
          className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#254441]"
        />
        <button className="bg-[#254441] text-white px-5 py-2 rounded-md hover:bg-[#1a312e]">
          Search
        </button>
      </form>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/products"
          className={`px-4 py-1.5 rounded-full text-sm border ${
            !category
              ? "bg-[#254441] text-white border-[#254441]"
              : "border-gray-300 hover:border-[#254441]"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/products?category=${encodeURIComponent(c)}`}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              category === c
                ? "bg-[#254441] text-white border-[#254441]"
                : "border-gray-300 hover:border-[#254441]"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-8">
        Showing {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      {products.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center text-gray-500">
          No products found. Try a different category or search term, or visit{" "}
          <code className="bg-white px-1 rounded">/seed</code> to load sample
          data.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="aspect-[4/3] bg-[#F1E7D6] relative overflow-hidden">
                <Image
                  src={getProductImage(p.category, p.image_url)}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#254441] font-medium mb-1">
                  {p.category}
                </p>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500 mt-1">By {p.seller_name}</p>
                <p className="font-semibold mt-2">${p.price}</p>
                {Number(p.review_count) > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    ★ {Number(p.avg_rating).toFixed(1)} ({p.review_count} review
                    {p.review_count !== "1" ? "s" : ""})
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
