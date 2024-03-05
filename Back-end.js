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

//CRUD
// CRUD Operations for Users
// Add a GET route to retrieve all users

// Route สำหรับการสร้างผู้ใช้ใหม่
app.post('/users/create', async (req, res) => {
    try {
        const newUser = await Users.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Add a GET route to retrieve a single user by UserID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await Users.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.put('/user/:id' , (req,res) => {
    Users.findByPk(req.params.id).then(user => {
        if(!user){
            res.status(500).send('Book not found');
        }
        else{
            user.update(req.body).then(() => {
                res.send(user);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete('/users/:id', async (req, res) => {
    Users.findByPk(req.params.id).then(user => {
        if(!user){
            res.status(404).send('Book not found');
        } else {
            user.destroy().then(() =>{
            res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch (error =>{
        res.status(400).json({ error: error.message });
    });
});
//CRUD ROOM
app.get('/rooms', async(req,res) => {
    try{
        const rooms = await Rooms.findAll();
        res.status(200).json(rooms)
    }catch(error){
        res.status(404).send(err)
    }
});

app.get('/rooms/create', async (req, res) => {
    try {
        const room = await Rooms.create(req.body);
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/rooms/:id', async (req, res) => {
    try {
        const [updated] = await Rooms.update(req.body, { where: { RoomID: req.params.id } });
        if (updated) {
            const updatedRoom = await Rooms.findOne({ where: { RoomID: req.params.id } });
            res.status(200).json(updatedRoom);
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/rooms/:id', async (req, res) => {
    try {
        const deleted = await Rooms.destroy({ where: { RoomID: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
//CRUD BOOKING
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Bookings.findAll();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/bookings/create', async (req, res) => {
    try {
        const booking = await Bookings.create(req.body);
        res.status(200).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/bookings/:id', async (req, res) => {
    try {
        const [updated] = await Bookings.update(req.body, { where: { BookingID: req.params.id } });
        if (updated) {
            const updatedBooking = await Bookings.findOne({ where: { BookingID: req.params.id } });
            res.status(200).json(updatedBooking);
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/bookings/:id', async (req, res) => {
    try {
        const deleted = await Bookings.destroy({ where: { BookingID: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
//CRUD PAYMENT
app.get('/paymentdetails', async (req, res) => {
    try {
        const paymentDetail = await PaymentDetails.findAll();
        res.status(200).json(paymentDetail);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/paymentdetails/create', async (req, res) => {
    try {
        const paymentDetail = await PaymentDetails.create(req.body);
        res.status(200).json(paymentDetail);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/paymentdetails/:id', async (req, res) => {
    try {
        const [updated] = await PaymentDetails.update(req.body, { where: { PaymentID: req.params.id } });
        if (updated) {
            const updatedPaymentDetail = await PaymentDetails.findOne({ where: { PaymentID: req.params.id } });
            res.status(200).json(updatedPaymentDetail);
        } else {
            res.status(404).json({ error: 'Payment detail not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/paymentdetails/:id', async (req, res) => {
    try {
        const deleted = await PaymentDetails.destroy({ where: { PaymentID: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Payment detail not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
//CRUD

// Sync models with the database
sequelize.sync()
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Listening on port ${port}...`));
    })
    .catch(err => console.error('Error syncing with the database:', err));
