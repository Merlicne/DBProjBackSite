const pool = require('./db');

var connection = pool;

module.exports = async (req, res) => {
    // console.log(`landing_page`);  
    
    connection.query(`select * from karaoke.getallreserve('now'::text, 'allroom'::text);`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results.rows
        });
    });

}