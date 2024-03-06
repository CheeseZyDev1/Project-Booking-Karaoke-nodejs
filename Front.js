const express = require('express');
const axios = require('axios');
const methodOverride = require('method-override');
var bodyParser = require('body-parser');
const { render } = require('ejs');
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const base_url = "http://localhost:3000";

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));


app.post('/users', async (req, res) => {
    try {
        // Construct user data from the request body
        const userData = {Username:req.body.username, Password:req.body.password, Email:req.body.email, Phone:req.body.phone};

        // Send a POST request to the backend API to create a new user
         await axios.post(base_url + '/users/create', userData);

        // Redirect the user back to the users page after successful creation
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        // Render an error page if the creation fails
        res.status(400).render('error', { message: 'Unable to create user' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const response = await axios.get(base_url + '/users');
        res.render("Users", { users : response.data }); // Make sure 'users.ejs' exists
    } catch (error) {
        console.error(error);
        // Render an 'error.ejs' view if it exists, passing an error message
        res.status(500).render('error', { message: 'Server error while retrieving users' });
    }
});

app.get('/users/edit/:id', async (req,res) => {
    try{
        const response = await axios.get(base_url+'/users/'+req.params.id)
        res.render('edit_user',{'user' : response.data})
    }catch(err){
        res.status(500).render('error', { message: 'Server error while retrieving users' });
    }
});
app.post('/users/:id',async (req,res) => {
    try{
        const data = {Username:req.body.username, Password:req.body.password, Email:req.body.email, Phone:req.body.phone};
        await axios.put(base_url+'/user/'+req.params.id,data)
        res.redirect('/users')
    }catch(err){
        res.status(500).render('error', { message: 'Server error while retrieving users' });
    }
});
// Add a new user
app.get('/user/create',(req,res) => {
    try{
        res.render('create_users')
    }catch(err){
        res.status(500).render('error', { message: 'Server error while retrieving users' });
    }
});
// Delete a user
app.get('/users/delete/:id', async (req, res) => {
    try{
        await axios.delete(base_url+'/users/'+req.params.id);
        res.redirect("/users");
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/rooms', async (req,res) => {
        try{
            const response = await axios.get(base_url + '/rooms');
            res.render("rooms", { rooms : response.data }); // 
        }catch(error){
            res.status(500).render('error', { message: 'Server error while retrieving rooms' });
        }
});
app.post('/rooms', async (req, res) => {
    try {
        // Construct user data from the request body
        const data = {RoomName:req.body.roomname, Capacity:req.body.capacity,Status:req.body.status };

        // Send a POST request to the backend API to create a new user
        const response = await axios.post(base_url + '/rooms/create', data);

        // Redirect the user back to the rooms page after successful creation
        res.redirect('/rooms');
    } catch (error) {
        console.error(error);
        // Render an error page if the creation fails
        res.status(400).render('error', { message: 'Unable to create user' });
    }
});

app.get('/rooms', async (req, res) => {
    try {
        const response = await axios.get(base_url + '/rooms');
        res.render("rooms", { rooms : response.data }); // Make sure 'rooms.ejs' exists
    } catch (error) {
        console.error(error);
        // Render an 'error.ejs' view if it exists, passing an error message
        res.status(500).render('error', { message: 'Server error while retrieving rooms' });
    }
});

app.get('/rooms/edit/:id', async (req,res) => {
    try{
        const response = await axios.get(base_url+'/rooms/'+req.params.id)
        res.render('edit_rooms',{'room' : response.data})
    }catch(err){
        res.status(500).render('error', { message: 'Server error while retrieving rooms' });
    }
});
app.post('/rooms/edit/:id',async (req,res) => {
    try{
        const data = {RoomName:req.body.roomname, Capacity:req.body.capacity,Status:req.body.status };
        await axios.put(base_url+'/rooms/'+req.params.id,data)
        res.redirect('/rooms')
    }catch(err){
        res.status(500).render('error', { message: 'Server error while retrieving rooms' });
    }
});
// Add a new user
app.get('/rooms/create',(req,res) => {
    try{
        res.render('create_rooms')
    }catch(err){
        res.status(500).render('error', { message: 'Server error while retrieving rooms' });
    }
});
// Delete a user
app.get('/rooms/delete/:id', async (req, res) => {
    try{
        await axios.delete(base_url+'/rooms/'+req.params.id);
        res.redirect("/rooms");
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/payment', async (req,res) => {
    try{
        const response = await axios.get(base_url + '/payment');
        res.render("payment", { payment : response.data }); // 
    }catch(error){
        res.status(500).render('error', { message: 'Server error while retrieving payment' });
    }
});
app.post('/payment', async (req, res) => {
try {
    // Construct user data from the request body
  /*  const userData = {
        {RoomName:req.body.roomname, Capacity:req.body.capacity,Status:req.body.status 
        Amount :req.body.amount,
        PaymentMethod :req.body.
    };*/

    // Send a POST request to the backend API to create a new user
    const response = await axios.post(base_url + '/payment/create', userData);

    // Redirect the user back to the payment page after successful creation
    res.redirect('/payment');
} catch (error) {
    console.error(error);
    // Render an error page if the creation fails
    res.status(400).render('error', { message: 'Unable to create user' });
}
});

app.get('/payment', async (req, res) => {
try {
    const response = await axios.get(base_url + '/payment');
    res.render("payment", { payment : response.data }); // Make sure 'payment.ejs' exists
} catch (error) {
    console.error(error);
    // Render an 'error.ejs' view if it exists, passing an error message
    res.status(500).render('error', { message: 'Server error while retrieving payment' });
}
});

app.get('/payment/edit/:id', async (req,res) => {
try{
    const response = await axios.get(base_url+'/payment/'+req.params.id)
    res.render('edit_payment',{'payment' : response.data})
}catch(err){
    res.status(500).render('error', { message: 'Server error while retrieving payment' });
}
});
app.post('/payment/:id',async (req,res) => {
try{
    const data = {Username:req.body.username, Password:req.body.password, Email:req.body.email, Phone:req.body.phone};
    await axios.put(base_url+'/payment/'+req.params.id,data)
    res.redirect('/payment')
}catch(err){
    res.status(500).render('error', { message: 'Server error while retrieving payment' });
}
});
// Add a new user
app.get('/payment/create',(req,res) => {
try{
    res.render('create_payment')
}catch(err){
    res.status(500).render('error', { message: 'Server error while retrieving payment' });
}
});
// Delete a user
app.get('/payment/delete/:id', async (req, res) => {
try{
    await axios.delete(base_url+'/payment/'+req.params.id);
    res.redirect("/payment");
}catch(err){
    console.log(err);
    res.status(500).send(err);
}
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/bookings',async (req,res) => {
    try{
        const response = await axios.get(base_url + '/bookings')
        res.render('Bookings',{bookings : response.data})
    }catch(error){
        res.status(500).render('error', { message: 'Server error while retrieving bookings' });
    }
})

app.get('/booking/create',(req,res) => {
    try{
        res.render('create_booking');
    }catch(error){
        res.status(500).render('error', { message: 'Server error while retrieving bookings' });
    }
})

app.post('/booking/create', async (req,res)  => {
    try{
        const data = {
            StartTime:req.body.bookingDate_start,
            EndTime:req.body.bookingDate_end,
            Status:req.body.room,
            UserID:req.body.userID,
            RoomID:req.body.roomID
        }
        await axios.post(base_url+'/booking/create',data)
        res.redirect('/bookings')
    }catch(error){
        res.status(500).render('error', { message: 'Server error while retrieving bookings' });
    }
})

app.get('/booking/edit/:id',async (req,res) => {
    try{
        const response  = await axios.get(base_url+'/bookings/'+req.params.id)
        res.render('edit_booking',{'booking':response.data})
    }catch(error){
        res.status(500).render('error', { message: 'Server error while retrieving bookings' });
    }
})

app.post('/booking/update/:id', async (req,res)  => {
    try{
        const data = {
            StartTime:req.body.starttime,
            EndTime:req.body.endtime,
            Status:req.body.Status,
            UserID:req.body.userId,
            RoomID:req.body.roomId
        }
        await axios.put(base_url+'/booking/edit/'+req.params.id,data)
        res.redirect('/bookings')
    }catch(error){
        res.status(500).render('error', { message: 'Server error while retrieving bookings' });
    }
})

app.get("/booking/delete/:id",(req,res) => {
    try{
        axios.delete(base_url+'/bookings/'+req.params.id)
        res.redirect('/bookings')
    }catch(error){
        res.status(500).render('error', { message: 'Server error while retrieving bookings' });
    }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/paymentdetails',async (req,res) => {
    try{
        const response = await axios.get(base_url + '/paymentdetails')
        res.render("Payment",{"paymentDetails":response.data})
    }catch(err){
        res.status(500).render('error', { message: 'Server error while retrieving paymentdetails' });
    }
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(5500, () => {
    console.log('Server started on port 5500');
    });