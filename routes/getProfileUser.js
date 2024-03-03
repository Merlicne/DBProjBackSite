const pool = require('./db');

var connection = pool;

module.exports = async  (req,res) => {
    // console.log(`show profile ${++req_count}`);  
    connection.query(`select * from karaoke.getProfileUser('${req.body.phone}'::text);`, function(err, results) {
        if(err) res.status(500).json({
            message: 'fail',
            error:err
        }) 
        else if(results.rows[0] != null)
            res.status(200).json({
        
                message: 'success',
                results: results.rows
        });
        else{ // not found data
            res.status(404).json({
                message: 'fail'
                // results: `Not Found '${fact}'`
            });
            
        }
    });

}