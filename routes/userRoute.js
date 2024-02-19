const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin, verifyToken } = require('../middlewares/authMiddleware');

// dashboard routes
router.get('/user/:id', verifyToken, userController.getUserById);
// Only admins can access these routes
router.patch('/user/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/user/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;