import { sql } from "@/app/lib/db";
import { notFound } from "next/navigation";
import ReviewForm from "@/app/ui/review-form";
import Image from "next/image";
import { getProductImage } from "@/app/lib/utils";

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
          <p className="text-xs text-[#254441] font-medium mb-1">
            {product.category}
          </p>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-xl font-semibold mt-2">${product.price}</p>
          {avgRating && (
            <p className="text-sm text-gray-600 mt-1">
              ★ {avgRating} out of 5 ({reviews.length} review
              {reviews.length !== 1 ? "s" : ""})
            </p>
          )}
          <p className="text-gray-700 mt-4">{product.description}</p>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">Sold by</p>
            <p className="font-semibold">{product.seller_name}</p>
            {product.seller_bio && (
              <p className="text-sm text-gray-600 mt-1">{product.seller_bio}</p>
            )}
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
