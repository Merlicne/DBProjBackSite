const express = require('express');
const mysql = require('mysql2');
const path = require('path');

// Connect to MySQL Database
{
    var connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'admin',
        password: 'DBProjLocalDBServerPass_555',
        database: 'dbfinalproj',
        port: 5555
    });
    
    connection.connect(function(err) {
        if (!err) console.log("Connected!");
        else console.log("Connection Failed!");
    });
}





// Create a new express application instance
{
    var app = express();
    app.use(express.static('public'));
    const PORT = process.env.PORT || 8000;
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



app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'html_lake/Docs.html'));
});


app.get('/getFaculty', (req, res) => {
    connection.query(`call getFaculty()`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results[0]
    });
    });
});
app.get('/getRoom', (req, res) => {
    connection.query(`call getAllRoom()`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results[0]
    });
    });
});

app.get('/getFaculty/:Fact_En', (req, res) => {
    let fact = req.params.Fact_En.toLowerCase();
    console.log(fact);
    connection.query(`call getFacultyByAcro('${fact}')`, function(err, results) {
        if(err)
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        }
        else if(results[0].length != 0) res.status(200).json({
            message: 'success',
            results: results[0]
        });
        else{
            res.status(404).json({
                message: 'fail',
                results: `Not Found '${fact}'`
            });

        }
    });
});
app.get('/getStatus', (req, res) => {
    connection.query(`SELECT * FROM reserve_status`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results[0]
    });
    });
});
app.get('/getAllTable', (req, res) => {
    connection.query(`Show tables`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results[0]
    });
    });
});
app.post('/CustomerRegis',express.json,(req,res,next) => {
    console.log(req.body);
    connection.query(`INSERT INTO customer (Cus_Id, Cus_Name, Cus_Email, Cus_Phone, Cus_Password) VALUES ('${req.body.Cus_Id}', '${req.body.Cus_Name}', '${req.body.Cus_Email}', '${req.body.Cus_Phone}', '${req.body.Cus_Password}')`, function(err, results) {
        if(!err) res.status(200).json({
            message: 'success',
            results: results[0]
        });
        else{
            res.status(404).json({
                message: 'fail',
                results: err
            });
        };
    });
});


