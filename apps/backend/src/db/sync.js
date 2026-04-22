const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function main() {
    console.log("Connecting to Supabase...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS hero_leads (
                id SERIAL PRIMARY KEY,
                form_type TEXT NOT NULL,
                selected_option TEXT NOT NULL,
                payload JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log("✅ Table 'hero_leads' verified/created successfully.");
        
        // Also ensure analytics_events exists just in case
        await sql`
            CREATE TABLE IF NOT EXISTS analytics_events (
                id SERIAL PRIMARY KEY,
                event_type TEXT NOT NULL,
                page_url TEXT,
                cta_id TEXT,
                payload JSONB,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log("✅ Table 'analytics_events' verified/created successfully.");
        
    } catch (err) {
        console.error("❌ Database Error:", err);
    } finally {
        await sql.end();
        process.exit(0);
    }
}

main();
