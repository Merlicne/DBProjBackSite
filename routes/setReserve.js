const pool = require('./db');

var connection = pool;

module.exports = async (req, res) => {
    
    var query = `select karaoke.insertreserve('${req.body.phone}'::text, '${req.body.date}'::text, '${req.body.time}'::text, ${req.body.duration}::int2, '${req.body.roomname}'::text);`;
    // console.log(query);
    connection.query(query, function(err, results){
        if(err) {
            res.status(500).json({
            message : "error"
            // 'error':err
        }); console.log(err)}
        else 
        res.status(200).json({
            message: 'success',
            results: results.rows
        });
    console.log("book_success");
})
}