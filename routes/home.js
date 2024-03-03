const pool = require('../db');

var connection = pool;

module.exports = async (req, res, next) => {
    // console.log(req.headers);
    var datetime = req.query.date;
    if (datetime == undefined || datetime.length == 0) datetime = 'now';
    var query = `select * from karaoke.reserv_filter_dashboard('${datetime}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
    });
}