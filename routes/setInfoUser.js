const pool = require('./db');

var connection = pool;

module.exports = async (req,res) => {
    // console.log(`change info`);  

    var query = `select karaoke.changedata('${req.body.phone}'::text, '${req.body.fname}'::text, '${req.body.lname}'::text, ${req.body.fact_id}::int2);`;
    
    connection.query(query, function(err, results) {
        if(err) res.status(500).json({
            message: 'fail, user not found',
            // error:err
            // , results : results[0]
        }) 
        else if(results.rows[0] != null)
            res.status(200).json({
                message: 'success'
                // results: results.rows
                
        });
        else{ // not found data
            res.status(404).json({
                message: 'not found'
                // , results: results.rows 
            });
            
        }
    });

}