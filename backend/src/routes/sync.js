const express = require('express');
const { db } = require('../db');
const { members } = require('../db/schema');
const { eq } = require('drizzle-orm');

const router = express.Router();

// Bulk sync endpoint for mobile app
router.post('/', async (req, res) => {
    try {
        const { records } = req.body;

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ error: 'Records array is required' });
        }

        const results = {
            success: [],
            failed: [],
        };

        for (const record of records) {
            try {
                // Check if record exists by ID
                const existing = await db.select().from(members).where(eq(members.id, record.id)).limit(1);

                if (existing.length > 0) {
                    // Update existing record (conflict resolution: last write wins)
                    const updated = await db.update(members)
                        .set({
                            ...record,
                            syncStatus: 'synced',
                            updatedAt: new Date(),
                        })
                        .where(eq(members.id, record.id))
                        .returning();

                    results.success.push({ id: record.id, action: 'updated', data: updated[0] });
                } else {
                    // Insert new record
                    const inserted = await db.insert(members).values({
                        ...record,
                        syncStatus: 'synced',
                        updatedAt: new Date(),
                    }).returning();

                    results.success.push({ id: record.id, action: 'created', data: inserted[0] });
                }
            } catch (error) {
                console.error(`Sync error for record ${record.id}:`, error);
                results.failed.push({ id: record.id, error: error.message });
            }
        }

        res.json({
            message: 'Sync completed',
            total: records.length,
            successful: results.success.length,
            failed: results.failed.length,
            results,
        });
    } catch (error) {
        console.error('Bulk sync error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
