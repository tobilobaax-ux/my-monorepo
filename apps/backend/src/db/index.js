require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const schema = require('./schema');

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is missing in .env. Drizzle will not connect to Supabase.");
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

module.exports = db;
