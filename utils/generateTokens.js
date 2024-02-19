const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    const { id, role } = user;
    return jwt.sign({ userId: id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    const { id, role } = user;
    return jwt.sign({ userId: id, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

module.exports = { generateAccessToken, generateRefreshToken }; 