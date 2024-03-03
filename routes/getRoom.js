const pool = require('./db');

var connection = pool;

module.exports = async (req, res) => {
    // console.log(`getRoom ${++req_count}`);

    // get all room
    connection.query(`select * from karaoke.getRoom()`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results.rows
    });
    });
}