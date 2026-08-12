import Link from "next/link";
import Image from "next/image";
import { sql } from "@/app/lib/db";
import { getProductImage } from "@/app/lib/utils";

const categories = [
  {
    name: "Ceramics",
    slug: "Pottery",
    blurb: "Hand-thrown pottery and ceramic pieces for everyday living.",
    image: "/images/product-vase.svg",
  },
  {
    name: "Woven Goods",
    slug: "Textiles",
    blurb: "Handwoven textiles, scarves, and fiber creations.",
    image: "/images/product-scarf.svg",
  },
  {
    name: "Woodwork",
    slug: "Woodwork",
    blurb: "Reclaimed and sustainably sourced wooden pieces.",
    image: "/images/product-cutting-board.svg",
  },
];

async function getFeaturedProducts() {
  try {
    return await sql`
      SELECT p.*, u.name AS seller_name,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM products p
      JOIN users u ON u.id = p.seller_id
      LEFT JOIN reviews r ON r.product_id = p.id
      GROUP BY p.id, u.name
      ORDER BY p.created_at DESC
      LIMIT 3
    `;
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [row] = await sql`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'seller') AS artisan_count,
        (SELECT COUNT(*) FROM products) AS product_count,
        (SELECT COUNT(*) FROM reviews) AS review_count
    `;
    return row;
  } catch {
    return { artisan_count: 0, product_count: 0, review_count: 0 };
  }
}

export default async function Home() {
  const [products, stats] = await Promise.all([
    getFeaturedProducts(),
    getStats(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#F1E7D6] to-[#EAE0CC] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-[#254441] font-semibold mb-4">
              Made by hand. Chosen with heart.
            </p>
            <h1 className="text-5xl font-semibold leading-[1.08] text-[#1a2e2b]">
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
                className="bg-[#254441] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1a312e] transition-colors shadow-sm"
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
          <div className="relative">
            <div className="aspect-square rounded-2xl relative overflow-hidden shadow-xl rotate-2">
              <Image
                src="/images/product-vase.svg"
                alt="Handcrafted ceramic vase"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl overflow-hidden shadow-lg -rotate-6 border-4 border-white hidden sm:block">
              <Image
                src="/images/product-scarf.svg"
                alt="Handwoven scarf"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-[#254441]/10 bg-white/40 backdrop-blur-sm relative z-10">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-3 text-center gap-4">
            <div>
              <p className="text-2xl font-semibold text-[#254441]">
                {stats.artisan_count}+
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wide mt-1">
                Artisans
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#254441]">
                {stats.product_count}+
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wide mt-1">
                Handmade products
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#254441]">
                {stats.review_count}+
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wide mt-1">
                Customer reviews
              </p>
            </div>
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
            <Link
              key={cat.slug}
              href={`/products?category=${encodeURIComponent(cat.slug)}`}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-video relative bg-[#F1E7D6] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{cat.blurb}</p>
                <span className="text-[#254441] font-medium text-sm group-hover:underline">
                  Browse products in {cat.name} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
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
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-[#F1E7D6]">
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
                    <p className="text-sm text-gray-500 mt-1">
                      By {p.seller_name}
                    </p>
                    <div className="flex items-center justify-between mt-3">
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
        </div>
      </section>

      {/* Sobre los artesanos */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-video relative rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/images/product-table-runner.svg"
            alt="Artisan woven table runner"
            fill
            className="object-cover"
          />
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
          <ul className="space-y-3 text-gray-700 text-sm mb-6">
            <li className="flex gap-2">
              <span className="text-[#254441]">✓</span>
              Artisan profiles that highlight each maker&apos;s story and
              craftsmanship
            </li>
            <li className="flex gap-2">
              <span className="text-[#254441]">✓</span>
              Product details that explain materials, techniques, and creative
              processes
            </li>
            <li className="flex gap-2">
              <span className="text-[#254441]">✓</span>A welcoming marketplace
              designed for customers and creators
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
    </main>
  );
}
