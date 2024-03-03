const express = require('express');
const { get } = require('http');
const mysql = require('mysql2');
const path = require('path');
const {Client} = require('pg')
const {createHash}  = require('crypto')
const { DateTime } = require('luxon');
require('dotenv').config()
const OTP = require('./generateOTP') ;
const mailSender = require('./middleware/mailSender');
const pool = require('./routes/db'); 
const api_key = require('./middleware/api_key');
const {OTP_holding, OTP_check} = require('./middleware/otp');
var cors = require('cors');


const getFaculty = require('./routes/getFaculty');
const getReserveNow = require('./routes/getReserveNow');
const setReserve = require('./routes/setReserve');
const getHistoryReserve= require('./routes/getHistoryReserve');
const getReserveByRoom = require('./routes/getReserveByRoom');
const getRecentlyReserve = require('./routes/getRecentlyReserve');
const signup = require('./routes/signup');
const login = require('./routes/login');
const getProfileUser = require('./routes/getProfileUser');
const setForgetPasswordUser = require('./routes/setForgetPasswordUser');
const ForgetPassword = require('./routes/getForgetPassword');
const setInfoUser = require('./routes/setInfoUser');

const {checkTimeslot, getPromoDiscount, getTotalprice} = require('./routes/getPreReserveDetail');
const getRoom = require('./routes/getRoom');
const setCancelReserve = require('./routes/setCancelReserve');
const setPassword = require('./routes/setPassword');



var connection = pool ;

// Create a new express application instance
{
    var app = express();
    app.use(express.static('public'));
    app.use(cors({credentials: true, origin: true}));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Accept,X-Requested-With, Content-Length, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        next();
    });
    // app.use(cookieParser());
    app.use(express.static('public'));


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


var req_count = 0;
var count_req = (req,res,next) => {
    console.log(`count : `+ ++req_count + ` | ${req.method} ${req.url}`);
    next();
}
app.use(count_req)
app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'html_lake/Docs.html'));
});

app.put("/", (req, res) => {
    console.log(req.body);
    res.send("Data Recieved Successfully!");
})


app.get('/getFaculty', getFaculty);
app.get('/landing_page', getReserveNow);
app.get('/getRoom', getRoom);

app.post('/login', express.json(), login, api_key.KEY_GENERATOR);
app.post("/signupNewCustomer", express.json(), signup);

app.post('/forgetPassword', express.json(), ForgetPassword, OTP_holding); // request for edit pw
app.put('/checkOTP',express.json(), OTP_check);
app.put('/setForgetPassword', express.json(), setForgetPasswordUser); 
app.post('/cancelReserve', express.json(), setCancelReserve);

app.get('/getReserveByRoom',api_key.API_KEY, getReserveByRoom);

app.use(express.json())
app.use(api_key.API_KEY)

app.post('/RecentReserve', express.json(), getRecentlyReserve);
app.post("/book_success", express.json(), setReserve);
app.post('/history', express.json(), getHistoryReserve);
app.post('/getProfileUser', express.json(), getProfileUser);
app.put('/setProfile',express.json(), setInfoUser);
app.post('/preReserve', express.json(), checkTimeslot, getPromoDiscount, getTotalprice);
app.put('/setPassword', express.json(), setPassword);




// done
app.get('/getFaculty/:Fact_En', (req, res) => {
    let fact = req.params.Fact_En.toLowerCase();
    console.log(fact + ` ${++req_count}`);

    
    // get faculty by acronym
    connection.query(`select karaoke.getFacultyByAcro ('${fact}')`, function(err, results) {
        if(err) // there is an error
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        } // successfully get data
        else if(results.length != 0) res.status(200).json({
            message: 'success',
            results: results.rows
        });
        else{ // not found data
            res.status(404).json({
                message: 'fail',
                results: `Not Found '${fact}'`
            });
            
        }
    });
});

app.get('/getStatus', (req, res) => {
    console.log(`getStatus ${++req_count}`);   
    // get all status
    connection.query(`SELECT * FROM res_status`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results
        });
    });
});



