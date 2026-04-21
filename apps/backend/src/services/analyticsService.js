const db = require("../db");
const { analyticsEvents, heroLeads } = require("../db/schema");
const { sql, eq, like } = require("drizzle-orm");

/**
 * Gets a high-level summary of all platform metrics.
 */
async function getAnalyticsSummary() {
    const [leadsCount] = await db.select({ count: sql`count(*)` }).from(heroLeads);
    const [viewsCount] = await db.select({ count: sql`count(*)` }).from(analyticsEvents).where(sql`event_type = 'page_view'`);
    const [clicksCount] = await db.select({ count: sql`count(*)` }).from(analyticsEvents).where(sql`event_type LIKE 'cta_%'`);
    const [modalCount] = await db.select({ count: sql`count(*)` }).from(analyticsEvents).where(sql`event_type = 'modal_open'`);

    const views = Number(viewsCount.count);
    const clicks = Number(clicksCount.count);
    const opens = Number(modalCount.count);
    const leads = Number(leadsCount.count);

    return {
        totalLeads: leads,
        totalPageViews: views,
        totalCTAClicks: clicks,
        totalModalOpens: opens,
        conversionRate: views > 0 ? ((leads / views) * 100).toFixed(2) : 0,
        ctr: views > 0 ? ((clicks / views) * 100).toFixed(2) : 0,
        modalRate: clicks > 0 ? ((opens / clicks) * 100).toFixed(2) : 0
    };
}

/**
 * Gets page view metrics grouped by URL.
 */
async function getPageViewMetrics() {
    return await db.select({
        url: analyticsEvents.pageUrl,
        count: sql`count(*)`
    })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'page_view'))
    .groupBy(analyticsEvents.pageUrl)
    .orderBy(sql`count(*) DESC`);
}

/**
 * Gets CTA click metrics grouped by ID.
 */
async function getCTAClickMetrics() {
    return await db.select({
        ctaId: analyticsEvents.ctaId,
        count: sql`count(*)`
    })
    .from(analyticsEvents)
    .where(like(analyticsEvents.eventType, 'cta_%'))
    .groupBy(analyticsEvents.ctaId)
    .orderBy(sql`count(*) DESC`);
}

module.exports = {
    getAnalyticsSummary,
    getPageViewMetrics,
    getCTAClickMetrics
};
