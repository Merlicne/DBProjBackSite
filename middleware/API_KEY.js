const pool = require('../db');
const {createHash} = require('crypto');
const jwt = require('jsonwebtoken');
var connection = pool;

const API_KEY = (req,res,next) => {
    try {
        var key = req.headers['authorization'].split(' ')[1];
        if(!key || key == undefined) {  var key = req.body.key;
        }
    }
    catch (e) {
        var key = req.query.key;
    }
    jwt.verify(key, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({message: 'Invalid API Key'});
        }else{
            if(user){next();}else{res.status(401).json({message: 'Invalid API Key'});}
        }
    });
}

const KEY_GENERATOR = (req,res) => {
    let username = req.body.username
    var date = new Date();
    var token = jwt.sign({username: username,'date':date}, process.env.JWT_SECRET, {expiresIn: '1d'});
    res.locals.key = token;  
}


exports.API_KEY = API_KEY;
exports.KEY_GENERATOR = KEY_GENERATOR;