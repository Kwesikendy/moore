const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { admins } = require('../db/schema');
const { eq } = require('drizzle-orm');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find admin by email
        const admin = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

        if (admin.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, admin[0].passwordHash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin[0].id, email: admin[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            admin: {
                id: admin[0].id,
                email: admin[0].email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Register (for initial setup - can be removed in production)
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if admin exists
        const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create admin
        const newAdmin = await db.insert(admins).values({
            email,
            passwordHash,
        }).returning();

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: newAdmin[0].id,
                email: newAdmin[0].email,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
