const pool = require('./db');
var connection = pool;
connection.connect(async function(err) {
    if (err) console.log(err,"\n\n database Failed to connect!");
});

module.exports = async function (req, res, next) {
    var query = `select * from karaoke.res_detail(${req.query.id});`;
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