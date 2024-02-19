const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistTokenModel');

exports.revokeToken = async (req, res) => {
    const token = req.headers.authorization;
    const { reason } = req.body;
    // console.log("##########################################\n", token)
    try {

        if (!token) {
            return res.status(400).json({ message: 'Token is missing from the request headers' });
        }

        if (!reason) {
            return res.status(400).json({ message: 'Reason is required' });
        }

        // Decode the JWT token to extract the expiry time
        const decodedToken = jwt.decode(token, { complete: true });
        if (!decodedToken || !decodedToken.payload.exp) {
            return res.status(400).json({ message: 'Invalid token format or expiry time missing' });
        }

        // Set the expiry time for the blacklisted token
        const expiryTime = new Date(decodedToken.payload.exp * 1000); // Convert seconds to milliseconds

        // Create a new record for the blacklisted token in the database
        await BlacklistToken.create({ token, reason, expiry: expiryTime });

        res.json({ message: 'Token revoked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
