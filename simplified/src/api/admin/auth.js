
import express from 'express';

const router = express.Router();

/**
 * POST /api/admin/login
 * Authenticate admin user
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Simple hardcoded admin for MVP
    // In a real app, this would check a database or hashed password
    if (username === 'admin' && password === 'admin') {
        res.json({
            success: true,
            token: 'admin-token-mvp',
            user: { username: 'admin', role: 'admin' }
        });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

/**
 * GET /api/admin/me
 * Get current user profile
 */
router.get('/me', (req, res) => {
    // Extract token from header - very basic implementation
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);

    if (token === 'admin-token-mvp') {
        res.json({
            user: { username: 'admin', role: 'admin' }
        });
    } else {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
