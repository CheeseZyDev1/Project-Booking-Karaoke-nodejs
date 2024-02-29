const express = require('express');
const methodOverride = require('method-override');
//const { Users } = require('./models/users'); 
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const base_url = "http://localhost:3000";

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/users', async (req, res) => {
    try {
        const users = await Users.findAll();
        res.render('users', { users }); // Make sure 'users.ejs' exists
    } catch (error) {
        console.error(error);
        // Render an 'error.ejs' view if it exists, passing an error message
        res.status(500).render('error', { message: 'Server error while retrieving users' });
    }
});


// Add a new user
app.post('/users', async (req, res) => {
    try {
        await Users.create(req.body);
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(400).render('error', { message: 'Unable to create user' });
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        await Users.destroy({ where: { UserID: req.params.id } });
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server error while deleting user' });
    }
});

app.listen(5500, () => {
    console.log('Server started on port 5500');
    });