const pool = require('./db');

var connection = pool;

module.exports = async (req,res) => {
    // console.log(`avaliable_time `);  
    var query = `select * from karaoke.reservebyroom('${req.query.date}'::text, '${req.query.room}'::text);`;
    connection.query(query, function(err, results) {
        if(err)
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        }
        else if(results.length != 0) res.status(200).json({
            message: 'success',
            results: results.rows
        });

    });
}