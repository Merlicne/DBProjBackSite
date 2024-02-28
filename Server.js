const express = require('express');
const { get } = require('http');
const path = require('path');
const {Client} = require('pg');
const { createHash } = require('crypto');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Connect to Postgres Database
{
    var connection = new Client({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.data_base_port
    });

    
    
    connection.connect(async function(err) {
        if (!err) console.log("Connected!");
        else console.log(err,"Failed to connect!");
    });
}





// Create a new express application instance
{
    var app = express();
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

// init error handling
// {
//     app.all('*', (req, res, next) => {
//         let err = new Error(`Can't find ${req.originalUrl} on this server!`);
//         err.status = 'fail';
//         err.statusCode = 404;
//         next(err);
//     });
    
//     app.use((err, req, res, next) => {
//         err.statusCode = err.statusCode || 500;
//         err.status = err.status || 'error';
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message
//         });
//     });
// }

let req_count = 0;

app.get('/' , async function (req, res, next) {
    console.log("/ : " + req_count++);
    res.status(200).json({
        message: 'success',
        results: 'API work fine!'
    });
});

app.get('/getFaculty', async function (req, res, next) {
    console.log("/getFaculty : " + req_count++);
    var query = "select * from karaoke.getallfaculty();";
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error'});
        else    
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
    });
});

app.post('/AdminLogin',express.json(), async function (req, res, next) {
    console.log("/AdminLogin : " + req_count++);
    var pass = createHash('sha256').update(req.body.password).digest('base64');

    var query = `select karaoke.AdminLogin('${req.body.username}','${pass}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error', error: err});
        else if (results.rows[0].adminlogin != null)    
            res.status(200).json({  
                message: 'success',
                results: results.rows
            });
        else
            res.status(200).json({  
                message: 'login_fail',
                results: results.rows
            });
    });
});

app.get('/Home', async function (req, res, next) {
    console.log("/Home : " + req_count++);
    var datetime = req.query.date;

    if (datetime == undefined || datetime.length == 0) datetime = 'now';

    var query = `select * from karaoke.reserv_filter_dashboard('${datetime}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
    });
});

app.post('/addRoom',express.json(), async function (req, res, next) {
    var query = `select karaoke.add_room('${req.body.room_name}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
    });
});

app.post('/addPromotion',express.json(), async function (req, res, next) {
    console.log('addPromotion '+req_count++);
    var query = `select karaoke.add_promotion('${req.body.promotion_name}', ${req.body.type_id}::int2,${req.body.condition}::int2,${req.body.discount}::int2,'${req.body.start}','${req.body.end}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
    });
});

app.get('/getAvailablePromo', async function (req, res, next) {
    console.log('getAvailablePromo '+req_count++);
    var query = `select * from karaoke.getAvaPromo();`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
    });
});

app.get('/reservationDetail', async function (req, res, next) {
    console.log('reservationDetail '+req_count++);
    var query = `select * from karaoke.res_detail(${req.query.id});`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
    });
});

app.delete('/deletePromotion', async function (req, res, next) {
    console.log('deletePromotion '+req_count++);
    var query = `select karaoke.delete_promotion_v2(${req.query.id}::int2);`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
    });
});
// var pass = createHash('sha256').update('1234').digest('base64');
