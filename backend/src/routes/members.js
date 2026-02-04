const express = require('express');
const { db } = require('../db');
const { members } = require('../db/schema');
const { eq } = require('drizzle-orm');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all members (Admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const allMembers = await db.select().from(members);
        res.json(allMembers);
    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single member (Admin only)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const member = await db.select().from(members).where(eq(members.id, req.params.id)).limit(1);

        if (member.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json(member[0]);
    } catch (error) {
        console.error('Get member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create single member (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newMember = await db.insert(members).values({
            ...req.body,
            updatedAt: new Date(),
        }).returning();

        res.status(201).json(newMember[0]);
    } catch (error) {
        console.error('Create member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update member (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updated = await db.update(members)
            .set({
                ...req.body,
                updatedAt: new Date(),
            })
            .where(eq(members.id, req.params.id))
            .returning();

        if (updated.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json(updated[0]);
    } catch (error) {
        console.error('Update member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete member (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await db.delete(members)
            .where(eq(members.id, req.params.id))
            .returning();

        if (deleted.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Delete member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
