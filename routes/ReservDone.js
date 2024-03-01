const pool = require('../db');
var connection = pool;

module.exports = async (req,res,next) => {
    var query = `select karaoke.update_res_status(${req.query.res_id}::int8,3::int2);`;
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