import Link from "next/link";
import { sql } from "@/app/lib/db";

const categories = [
  {
    name: "Ceramics",
    slug: "Pottery",
    blurb: "Handcrafted pottery and ceramic pieces for everyday living.",
  },
  {
    name: "Woven Goods",
    slug: "Textiles",
    blurb: "Handmade baskets, textiles, and fiber creations.",
  },
  {
    name: "Jewelry",
    slug: "Jewelry",
    blurb: "Unique artisan jewelry made with carefully selected materials.",
  },
];

async function getFeaturedProducts() {
  try {
    return await sql`
      SELECT p.*, u.name AS seller_name
      FROM products p JOIN users u ON u.id = p.seller_id
      ORDER BY p.created_at DESC
      LIMIT 3
    `;
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <main>
      {/* Hero */}
      <section className="bg-[#F1E7D6]">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-[#254441] font-semibold mb-4">
              Made by hand. Chosen with heart.
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[#1a2e2b]">
              Discover unique handcrafted treasures from talented artisans.
            </h1>
            <p className="text-lg text-gray-700 mt-6 max-w-md">
              Handcrafted Haven connects customers with creative makers who
              transform passion, skill, and sustainable materials into
              meaningful handmade products.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="bg-[#254441] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1a312e] transition-colors"
              >
                Browse products
              </Link>
              <Link
                href="/sellers"
                className="border border-[#254441] text-[#254441] px-6 py-3 rounded-md font-medium hover:bg-[#254441] hover:text-white transition-colors"
              >
                Meet our artisans
              </Link>
            </div>
          </div>
          <div className="aspect-square bg-white/50 rounded-2xl flex items-center justify-center border border-[#254441]/10">
            <span className="text-6xl">🧺</span>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section id="categories" className="max-w-6xl mx-auto px-6 py-20">
        <p className="uppercase tracking-[0.2em] text-xs text-[#254441] font-semibold mb-2">
          Explore collections
        </p>
        <h2 className="text-3xl font-semibold mb-2">Shop by category</h2>
        <p className="text-gray-600 mb-10 max-w-xl">
          Browse handcrafted products organized by craft type, materials, and
          creative tradition.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{cat.blurb}</p>
              <Link
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="text-[#254441] font-medium text-sm hover:underline"
              >
                Browse products in {cat.name} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Productos destacados (datos reales de Neon) */}
      <section id="featured-products" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="uppercase tracking-[0.2em] text-xs text-[#254441] font-semibold mb-2">
            Handpicked creations
          </p>
          <h2 className="text-3xl font-semibold mb-2">
            Featured handmade products
          </h2>
          <p className="text-gray-600 mb-10 max-w-xl">
            Discover unique items created by independent artisans, each with its
            own story, materials, and craftsmanship.
          </p>

          {products.length === 0 ? (
            <p className="text-gray-500">
              No products yet — visit{" "}
              <code className="bg-white px-1 rounded">/seed</code> to load
              sample data.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] bg-[#F1E7D6] flex items-center justify-center text-3xl">
                    🎨
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#254441] font-medium mb-1">
                      {p.category}
                    </p>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      By {p.seller_name}
                    </p>
                    <p className="font-semibold mt-2">${p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sobre los artesanos */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-video bg-[#F1E7D6] rounded-2xl flex items-center justify-center text-5xl">
          🧵
        </div>
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-[#254441] font-semibold mb-2">
            Meet the creators
          </p>
          <h2 className="text-3xl font-semibold mb-4">
            Every handcrafted piece has a story behind it.
          </h2>
          <p className="text-gray-600 mb-6">
            Handcrafted Haven gives artisans a place to share their creative
            journey, showcase their skills, and connect with customers who
            appreciate unique handmade products.
          </p>
          <ul className="space-y-2 text-gray-700 text-sm mb-6">
            <li>
              • Artisan profiles that highlight each maker&apos;s story and
              craftsmanship
            </li>
            <li>
              • Product details that explain materials, techniques, and creative
              processes
            </li>
            <li>
              • A welcoming marketplace designed for customers and creators
            </li>
          </ul>
          <Link
            href="/sellers"
            className="text-[#254441] font-medium hover:underline"
          >
            Explore our artisans →
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-10 text-center text-sm text-gray-500">
        Handcrafted Haven · WDD 430 Individual Project
      </footer>
    </main>
  );
}
