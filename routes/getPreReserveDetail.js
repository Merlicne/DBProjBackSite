const { response } = require('express');
const pool = require('./db');

var connection = pool;

const checkTimeslot = (req, res, next) => {
    var query = `select 1 from karaoke.check_timeslot('${req.body.date}'::text, '${req.body.time}'::text, ${req.body.duration}::int2, '${req.body.roomname}'::text)`
    connection.query(query, function(err, results) {
        if( err ) {
            console.log("check timeslot");
            res.status(500).json({
                message : 'error',
                error : err
            }) 
        } 
        else if (results.rows.length == 0) {
            next();
        }
        else {
            res.status(400).json({
                message : 'time unavaliable'
            })
        }
    })
}

const getPromoDiscount = (req, res, next) => {
    var query = `select karaoke.getDiscount('${req.body.phone}'::text, ${req.body.duration}::int2)`
    connection.query(query, function(err, results) {
        if( err ) {
            console.log("getPromoDiscount");
            res.status(500).json({
                message : 'error',
                error : err
            }) 
        } 
        else {
            res.locals.discount = results.rows[0].getdiscount;
            next();
        }

    })

}

const getTotalprice = (req, res, next) => {
    var query = `select karaoke.getPrice('${req.body.phone}'::text)`
    connection.query(query, function(err, results) {
        if( err ) {
            console.log("getTotalprice");
            res.status(500).json({
                message : 'error',
                error : err
            }) 
        } 
        else {
            res.status(200).json({
                message : 'success',
                results : [{
                    "discount" : res.locals.discount,
                    "total_price" : results.rows[0].getprice * req.body.duration
                }]
            })
        }

    })

}

exports.checkTimeslot = checkTimeslot;
exports.getPromoDiscount = getPromoDiscount;
exports.getTotalprice = getTotalprice;
