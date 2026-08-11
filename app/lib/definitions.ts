export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller";
  bio: string | null;
};

export type Product = {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  created_at: string;
};

export type ProductWithSeller = Product & {
  seller_name: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name: string;
};
