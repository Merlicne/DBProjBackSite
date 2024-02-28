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
        app.use(cookieParser());
        app.use(express.static('public'));
    });
    
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,async () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

var OTP_collection = [];

var OTP_holding = (req,res,next) => {
    var OTP_data = {
        email: res.locals.email,
        OTP: res.locals.otp,
        time: new Date().getTime()
    }
    OTP_collection.push(OTP_data);
    console.log(OTP_collection);
}

var OTP_check = (req,res,next) => {
    var OTP = req.body.otp;
    var email = req.body.email;

    var index = OTP_collection.findIndex((element) => {
        return element.email == email;
    });

    if(OTP == null) {
        res.status(400).json({message: 'error', 'error': 'OTP or email is missing'});
    }
    else if(OTP_collection[index].OTP != OTP) {
        res.status(400).json({message: 'error', 'error': 'OTP is incorrect'});
    }
    else if(new Date().getTime() - OTP_collection[index].time > 1000 * 60 * 1) {
        res.status(400).json({message: 'error', 'error': 'OTP is expired'});
    }
    else {
        OTP_collection.splice(index,1);
        next();
    }
}


app.get('/' , async function (req, res, next) {
    console.log("/ : " + req_count++);
    res.status(200).json({
        message: 'success',
        results: 'API work fine!'
    });
});

app.get('/getFaculty', getFaculty);
app.get('/Home', home);
app.get('/getAvailablePromo' ,getAvailablePromo);
app.get('/reservationDetail' , reservationDetail);
app.get('/getRoom', getRoom);

app.put('/deletePromotion' , deletePromotion);
app.put('/deleteRoom' , deleteRoom);

app.post('/addRoom',express.json(), addRoom);
app.post('/AdminLogin',express.json(), loginRoute);
app.post('/addPromotion' ,express.json(), addPromotion);
app.post('/add_room',express.json(), add_room);
app.post('/forgetPassword',express.json(), forgetPassword,OTP_holding);
app.post('/resetPassword',express.json(), OTP_check, resetPassword);
