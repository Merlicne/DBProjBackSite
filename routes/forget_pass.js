const pool = require('../db');
const mailSender = require('../mailSender');
var connection = pool;

const randomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000) % 1e6;
}

module.exports = async function (req, res, next) {
    var query = `select * from karaoke.search_adminemail('${req.body.email}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else if (results.rows[0].search_adminemail.length == 0) { {
            res.status(200).json({
                message: 'no email found',
                results: results.rows
            });
        }}
        else {
            let otp = randomOTP()
            mailSender(req.body.email, otp,     
                (err, data) => {
                    res.status(500).json({message: 'error','error': err});
                });
            res.locals.email = req.body.email;
            res.locals.otp = otp;
            next();
            res.status(200).json({
                message: 'success',
                results: results.rows
            });
        }
    })};