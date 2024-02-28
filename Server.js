const express = require('express');
const cookieParser = require('cookie-parser');

const verifyToken = require('./middleware/JWT_auth');
const pool = require('./routes/db');
const loginRoute = require('./routes/login');
const getFaculty = require('./routes/getFaculty');
const home = require('./routes/home');
const addRoom = require('./routes/addRoom');
const addPromotion = require('./routes/addPromotion');
const getAvailablePromo = require('./routes/getAvailablePromo');
const reservationDetail = require('./routes/reservationDetail');
const deletePromotion = require('./routes/deletePromotion');

require('dotenv').config();

// Connect to Postgres Database
{
    var connection = pool;
    connection.connect(async function(err) {
        if (!err) console.log("Connected!");
        else console.log(err,"Failed to connect!");
    });
}

var req_count = 0;
var count_req = (req,res,next) => {
    console.log(`count : `+ ++req_count + ` | ${req.method} ${req.url}`);
    next();
}


// Create a new express application instance
{
    var app = express();
    app.use(count_req);
    app.use(cookieParser());
    app.use(express.static('public'));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        next();
    });


    const PORT = process.env.PORT || 3000;
    app.listen(PORT,async () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

app.get('/' , async function (req, res, next) {
    console.log("/ : " + req_count++);
    res.status(200).json({
        message: 'success',
        results: 'API work fine!'
    });
});

app.get('/getFaculty',verifyToken, getFaculty);

app.post('/AdminLogin',express.json(), loginRoute);

app.get('/Home',verifyToken, home);

app.post('/addRoom',verifyToken,express.json(), addRoom);

app.post('/addPromotion',verifyToken ,express.json(), addPromotion);

app.get('/getAvailablePromo',verifyToken ,getAvailablePromo);

app.get('/reservationDetail',verifyToken , reservationDetail);

app.delete('/deletePromotion',verifyToken , deletePromotion);
// var pass = createHash('sha256').update('1234').digest('base64');
