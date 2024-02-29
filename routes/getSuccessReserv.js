const pool = require('../db');
var connection = pool;


module.exports = async (req,res,next) => {
    res.locals.status_id = 3;
    next();
}