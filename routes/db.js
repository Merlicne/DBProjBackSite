const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.data_base_port
});
pool.connect(async function(err) {
    if (err) console.log(err,"\n\n database Failed to connect!");
    else console.log("Connected to database");
});

module.exports = pool;