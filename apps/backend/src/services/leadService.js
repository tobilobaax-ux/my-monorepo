const db = require("../db");
const { heroLeads } = require("../db/schema");

/**
 * Creates a new hero lead in the database.
 * @param {Object} leadData - { formType, selectedOption, payload }
 * @returns {Promise<Object>} The created lead record
 */
async function createHeroLead({ formType, selectedOption, payload }) {
    const [newLead] = await db.insert(heroLeads).values({ 
        formType, 
        selectedOption, 
        payload 
    }).returning();
    return newLead;
}

module.exports = {
    createHeroLead
};
