const pool = require('./db');
const {createHash}  = require('crypto')

var connection = pool;

module.exports = async (req, res) => {
    // console.log(`sign up ${++req_count}`); 

    var pass = createHash('sha256').update(req.body.password).digest('base64');


    var query = `select * from karaoke.customerRegist_cus(
        '${req.body.fname}'::text, 
        '${req.body.lname}'::text, 
        '${req.body.phone}'::text, 
        ${req.body.fact_id}::int2,
        '${req.body.email}'::text, 
        '${pass}'::text
    );`

    connection.query(query, function(err, results){
        if(err) res.status(500).json({
            message: 'fail can not register',
            error:err
        }) 
        else if(results.rows[0].customerregist_cus != null)
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
})
}