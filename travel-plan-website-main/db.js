const { UniqueConstraintError } = require('sequelize');
const sequelize = require('sequelize');
const db = new sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/database.db'
});

//table for customers
const Customer = db.define('customer', {
    name: {
        type: sequelize.STRING(50),
        allowNull: false
    },

    address: {
        type: sequelize.STRING(100),
        allowNull: false
    },

    phone: {
        type: sequelize.NUMBER,
        allowNull: false
    },

    email: {
        type: sequelize.STRING(60),
        allowNull: false,
        unique: true,
        primaryKey: true
    },

    password: {
        type: sequelize.STRING(20),
        allowNull: false
    }
})

//table for bookings
const Booking = db.define('booking', {
    name: {
        type: sequelize.STRING(50),
        allowNull: false
    },

    email: {
        type: sequelize.STRING(60),
        allowNull: false,
    },

    places: {
        type: sequelize.TEXT,
        allowNull: false
    },

    people: {
        type: sequelize.NUMBER,
        allowNull: false
    },

    cost: {
        type: sequelize.FLOAT,
        allowNull: false
    },

    date: {
        type: sequelize.STRING(20),
        allowNull: false
    },

    address: {
        type: sequelize.STRING(100),
        allowNull: false
    },

    phone: {
        type: sequelize.NUMBER,
        allowNull: false
    },
})


module.exports = {
    db, Customer, Booking
}