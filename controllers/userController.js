// controllers/userController.js

const User = require('../models/userModel');

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    // Validate request body
    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
    }
    try {
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user properties
        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }

        // Save changes to the user
        await user.save();

        // Create a new object without the password field
        const updatedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            // Exclude password field
        };

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
