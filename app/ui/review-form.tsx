import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export default function ReviewForm({ productId }: { productId: number }) {
  async function submitReview(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;

    if (!name || !rating || !comment || comment.length < 10) return;

    const [user] = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${name.toLowerCase().replace(/\s+/g, ".") + "@guest.local"}, 'guest', 'buyer')
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;

    await sql`
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (${productId}, ${user.id}, ${rating}, ${comment})
    `;

    revalidatePath(`/products/${productId}`);
  }

  return (
    <div className="bg-[#F1E7D6] rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-1">
        Rate and review this product
      </h3>
      <p className="text-sm text-gray-600 mb-5">
        Anyone can leave a rating and written review. Your review appears
        immediately.
      </p>

      <form action={submitReview} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#254441]"
          />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium mb-1">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            defaultValue={5}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Star{n !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Your review
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={4}
            required
            minLength={10}
            maxLength={1000}
            placeholder="Share your experience with this product..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#254441]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter between 10 and 1,000 characters.
          </p>
        </div>
        <button className="bg-[#254441] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1a312e] transition-colors">
          Submit review
        </button>
      </form>
    </div>
  );
}
