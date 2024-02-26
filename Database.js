const express = require('express');
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

const app = express();

app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './Database/Karaoke.sqlite'
});

// Define models for Users, Rooms, Bookings, and PaymentDetails
const Users = sequelize.define('Users', {
    UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING
    },
    Phone: {
        type: DataTypes.STRING
    }
});

const Rooms = sequelize.define('Rooms', {
    RoomID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    RoomName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Status: {
        type: DataTypes.ENUM('Available', 'Booked'),
        defaultValue: 'Available'
    }
});

const Bookings = sequelize.define('Bookings', {
    BookingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    StartTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EndTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled'),
        defaultValue: 'Pending'
    }
});

const PaymentDetails = sequelize.define('PaymentDetails', {
    PaymentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    PaymentMethod: {
        type: DataTypes.ENUM('Credit Card', 'Debit Card', 'Cash'),
        allowNull: false
    },
    PaymentStatus: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Refunded'),
        defaultValue: 'Pending'
    },
    PaymentDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// Define associations between models
Users.hasMany(Bookings, { foreignKey: 'UserID' });
Rooms.hasMany(Bookings, { foreignKey: 'RoomID' });
Bookings.belongsTo(Users, { foreignKey: 'UserID' });
Bookings.belongsTo(Rooms, { foreignKey: 'RoomID' });
Bookings.hasOne(PaymentDetails, { foreignKey: 'BookingID' });

// Sync models with the database
sequelize.sync()
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Listening on port ${port}...`));
    })
    .catch(err => console.error('Error syncing with the database:', err));
