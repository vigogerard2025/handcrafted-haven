import { sql } from "@/app/lib/db";
import { notFound } from "next/navigation";
import ReviewForm from "@/app/ui/review-form";
import Image from "next/image";
import { getProductImage } from "@/app/lib/utils";
import Link from "next/link";
async function getProduct(id: string) {
  try {
    const [product] = await sql`
      SELECT p.*, u.name AS seller_name, u.bio AS seller_bio
      FROM products p JOIN users u ON u.id = p.seller_id
      WHERE p.id = ${id}
    `;
    if (!product) return null;

    const reviews = await sql`
      SELECT r.*, u.name AS reviewer_name FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.product_id = ${id}
      ORDER BY r.created_at DESC
    `;
    return { product, reviews };
  } catch {
    return null;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProduct(id);
  if (!data) return notFound();

  const { product, reviews } = data;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-[#F1E7D6] rounded-xl relative overflow-hidden">
          <Image
            src={getProductImage(product.category, product.image_url)}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs text-[#254441] font-semibold uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            {" "}
            {product.name}
          </h1>
          <p className="text-gray-600 mt-4">{product.description}</p>

          <p className="text-sm text-gray-600 mt-4">
            Created by{" "}
            <Link
              href={`/sellers/${product.seller_id}`}
              className="font-semibold text-[#254441] underline underline-offset-2"
            >
              {product.seller_name}
            </Link>
          </p>

          <p className="text-2xl font-bold mt-4">${product.price}</p>

          {avgRating && (
            <p className="text-sm mt-2">
              <span className="text-[#C9962B]">
                {"★".repeat(Math.round(Number(avgRating)))}
                {"☆".repeat(5 - Math.round(Number(avgRating)))}
              </span>{" "}
              <span className="font-medium">{avgRating} out of 5</span>{" "}
              <span className="text-gray-500">
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <Link
              href={`/sellers/${product.seller_id}`}
              className="bg-[#254441] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a312e] transition-colors"
            >
              Meet the artisan
            </Link>
            <Link
              href="/products"
              className="border border-gray-300 px-5 py-2.5 rounded-full text-sm font-medium hover:border-[#254441] transition-colors"
            >
              Back to products
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Customer reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm mb-8">
            No reviews yet. Be the first!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {reviews.map((r: any) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#254441]">
                    {r.reviewer_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(r.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[#C9962B] mb-2">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}{" "}
                  <span className="text-gray-600">{r.rating} out of 5</span>
                </p>
                {r.comment && (
                  <p className="text-gray-700 text-sm">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <ReviewForm productId={product.id} />
      </section>
    </main>
  );
}
