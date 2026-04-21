require('dotenv').config();
const postgres = require('postgres');

async function testConnection() {
  console.log("🔍 Checking DATABASE_URL...");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL is missing in .env");
    return;
  }

  const sql = postgres(process.env.DATABASE_URL, { ssl: 'allow' });

  try {
    console.log("📡 Attempting to connect to Supabase...");
    const result = await sql`SELECT 1 as connected`;
    console.log("✅ Success! Database is reachable.");
    console.log("Result:", result);
  } catch (err) {
    console.error("❌ Connection Failed!");
    console.error("Error Code:", err.code);
    console.error("Full Error:", err.message);
    
    if (err.message.includes("password authentication failed")) {
      console.log("💡 Tip: Check your database password in the .env file.");
    } else if (err.message.includes("timeout")) {
      console.log("💡 Tip: Check if you are using the correct port (6543) and project reference.");
    }
  } finally {
    await sql.end();
  }
}

testConnection();
