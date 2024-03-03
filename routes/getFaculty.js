const pool = require('./db');

var connection = pool;

module.exports = async (req, res) => {
    // console.log(`get Faculty`);

    connection.query(`select * from karaoke.getAllFaculty();`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results.rows
        });
    });
}