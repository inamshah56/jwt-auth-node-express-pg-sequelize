const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklistTokenController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/revoke', verifyToken, blacklistController.revokeToken);

module.exports = router;
