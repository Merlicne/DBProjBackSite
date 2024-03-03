const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
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
const getAdmin = require('./routes/getAdmin');
const getCancelReservation = require('./routes/getCanceledReserv');
const getSuccesReservation = require('./routes/getSuccessReserv');
const getReservByStatus = require('./routes/getReservByStatus');
const editAdmin = require('./routes/editAdmin');
const getDailyRevenue = require('./routes/getDailyRevenue');
const getMonthlyRevenue = require('./routes/getMonthlyRevenue');
const showProfile = require('./routes/showprofile');
const cancelReserv = require('./routes/cancelReserv');
const DoneReserv = require('./routes/ReservDone');
const getMonthCount = require('./routes/getCountResPerMonth');

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



// app.use(verifyToken);

app.get('/' , async function (req, res, next) {
    console.log("/ : " + req_count++);
    res.status(200).json({
        message: 'success',
        results: 'API work fine!'
    });
});

app.post('/AdminLogin',express.json(), loginRoute, KEY_GENERATOR);

app.post('/forgetPassword',express.json(), forgetPassword, OTP_holding);
app.post('/OTP_check',express.json(), OTP_check);
app.post('/resetOTPPassword',express.json(), resetPassword);


app.get('/getFaculty',API_KEY, getFaculty);
app.get('/Home',API_KEY, home);
app.get('/getAvailablePromo' ,API_KEY,getAvailablePromo);
app.get('/reservationDetail',API_KEY , reservationDetail);
app.get('/getRoom',API_KEY, getRoom);
app.get('/getAdmin',API_KEY, getAdmin);
app.get('/getCancelReservation',API_KEY, getCancelReservation, getReservByStatus);
app.get('/getSuccessReservation',API_KEY, getSuccesReservation,getReservByStatus);
app.get('/getMonthCount',API_KEY, getMonthCount);
app.get('/getMonthlyRevenue',API_KEY, getMonthlyRevenue);

app.put('/deletePromotion',API_KEY , deletePromotion);
app.put('/deleteRoom',API_KEY , deleteRoom);
app.put('/cancelReserv',API_KEY , cancelReserv);
app.put('/ReservDone',API_KEY , DoneReserv)

app.use(express.json());
app.use(API_KEY);


app.put('/editAdmin', editAdmin);
app.post('/addRoom', addRoom);
app.post('/showProfile', showProfile);
app.post('/ResetPassFromProfile', resetPassword);
app.post('/addPromotion' , addPromotion);
app.post('/add_room', add_room);
app.post('/Create_admin' , createAdmin);

app.delete('/delete_admin', deleteAdmin);


