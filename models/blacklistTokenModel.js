const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const BlacklistToken = sequelize.define('BlacklistToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiry: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'blacklist_tokens',
    timestamps: false
});

module.exports = BlacklistToken;
