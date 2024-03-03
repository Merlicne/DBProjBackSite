const pool = require('./db');
const {createHash}  = require('crypto')

var connection = pool;

module.exports = async function (req, res, next) {
    // console.log(`login`);  
    var pass = createHash('sha256').update(req.body.password).digest('base64');

    var query = `select * from karaoke.customerLogin('${req.body.phone}','${pass}');`;
    connection.query(query, function (err, results) {
        if(err) res.status(500).json({
            message: 'fail',
            error:err
        }) 
        else if(results.rows[0].customerlogin != null) {

            next();

            res.status(200).json({
                message: 'success',
                results: results.rows,
                key : res.locals.key
            });
        }
        else{ // not found data
            res.status(404).json({
                message: 'fail'
                // results: `Not Found '${fact}'`
            });
            
        }
        
    });

}