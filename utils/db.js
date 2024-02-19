const { Sequelize } = require('sequelize');
const pg = require('pg');
const sequelize = new Sequelize("testdb", "postgres", "greenage", {
    host: 'localhost',
    dialect: 'postgres'
    ,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    ,
    dialectModule: pg
});

module.exports = { sequelize };

//host: '192.168.100.17',