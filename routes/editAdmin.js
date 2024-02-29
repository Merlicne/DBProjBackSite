const pool = require('../db');
var connection = pool;


module.exports = async (req,res,next) => {
    var {username, fname, lname} = req.body;
    var query = `select * from karaoke.edit_profile_admin('${username}','${fname}','${lname}')`;
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