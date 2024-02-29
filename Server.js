const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');

const pool = require('./db'); 
const verifyToken = require('./middleware/JWT_auth');
const loginRoute = require('./routes/login');
const getFaculty = require('./routes/getFaculty');
const home = require('./routes/home');
const addRoom = require('./routes/addRoom');
const addPromotion = require('./routes/addPromotion');
const getAvailablePromo = require('./routes/getAvailablePromo');
const reservationDetail = require('./routes/reservationDetail');
const deletePromotion = require('./routes/deletePromotion');
const getRoom = require('./routes/getRoom');
const add_room = require('./routes/addRoom');
const deleteRoom = require('./routes/deleteRoom');
const forgetPassword = require('./routes/forget_pass');
const resetPassword = require('./routes/resetPassword');
const createAdmin = require('./routes/Create_admin');
const deleteAdmin = require('./routes/delete_admin');
const {OTP_holding, OTP_check} = require('./middleware/OTP');
const { API_KEY, KEY_GENERATOR } = require('./middleware/API_KEY');

require('dotenv').config();


// var connection = pool.connect(async function(err) {
//     if (err) console.log(err,"\n\n database Failed to connect!");
//     else console.log('Database connected!');
// });


var req_count = 0;
var count_req = (req,res,next) => {
    console.log(`count : `+ ++req_count + ` | ${req.method} ${req.url}`);
    next();
}


// Create a new express application instance
{
    var app = express();
    app.use(count_req);
    app.use(cors({credentials: true, origin: true}));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Accept,X-Requested-With, Content-Length, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        next();
    });
    app.use(cookieParser());
    app.use(express.static('public'));
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,async () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


app.post('/AdminLogin',express.json(), loginRoute, KEY_GENERATOR);

// app.use(verifyToken);

app.get('/' , async function (req, res, next) {
    console.log("/ : " + req_count++);
    res.status(200).json({
        message: 'success',
        results: 'API work fine!'
    });
});

app.get('/getFaculty',API_KEY, getFaculty);
app.get('/Home' ,API_KEY, home);
app.get('/getAvailablePromo' ,API_KEY,getAvailablePromo);
app.get('/reservationDetail',API_KEY , reservationDetail);
app.get('/getRoom',API_KEY, getRoom);

app.put('/deletePromotion' ,API_KEY, deletePromotion);
app.put('/deleteRoom',API_KEY , deleteRoom);

app.post('/forgetPassword',express.json(), forgetPassword,OTP_holding);
app.post('/resetPassword',express.json(), OTP_check, resetPassword);

app.use(express.json());
app.use(API_KEY);

app.post('/addRoom',express.json(), addRoom);
app.post('/addPromotion' ,express.json(), addPromotion);
app.post('/add_room',express.json(), add_room);
app.post('/Create_admin',express.json(), createAdmin);

app.delete('/delete_admin',express.json(), deleteAdmin);
