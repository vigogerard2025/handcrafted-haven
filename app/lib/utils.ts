const CATEGORY_IMAGES: Record<string, string> = {
  Pottery: "/images/category-pottery.svg",
  Textiles: "/images/category-textiles.svg",
  Jewelry: "/images/category-jewelry.svg",
  Woodwork: "/images/category-woodwork.svg",
  "Home Decor": "/images/category-decor.svg",
  Art: "/images/category-art.svg",
};

export function getProductImage(category: string, imageUrl?: string | null) {
  if (imageUrl) return imageUrl;
  return CATEGORY_IMAGES[category] || "/images/category-art.svg";
}
