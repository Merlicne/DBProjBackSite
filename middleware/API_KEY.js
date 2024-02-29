const pool = require('../db');
const {createHash} = require('crypto');
var connection = pool;

const API_KEY = (req,res,next) => {
    try {
        var key = req.body.key;
    }
    catch (e) {
        var key = req.query.key;
    }

    // console.log(key);
    var query = `select * from karaoke.api_key_check('${key}')`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error','error': err});
        else    
            if(results.rows[0].api_key_check == 'found') {
                next();
            }else if(results.rows[0].api_key_check == 'not_found'){
                res.status(401).json({message: 'Invalid API Key'});
            }else if(results.rows[0].api_key_check == 'token_expired'){
                res.status(401).json({message: 'API Key Expired'});
            }
    });
}

const KEY_GENERATOR = (req,res) => {
    let username = req.body.username
    const key = Math.random().toString(36);
    let hash = createHash('sha256').update(key+username).digest('hex');
    var query = `select karaoke.append_key('${username}','${hash}')`;
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