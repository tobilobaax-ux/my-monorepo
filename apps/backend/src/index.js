require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("./db");
const { heroLeads, analyticsEvents } = require("./db/schema");
const { sql } = require("drizzle-orm");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// --- CRITICAL AUTH GATEWAY ---
app.post("/api/v1/auth/verify", (req, res) => {
  console.log(`[AUTH] Handshake received at ${new Date().toISOString()}`);
  const { passcode } = req.body;
  const correctPasscode = process.env.DASHBOARD_PASSCODE || "admin123";

  if (passcode === correctPasscode) {
    console.log(`[AUTH] PASSED`);
    res.status(200).json({ success: true });
  } else {
    console.log(`[AUTH] FAILED: Invalid key detected`);
    res.status(401).json({ success: false, error: "Invalid passcode" });
  }
});

// System Health Check
app.get("/health", (req, res) => {
  res.json({ status: "operational", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const { createHeroLead } = require("./services/leadService");

// Hero Lead Capture Endpoint (Aligned with Requirement 3.0)
app.post("/api/v1/hero/lead", async (req, res) => {
  try {
    const { formType, selectedOption, payload } = req.body;
    if (!formType || !selectedOption || !payload) {
      return res.status(400).json({ error: "Missing required lead fields" });
    }
    
    // XSS Sanitization
    const sanitizedPayload = {};
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        sanitizedPayload[key] = payload[key].replace(/<[^>]*>?/gm, '').trim();
      } else {
        sanitizedPayload[key] = payload[key];
      }
    });

    // Server-side validation (Email)
    if (sanitizedPayload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedPayload.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const newLead = await createHeroLead({ 
      formType, 
      selectedOption, 
      payload: sanitizedPayload 
    });

    // Mock Email Integration (Requirement 3.0)
    console.log(`[EMAIL] To: admin@example.com | Subject: New hero lead received | Body: New lead from ${sanitizedPayload.email || 'anonymous'}`);

    res.status(201).json({ success: true, id: newLead.id });
  } catch (err) {
    console.error('[DB ERROR]', err);
    res.status(500).json({ error: "Supabase connection error" });
  }
});

// Simple Rate Limiter for Analytics (Section 7. SECURE)
const rateLimitMap = new Map();
const ANALYTICS_LIMIT = 50; // events per minute
const RATE_LIMIT_WINDOW = 60000;

const analyticsRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'];
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, firstEvent: now });
    return next();
  }

  const data = rateLimitMap.get(ip);
  if (now - data.firstEvent > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, firstEvent: now });
    return next();
  }

  if (data.count >= ANALYTICS_LIMIT) {
    return res.status(429).json({ error: "Too many analytics events" });
  }

  data.count++;
  next();
};

// Main Analytics Event Ingestion (Section 3. BUILD)
app.post("/api/v1/analytics/events", analyticsRateLimiter, async (req, res) => {
  if (process.env.ANALYTICS_TRACKING_ENABLED === "false") return res.status(200).json({ skipped: true });
  
  try {
    const { event_type, page_url, cta_id, session_id, user_agent, payload } = req.body;
    
    await db.insert(analyticsEvents).values({
      eventType: event_type,
      pageUrl: page_url,
      ctaId: cta_id,
      sessionId: session_id,
      userAgent: user_agent,
      payload: payload
    });
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Analytics Ingestion Error:', err);
    res.status(500).json({ error: "Failed to log event" });
  }
});

const { 
  getAnalyticsSummary, 
  getPageViewMetrics, 
  getCTAClickMetrics 
} = require("./services/analyticsService");

// Admin Analytics Summary
// Analytics Summary Cache (Section 3. BUILD -> Performance)
let summaryCache = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 60000; // 1 minute

app.get("/api/v1/admin/analytics/summary", async (req, res) => {
  const adminPasscode = req.headers["x-admin-passcode"];
  if (adminPasscode !== (process.env.DASHBOARD_PASSCODE || "admin123")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const now = Date.now();
  if (summaryCache && (now - lastCacheUpdate < CACHE_TTL)) {
    return res.json({ ...summaryCache, cached: true });
  }

  try {
    const summary = await getAnalyticsSummary();
    summaryCache = summary;
    lastCacheUpdate = now;
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics summary" });
  }
});

// Admin Analytics Pageviews
app.get("/api/v1/admin/analytics/pageviews", async (req, res) => {
  const adminPasscode = req.headers["x-admin-passcode"];
  if (adminPasscode !== (process.env.DASHBOARD_PASSCODE || "admin123")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const metrics = await getPageViewMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pageview metrics" });
  }
});

// Admin Analytics CTAs
app.get("/api/v1/admin/analytics/cta", async (req, res) => {
  const adminPasscode = req.headers["x-admin-passcode"];
  if (adminPasscode !== (process.env.DASHBOARD_PASSCODE || "admin123")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const metrics = await getCTAClickMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch CTA metrics" });
  }
});

// Original Stats Endpoint (Legacy support)
app.get("/api/v1/admin/stats", async (req, res) => {
  const adminPasscode = req.headers["x-admin-passcode"];
  if (adminPasscode !== (process.env.DASHBOARD_PASSCODE || "admin123")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const summary = await getAnalyticsSummary();
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Supabase Production Backend running on port ${PORT}`);
  });
}

module.exports = app;
