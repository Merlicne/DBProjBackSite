
const pool = require('./db');

var connection = pool;

module.exports = async (req,res) => {
    var query = `select karaoke.cancel_reserve('${req.body.phone}'::text, ${req.body.res_id}::int8);`;

    connection.query(query, function(err, results){
        if(err) res.status(500).json({
            message : "error",
            error:err
        }) 
        else 
        res.status(200).json({
            message: 'success',
            results: results.rows
        });
    console.log("book_success");
    })
}