const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);

// Route to generate new access token using refresh token
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
