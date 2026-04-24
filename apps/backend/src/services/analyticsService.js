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
        .where(eq(analyticsEvents.eventType, 'Viewed Event'));
    
    const [clicksCount] = await db.select({ count: sql`count(*)` }).from(analyticsEvents)
        .where(eq(analyticsEvents.eventType, 'Clicked Event'));
    
    const [modalCount] = await db.select({ count: sql`count(*)` }).from(analyticsEvents)
        .where(like(analyticsEvents.ctaId, '%modal_open%'));
    
    const [leadsCountNew] = await db.select({ count: sql`count(*)` }).from(analyticsEvents)
        .where(eq(analyticsEvents.eventType, 'Completed Event'));

    const views = Number(viewsCount?.count || 0);
    const clicks = Number(clicksCount?.count || 0);
    const opens = Number(modalCount?.count || 0);
    const leads = Number(leadsCount?.count || 0) + Number(leadsCountNew?.count || 0);

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
    const urls = await db.select({
        url: analyticsEvents.pageUrl,
        count: sql`count(*)`
    })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, 'Viewed Event'))
    .groupBy(analyticsEvents.pageUrl)
    .orderBy(sql`count(*) DESC`)
    .limit(10);

    // Also include 'Hero Section Viewed' which is our primary metric
    const [heroViewed] = await db.select({
        url: sql`'(hero section viewed)'`,
        count: sql`count(*)`
    })
    .from(analyticsEvents)
    .where(like(analyticsEvents.ctaId, '%section: hero%'));

    return [...urls, heroViewed].filter(i => i && i.count > 0);
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
    .where(or(
        eq(analyticsEvents.eventType, 'Clicked Event'),
        eq(analyticsEvents.eventType, 'Completed Event'),
        eq(analyticsEvents.eventType, 'Abandoned Event')
    ))
    .groupBy(analyticsEvents.ctaId)
    .orderBy(sql`count(*) DESC`)
    .limit(25);
}

module.exports = {
    getAnalyticsSummary,
    getPageViewMetrics,
    getCTAClickMetrics
};
