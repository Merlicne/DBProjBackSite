const pool = require('./db');

var connection = pool;

module.exports = async (req,res) => {
    // console.log(`get history`);  
    connection.query(`select * from karaoke.reservhistory('${req.body.phone}'::text) where status_id = 2 or status_id = 3;`, function(err, results) {
        if(err)
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        }
        else if(results.rows.length != 0) res.status(200).json({
            message: 'success',
            results: results.rows
        })
        else {
            res.status(500).json({
                message: 'fail',
                results: err
            });
        }
        ;
    });

}