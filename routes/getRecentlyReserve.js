const pool = require('./db');

var connection = pool;

module.exports = async (req,res) => {
    // console.log(`get history `);  

    var query = `select * from
        (select distinct on (res_id) * from karaoke.reservhistory('${req.body.phone}'::text) 
        order by res_id, status_id desc) as subquery
        where status_id = 1
    ;`;
    
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
        else{ // not found data
            (results.length != 0) ({
                message: 'fail'
                // results: `Not Found '${fact}'`
            });
            
        }
    });

}