const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
require('dotenv').config();
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const BlacklistToken = require('../models/blacklistTokenModel');

////////////////////////////////////////////////////////////////////////////////

exports.signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username) {
            res.status(400).json({ message: 'no username provided' })
        }
        if (!email) {
            res.status(400).json({ message: 'no username provided' })
        }
        if (!password) {
            res.status(400).json({ message: 'no username provided' })
        }
        if (!role) {
            res.status(400).json({ message: 'no username provided' })
        }
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: 'user created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

////////////////////////////////////////////////////////////////////////////////

exports.login = async (req, res) => {
    // Validate request body
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

////////////////////////////////////////////////////////////////////////////////

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        // Validate refresh token
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Generate new access token
        const newAccessToken = generateAccessToken({ userId: decoded.userId });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};


////////////////////////////////////////////////////////////////////////////////

exports.logout = async (req, res) => {
    try {
        // Extract the access token from the request headers
        const token = req.headers['authorization'];

        // Construct the reason for blacklisting the token
        const reason = 'user logout';

        // Decode the JWT token to extract the expiry time
        const decodedToken = jwt.decode(token, { complete: true });
        if (!decodedToken || !decodedToken.payload.exp) {
            return res.status(400).json({ message: 'Invalid token format or expiry time missing' });
        }
        // Set the expiry time for the blacklisted token
        const expiryTime = new Date(decodedToken.payload.exp * 1000); // Convert seconds to milliseconds

        // Create a new record for the blacklisted token in the database
        await BlacklistToken.create({ token, reason, expiry: expiryTime });
        console.log('###########################################\n Token revoked successfully \n###########################################')
        // Respond to the user with a logout successful message
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

////////////////////////////////////////////////////////////////////////////////
