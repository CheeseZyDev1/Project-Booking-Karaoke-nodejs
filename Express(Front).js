const express = require('express');
const methodOverride = require('method-override');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const base_url = "http://localhost:3000";

app.set('view engine', 'ejs');
app.set('views', './views');

// เส้นทางและโลจิกสำหรับ Users, Rooms, Bookings, PaymentDetails ตามที่คุณให้มา...
// แสดงรายการผู้ใช้
app.get('/users', async (req, res) => {
    try {
        const users = await Users.findAll();
        res.render('users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// เพิ่มผู้ใช้ใหม่
app.post('/users', async (req, res) => {
    try {
        await Users.create(req.body);
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(400).send('Unable to create user');
    }
});

// ลบผู้ใช้
app.delete('/users/:id', async (req, res) => {
    try {
        await Users.destroy({ where: { UserID: req.params.id } });
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(5500, () => {
    console.log('Server started on port 5500');
    });