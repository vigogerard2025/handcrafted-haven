import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testConnection() {
  if (!process.env.POSTGRES_URL) {
    console.error("❌ No se encontró POSTGRES_URL en .env.local");
    process.exit(1);
  }

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const result =
      await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log("✅ Conexión exitosa a Neon");
    console.log("Hora del servidor:", result[0].current_time);
    console.log("Versión de Postgres:", result[0].pg_version);
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
  }
}

testConnection();
