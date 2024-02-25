const express = require('express');
const { get } = require('http');
const path = require('path');
const {Client} = require('pg')

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


