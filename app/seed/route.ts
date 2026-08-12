import { sql } from "../lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(180) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'buyer',
      bio TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(160) NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      category VARCHAR(80) NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

async function seedUsers() {
  const password = await bcrypt.hash("123456", 10);

  const sellers = [
    {
      name: "Maria Lopez",
      email: "maria@example.com",
      bio: "Third-generation weaver preserving traditional patterns.",
    },
    {
      name: "James Carter",
      email: "james@example.com",
      bio: "Turning reclaimed wood into functional art for 15 years.",
    },
    {
      name: "Aiko Tanaka",
      email: "aiko@example.com",
      bio: "Blending Japanese minimalism with modern ceramics.",
    },
  ];

  for (const s of sellers) {
    await sql`
      INSERT INTO users (name, email, password, role, bio)
      VALUES (${s.name}, ${s.email}, ${password}, 'seller', ${s.bio})
      ON CONFLICT (email) DO NOTHING
    `;
  }

  await sql`
    INSERT INTO users (name, email, password, role)
    VALUES ('Test Buyer', 'buyer@example.com', ${password}, 'buyer')
    ON CONFLICT (email) DO NOTHING
  `;
}

async function seedProducts() {
  const [maria] =
    await sql`SELECT id FROM users WHERE email = 'maria@example.com'`;
  const [james] =
    await sql`SELECT id FROM users WHERE email = 'james@example.com'`;
  const [aiko] =
    await sql`SELECT id FROM users WHERE email = 'aiko@example.com'`;

  const products = [
    {
      seller: maria.id,
      name: "Handwoven Wool Scarf",
      description: "Soft, warm scarf woven on a traditional loom.",
      price: 45.0,
      category: "Textiles",
      image_url: "/images/product-scarf.svg",
    },
    {
      seller: james.id,
      name: "Reclaimed Oak Cutting Board",
      description: "Durable cutting board made from reclaimed oak.",
      price: 38.5,
      category: "Woodwork",
      image_url: "/images/product-cutting-board.svg",
    },
    {
      seller: aiko.id,
      name: "Minimalist Ceramic Vase",
      description: "Hand-thrown vase with a matte glaze finish.",
      price: 52.0,
      category: "Pottery",
      image_url: "/images/product-vase.svg",
    },
    {
      seller: maria.id,
      name: "Woven Table Runner",
      description: "Colorful table runner inspired by Andean patterns.",
      price: 29.0,
      category: "Textiles",
      image_url: "/images/product-table-runner.svg",
    },
  ];

  for (const p of products) {
    await sql`
      INSERT INTO products (seller_id, name, description, price, category, image_url)
      VALUES (${p.seller}, ${p.name}, ${p.description}, ${p.price}, ${p.category}, ${p.image_url})
    `;
  }
}
export async function GET() {
  try {
    await createTables();
    await seedUsers();
    await seedProducts();
    return NextResponse.json({
      message: "✅ Base de datos inicializada con datos de prueba",
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
