const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistTokenModel')
exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized OR Authentication token is missing' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

        // Check if the token is blacklisted
        const blacklistedToken = await BlacklistToken.findOne({ where: { token } });
        if (blacklistedToken) {
            return res.status(401).json({ message: 'Access token is blacklisted' });
        }
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token OR Token Expired' });
    }
};

exports.isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (!role || role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied: You must be an admin to perform this action.' });
    }
    next();
};