const pool = require('../routes/db');
const {createHash} = require('crypto');
var connection = pool;

const API_KEY = (req,res,next) => {
    try {
        var key = req.body.key;
    }
    catch (e) {
        var key = req.query.key;
    }

    var query = `select * from karaoke.api_key_check_cust('${key}')`;
    // console.log(query);

    connection.query(query, function (err, results) {
        // console.log(err);
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            if(results.rows[0].api_key_check_cust == 'found') {
                // console.log('arai gor dai');
                next();
            }else if(results.rows[0].api_key_check_cust == 'not_found'){
                res.status(401).json({
                    message: 'Invalid API Key'
                });
            }else if(results.rows[0].api_key_check_cust == 'token_expired'){
                res.status(401).json({
                    message: 'API Key Expired'
                });
            }
    });
}

const KEY_GENERATOR = (req,res) => {
    let username = req.body.phone
    const key = Math.random().toString(36);
    let hash = createHash('sha256').update(key+username).digest('hex');
    var query = `select karaoke.append_cust_key('${username}','${hash}')`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else{
            // console.log(hash);
        }
    });
    res.locals.key = hash;  
}


exports.API_KEY = API_KEY;
exports.KEY_GENERATOR = KEY_GENERATOR;