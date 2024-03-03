const pool = require('./db');
const { createHash } = require('crypto');
var connection = pool;

module.exports = async (req, res) => {
    var password = createHash('sha256').update(req.body.password).digest('base64');
    var query = `select karaoke.changepassword('${req.body.phone}'::text, '${password}'::text);`;
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
        else { // not found data
            res.status(500).json({
                message: 'fail'
                // results: `Not Found '${fact}'`
            });
            
        }

    });
}