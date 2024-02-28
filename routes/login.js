const jwt = require('jsonwebtoken');
const pool = require('./db');
const { createHash } = require('crypto');

var connection = pool;
connection.connect(async function(err) {
    if (err) console.log(err,"\n\n database Failed to connect!");
});

module.exports = async (req,res,next) => {
    const {username, password} = req.body;
    var pass = createHash('sha256').update(password).digest('base64');

    var query = `select karaoke.AdminLogin('${username}','${pass}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error', error: err});
        else if (results.rows[0].adminlogin != null){  

            const token = jwt.sign({username, password}, process.env.JWT_SECRET, {expiresIn: '7d'});

            res .cookie('token', token, {httpOnly: true})
                .status(200)
                .json({  
                message: 'success',
                results: results.rows
                });}
        else
            res.status(200).json({  
                message: 'login_fail'
            });
    });


}

/*
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
*/

