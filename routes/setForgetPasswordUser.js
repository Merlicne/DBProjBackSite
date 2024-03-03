const pool = require('./db');
const { createHash } = require('crypto');
var connection = pool;

module.exports = async (req,res) => {
    // console.log(`change password ${++req_count}`);  

    var password = createHash('sha256').update(req.body.password).digest('base64');

    connection.query(`select karaoke.changepassword('${req.body.phone}'::text, '${password}'::text);`, function(err, results) {
        if(err) res.status(500).json({
            message: 'fail, user not found',
            // error:err
            // , results : results[0]
        }) 
        else if(results.rows[0] != null)
            res.status(200).json({
                message: 'success',
                results: results.rows
                
        });
        else{ // not found data
            res.status(404).json({
                message: 'not found'
                // , results: results.rows 
            });
            
        }
    });

}