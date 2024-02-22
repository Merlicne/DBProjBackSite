const express = require('express');
const { get } = require('http');
const mysql = require('mysql2');
const path = require('path');

// Connect to MySQL Database
{
    var connection = mysql.createConnection({
        // host: '127.0.0.1',//0.tcp.ap.ngrok.io:13717
        // port: 5555,
        host: '0.tcp.ap.ngrok.io',
        port: 10375,
        user: 'server',
        password: 'server1234',
        database: 'dbfinalproj'
    });
    
    connection.connect(function(err) {
        if (!err) console.log("Connected!");
        else console.log("Connection Failed");
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
    app.listen(PORT, () => {
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


var req_count = 0;
app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'html_lake/Docs.html'));
});


app.get('/getFaculty', (req, res) => {
    console.log(`getFaculty ${++req_count}`);

    // get all faculty
    connection.query(`call getAllFaculty()`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results[0]
    });
    });
});



app.get('/getFaculty/:Fact_En', (req, res) => {
    let fact = req.params.Fact_En.toLowerCase();
    console.log(fact + ` ${++req_count}`);

    
    // get faculty by acronym
    connection.query(`call getFacultyByAcro('${fact}')`, function(err, results) {
        if(err) // there is an error
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        } // successfully get data
        else if(results[0].length != 0) res.status(200).json({
            message: 'success',
            results: results[0]
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


// unfinish
app.post('/CustomerRegis',express.json,(req,res,next) => {
    // console.log(req.body);
    // connection.query(`INSERT INTO customer (Cus_Id, Cus_Name, Cus_Email, Cus_Phone, Cus_Password) VALUES ('${req.body.Cus_Id}', '${req.body.Cus_Name}', '${req.body.Cus_Email}', '${req.body.Cus_Phone}', '${req.body.Cus_Password}')`, function(err, results) {
    //     if(!err) res.status(200).json({
    //         message: 'success',
    //         results: results[0]
    //     });
    //     else{
    //         res.status(404).json({
    //             message: 'fail',
    //             results: err
    //         });
    //     };
    // });
});

app.get('/getRoom', (req, res) => {
    console.log(`getRoom ${++req_count}`);

    // get all room
    connection.query(`call getAllRoom()`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results[0]
    });
    });
});

