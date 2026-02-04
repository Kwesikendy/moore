const express = require('express');
const { db } = require('../db');
const { formSchema } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get active form schema (public - for mobile app)
router.get('/', async (req, res) => {
    try {
        const schema = await db.select()
            .from(formSchema)
            .where(eq(formSchema.isActive, true))
            .orderBy(desc(formSchema.version))
            .limit(1);

        if (schema.length === 0) {
            return res.json({
                version: 1,
                elements: getDefaultSchema(),
            });
        }

        res.json(schema[0]);
    } catch (error) {
        console.error('Get schema error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create/Update form schema (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { elements } = req.body;

        if (!elements || !Array.isArray(elements)) {
            return res.status(400).json({ error: 'Elements array is required' });
        }

        // Deactivate all previous schemas
        await db.update(formSchema)
            .set({ isActive: false })
            .where(eq(formSchema.isActive, true));

        // Get latest version
        const latest = await db.select()
            .from(formSchema)
            .orderBy(desc(formSchema.version))
            .limit(1);

        const newVersion = latest.length > 0 ? latest[0].version + 1 : 1;

        // Create new schema
        const newSchema = await db.insert(formSchema).values({
            version: newVersion,
            elements,
            isActive: true,
        }).returning();

        res.status(201).json(newSchema[0]);
    } catch (error) {
        console.error('Create schema error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Default schema structure
function getDefaultSchema() {
    return [
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'dob', label: 'Date of Birth', type: 'date', required: false },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: false },
        { name: 'phone', label: 'Phone Number', type: 'text', required: false },
        { name: 'address', label: 'Address', type: 'textarea', required: false },
        { name: 'baptized', label: 'Baptized?', type: 'boolean', required: false },
        { name: 'waterBaptized', label: 'Water Baptism?', type: 'boolean', required: false, conditional: { field: 'baptized', value: true } },
        { name: 'holyGhostBaptized', label: 'Holy Ghost Baptism?', type: 'boolean', required: false, conditional: { field: 'baptized', value: true } },
        { name: 'presidingElder', label: 'Presiding Elder Name', type: 'text', required: false },
        { name: 'working', label: 'Working?', type: 'boolean', required: false },
        {
            name: 'occupation',
            label: 'Occupation Category',
            type: 'text',
            required: false,
            conditional: { field: 'working', value: true }
        },
        { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: false },
        { name: 'childrenCount', label: 'Number of Children', type: 'number', required: false, conditional: { field: 'maritalStatus', value: 'Single', negate: true } },
        { name: 'ministry', label: 'Ministry/Department', type: 'select', options: ['Choir', 'Ushering', 'Youth', 'Prayer', 'Other'], required: false },
        { name: 'joinedDate', label: 'Date Joined Church', type: 'date', required: false },
        { name: 'prayerRequests', label: 'Prayer Requests', type: 'textarea', required: false },
    ];
}

module.exports = router;
