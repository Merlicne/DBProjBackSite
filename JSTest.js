const express = require('express');
const mysql = require('mysql2');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'admin',
    password: 'DBProjLocalDBServerPass_555',
    database: 'dbproj',
    port: 5555
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});



let app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/getFaculty', (req, res) => {
    connection.query(`SELECT * FROM faculty`, function(err, results) {
        res.send(results);
    });
});

app.get('/getFaculty/:Fact_En', (req, res) => {
    connection.query(`SELECT * FROM faculty WHERE Fact_En = '${req.params.Fact_En}'`, function(err, results) {
        res.send(results);
    });
});
