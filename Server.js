const express = require('express');
const mysql = require('mysql2');
const path = require('path');






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




const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'html_lake/Docs.html'));
});


app.get('/getFaculty', (req, res) => {
    connection.query(`SELECT * FROM faculty`, function(err, results) {
        res.send(results);
    });
});

app.get('/getFaculty/:Fact_En', (req, res) => {
    let fact = req.params.Fact_En.toLowerCase();
    connection.query(`SELECT * FROM faculty WHERE Fact_En = '${fact}'`, function(err, results) {
        res.send(results);
    });
});
app.get('/getStatus', (req, res) => {
    connection.query(`SELECT * FROM reserve_status`, function(err, results) {
        res.send(results);
    });
});
app.get('/getAllTable', (req, res) => {
    connection.query(`Show tables`, function(err, results) {
        res.send(results);
    });
});
app.post('/CustomerRegis',express.json,(req,res,next) => {

});


