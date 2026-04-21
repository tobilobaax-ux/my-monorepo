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

// Analytics Event Endpoint
app.post("/api/v1/analytics/events", async (req, res) => {
  try {
    const { eventType, pageUrl, ctaId, payload } = req.body;
    if (!eventType) return res.status(400).json({ error: "Event type required" });
    await db.insert(analyticsEvents).values({ eventType, pageUrl, ctaId, payload });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Supabase sync error" });
  }
});

const { 
  getAnalyticsSummary, 
  getPageViewMetrics, 
  getCTAClickMetrics 
} = require("./services/analyticsService");

// Admin Analytics Summary
app.get("/api/v1/admin/analytics/summary", async (req, res) => {
  const adminPasscode = req.headers["x-admin-passcode"];
  if (adminPasscode !== (process.env.DASHBOARD_PASSCODE || "admin123")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const summary = await getAnalyticsSummary();
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
