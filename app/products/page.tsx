import Link from "next/link";
import Image from "next/image";
import { sql } from "@/app/lib/db";
import { getProductImage } from "@/app/lib/utils";

type SearchParams = {
  category?: string;
  search?: string;
  min?: string;
  max?: string;
  sort?: string;
};

async function getProducts(params: SearchParams) {
  const { category, search, min, max, sort } = params;

  const conditions: string[] = [];
  const values: any[] = [];

  let query = `
    SELECT p.*, u.name AS seller_name,
      COALESCE(AVG(r.rating), 0) AS avg_rating,
      COUNT(r.id) AS review_count
    FROM products p
    JOIN users u ON u.id = p.seller_id
    LEFT JOIN reviews r ON r.product_id = p.id
  `;

  if (category) {
    values.push(category);
    conditions.push(`p.category = $${values.length}`);
  }
  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(p.name ILIKE $${values.length} OR u.name ILIKE $${values.length} OR p.category ILIKE $${values.length})`,
    );
  }
  if (min) {
    values.push(Number(min));
    conditions.push(`p.price >= $${values.length}`);
  }
  if (max) {
    values.push(Number(max));
    conditions.push(`p.price <= $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` GROUP BY p.id, u.name`;

  switch (sort) {
    case "price-asc":
      query += ` ORDER BY p.price ASC`;
      break;
    case "price-desc":
      query += ` ORDER BY p.price DESC`;
      break;
    case "name-asc":
      query += ` ORDER BY p.name ASC`;
      break;
    case "name-desc":
      query += ` ORDER BY p.name DESC`;
      break;
    default:
      query += ` ORDER BY p.created_at DESC`;
  }

  try {
    return await sql.query(query, values);
  } catch (err) {
    console.error(err);
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
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { category, search, min, max, sort } = params;
  const products = await getProducts(params);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <p className="uppercase tracking-[0.2em] text-xs text-[#254441] font-semibold mb-2">
        Our collection
      </p>
      <h1 className="text-4xl font-semibold mb-2">Handmade products</h1>
      <p className="text-gray-600 mb-10 max-w-xl">
        Explore unique handcrafted pieces created by independent artisans. Each
        product represents creativity, skill, and meaningful craftsmanship.
      </p>

      {/* Panel de filtros */}
      <form
        action="/products"
        method="get"
        className="bg-white border border-gray-200 rounded-xl p-6 mb-10"
      >
        <h2 className="font-semibold mb-5">Browse the collection</h2>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search products
            </label>
            <input
              id="search"
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by product name, artisan, or category..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#254441]"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category || ""}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-5">
          <div>
            <label htmlFor="min" className="block text-sm font-medium mb-1">
              Minimum price
            </label>
            <input
              id="min"
              type="number"
              name="min"
              min="0"
              step="0.01"
              defaultValue={min}
              placeholder="$0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#254441]"
            />
          </div>
          <div>
            <label htmlFor="max" className="block text-sm font-medium mb-1">
              Maximum price
            </label>
            <input
              id="max"
              type="number"
              name="max"
              min="0"
              step="0.01"
              defaultValue={max}
              placeholder="No limit"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#254441]"
            />
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium mb-1">
              Sort by
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort || "featured"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-[#254441] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[#1a312e] transition-colors"
          >
            Apply filters
          </button>
          <Link
            href="/products"
            className="border border-gray-300 px-5 py-2 rounded-md text-sm font-medium hover:border-[#254441] transition-colors"
          >
            Reset filters
          </Link>
        </div>
      </form>

      <p className="text-sm text-gray-500 mb-6">
        Showing {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      {products.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center text-gray-500">
          No products found. Try adjusting your filters, or visit{" "}
          <code className="bg-white px-1 rounded">/seed</code> to load sample
          data.
        </div>
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
                <h3 className="font-semibold group-hover:text-[#254441] transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">By {p.seller_name}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-semibold">${p.price}</p>
                  {Number(p.review_count) > 0 && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-[#C9962B]">★</span>
                      {Number(p.avg_rating).toFixed(1)}
                      <span className="text-gray-400">({p.review_count})</span>
                    </p>
                  )}
                </div>
                <p className="text-xs text-[#254441] font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  View product details →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
