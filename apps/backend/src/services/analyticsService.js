const db = require("../db");
const { analyticsEvents, heroLeads } = require("../db/schema");
const { sql, eq, like, or } = require("drizzle-orm");

/**
 * Gets a high-level summary of all platform metrics.
 */
async function getAnalyticsSummary() {
    // 1. Get raw counts from Drizzle (Drizzle handles the event_type vs eventType mapping)
    const [leadsCount] = await db.select({ count: sql`count(*)` }).from(heroLeads);
    const [viewsCount] = await db.select({ count: sql`count(*)` }).from(analyticsEvents)
        .where(eq(analyticsEvents.eventType, 'page_view'));
    
    const [clicksCount] = await db.select({ count: sql`count(*)` }).from(analyticsEvents)
        .where(or(
            like(analyticsEvents.eventType, '%click%'),
            eq(analyticsEvents.eventType, 'cta_click')
        ));
    
    const [modalCount] = await db.select({ count: sql`count(*)` }).from(analyticsEvents)
        .where(like(analyticsEvents.eventType, '%modal%'));

    const views = Number(viewsCount?.count || 0);
    const clicks = Number(clicksCount?.count || 0);
    const opens = Number(modalCount?.count || 0);
    const leads = Number(leadsCount?.count || 0);

    return {
        totalLeads: leads,
        totalPageViews: views,
        totalCTAClicks: clicks,
        totalModalOpens: opens,
        conversionRate: views > 0 ? ((leads / views) * 100).toFixed(1) : "0.0",
        ctr: views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0",
        modalRate: clicks > 0 ? ((opens / clicks) * 100).toFixed(1) : "0.0"
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
    .orderBy(sql`count(*) DESC`)
    .limit(10);
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
    .where(like(analyticsEvents.eventType, '%click%'))
    .groupBy(analyticsEvents.ctaId)
    .orderBy(sql`count(*) DESC`)
    .limit(10);
}

module.exports = {
    getAnalyticsSummary,
    getPageViewMetrics,
    getCTAClickMetrics
};
