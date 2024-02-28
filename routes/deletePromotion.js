const pool = require('../db');
const mailSender = require('../mailSender');
var connection = pool;

module.exports =  async function (req, res, next) {
    var query = `select karaoke.delete_promotion(${req.query.id}::int2);`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    {
            // mailSender.sendMail(result, 'You have deleted a promotion');
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
        }
    });
}