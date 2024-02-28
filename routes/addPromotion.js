const pool = require('./db');
var connection = pool;
connection.connect(async function(err) {
    if (err) console.log(err,"\n\n database Failed to connect!");
});

module.exports = async function (req, res, next) {
    var query = `select karaoke.add_promotion('${req.body.promotion_name}', ${req.body.type_id}::int2,${req.body.condition}::int2,${req.body.discount}::int2,'${req.body.start}','${req.body.end}');`;
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