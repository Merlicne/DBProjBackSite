const pool = require('../db');
var connection = pool;

module.exports =  async function (req, res, next) {
    var query = `select * from karaoke.getAvaPromo();`;
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