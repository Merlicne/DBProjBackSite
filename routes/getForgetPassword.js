const pool = require('./db');
const mailSender = require('../middleware/mailSender');
var connection = pool;

const randomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000) % 1e6;
}

module.exports = async (req,res, next) => {

    var query = `select karaoke.check_forget_pass('${req.body.phone}'::text);`;
    
    connection.query(query, function(err, results) {
        if(err) res.status(500).json({
            message: 'fail',
            error:err
        }) 
        else if (results.rows[0].check_forget_pass.length == 0) { {
            res.status(200).json({
                message: 'no email found',
                results: results.rows
            });
        }}
        else {
            let otp = randomOTP()
            res.locals.phone = req.body.phone;
            res.locals.otp = otp;
            console.log()
            var mailError;
            mailSender(results.rows[0].check_forget_pass, otp,     
                (err, data) => {
                    mailError = err;
                });
                
            if (!mailError) {
                next();
                res.status(200).json({
                    message: 'success',
                    results: results.rows
                });
            }
            else {
                res.status(500).json({
                    message: 'error',
                    results: mailError
                });
            }
        }
    });
    

}