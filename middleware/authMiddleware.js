const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        console.log('Auth headers:', req.headers); // Debug log
        
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('No token provided'); // Debug log
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JKHSDKJBKJSDJSDJKBKSD345345345345');
        console.log('Decoded token:', decoded); // Debug log
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error); // Debug log
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
