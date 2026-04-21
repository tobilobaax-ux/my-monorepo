const { pgTable, serial, text, timestamp, jsonb } = require("drizzle-orm/pg-core");

const heroLeads = pgTable("hero_leads", {
  id: serial("id").primaryKey(),
  formType: text("form_type").notNull(),
  selectedOption: text("selected_option").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  pageUrl: text("page_url"),
  ctaId: text("cta_id"),
  sessionId: text("session_id"),
  userAgent: text("user_agent"),
  payload: jsonb("payload"),
  timestamp: timestamp("timestamp").defaultNow(),
});

module.exports = { heroLeads, analyticsEvents };
