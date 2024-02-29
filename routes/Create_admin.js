const pool = require('../db');
const { createHash } = require('crypto');
var connection = pool;

module.exports = async (req,res,next) => {
    var {username, password} = req.body;
    password = createHash('sha256').update(password).digest('base64');
    var query = `select karaoke.add_admin_account('${username}'::text,'${password}'::text)`;
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
}