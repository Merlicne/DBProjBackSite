const express = require('express');
const { get } = require('http');
const path = require('path');
const {Client} = require('pg');
const { createHash } = require('crypto');

// Connect to Postgres Database
{
    var connection = new Client({
        // host: '127.0.0.1',//0.tcp.ap.ngrok.io:13717
        // port: 5555,
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: 5432,
        user: 'postgres.olictqjkgtdtndbkephu',
        password: 'DBProjLocalDBServerPass_555',
        database: 'postgres'
    });

    
    
    connection.connect(async function(err) {
        if (!err) console.log("Connected!");
        else console.log(err,"Failed to connect!");
    });
}





// Create a new express application instance
{
    var app = express();
    app.use(express.static('public'));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
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

app.get('/' , async function (req, res, next) {
    res.status(200).json({
        message: 'success',
        results: 'API work fine!'
    });
});

app.get('/getFaculty', async function (req, res, next) {
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
    var pass = createHash('sha256').update(req.body.password).digest('base64');

    var query = `select karaoke.AdminLogin('${req.body.username}','${pass}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error', error: err});
        else if (results.rows[0].login != null)    
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
// var pass = createHash('sha256').update('1234').digest('base64');
