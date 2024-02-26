const express = require('express');
const { get } = require('http');
const mysql = require('mysql2');
const path = require('path');
const {Client} = require('pg')
const {createHash}  = require('crypto')

// Connect to MySQL Database
{
    var connection = new Client({
        // host: '127.0.0.1',//0.tcp.ap.ngrok.io:13717
        // port: 5555,
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: 5432,
        user: 'postgres.olictqjkgtdtndbkephu',
        password: 'DBProjLocalDBServerPass_555',
        database: 'postgres'
    });

    
    
    connection.connect(function(err) {
        if (!err) console.log("Connected!");
        else console.log(err);
    });
}





// Create a new express application instance
{
    var app = express();
    app.use(express.static('public'));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// init error handling
// {
//     app.all('*', (req, res, next) => {
//         let err = new Error(`Can't find ${req.originalUrl} on this server!`);
//         err.status = 'fail';
//         err.statusCode = 404;
//         next(err);
//     });
    
//     app.use((err, req, res, next) => {
//         err.statusCode = err.statusCode || 500;
//         err.status = err.status || 'error';
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message
//         });
//     });
// }


var req_count = 0;
app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'html_lake/Docs.html'));
});

// done
app.get('/getFaculty', (req, res) => {
    console.log(`getFaculty ${++req_count}`);

    // get all faculty
    connection.query(`select karaoke.getAllFaculty();`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results.rows
    });
    });
});



// done
app.get('/getFaculty/:Fact_En', (req, res) => {
    let fact = req.params.Fact_En.toLowerCase();
    console.log(fact + ` ${++req_count}`);

    
    // get faculty by acronym
    connection.query(`select karaoke.getFacultyByAcro ('${fact}')`, function(err, results) {
        if(err) // there is an error
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        } // successfully get data
        else if(results.length != 0) res.status(200).json({
            message: 'success',
            results: results.rows
        });
        else{ // not found data
            res.status(404).json({
                message: 'fail',
                results: `Not Found '${fact}'`
            });
            
        }
    });
});


app.get('/getStatus', (req, res) => {
    console.log(`getStatus ${++req_count}`);   
    // get all status
    connection.query(`SELECT * FROM res_status`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results
        });
    });
});


app.get('/getRoom', (req, res) => {
    console.log(`getRoom ${++req_count}`);

    // get all room
    connection.query(`call getAllRoom()`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results[0]
    });
    });
});


// done
app.post("/book_success", express.json(), (req, res) => {
    console.log("book_success ${++req_count}");
    connection.query(`SELECT karaoke.insertReserve('${req.body.user_phone}'::text, ${req.body.room_id}::int2, ${req.body.duration}::int2, to_timestamp('${req.body.datetime}','YYYY-MM-DD HH24:MI')::timestamp);`
    , function(err, results){
        if(err) res.status(500).json({
            error:err
        }) 
        else 
        res.status(200).json({
            message: 'success',
            results: results.rows
        });
})
});



app.get('/landing_page', (req,res) => {
    console.log(`landing_page ${++req_count}`);  
    connection.query(`select * from karaoke.reserved('now')`, function(err, results) {
        res.status(200).json({
            message: 'success',
            results: results.rows
        });
    });

});

app.get('/getAvaliable', (req,res) => {
    console.log(`avaliable_time ${++req_count}`);  
    connection.query(`select * from karaoke.reserv_filter_dashboard('${req.query.date}');`, function(err, results) {
        if(err)
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        }
        else if(results.length != 0) res.status(200).json({
            message: 'success',
            results: results.rows
        });
    });

});


app.get('/getHistory', (req,res) => {
    console.log(`get history ${++req_count}`);  
    connection.query(`select * from karaoke.reservhistory('${req.query.phone}'::text) where status_id = 2 or status_id = 3;`, function(err, results) {
        if(err)
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        }
        else if(results.length != 0) res.status(200).json({
            message: 'success',
            results: results.rows
        });
    });

});

app.get('/getRecentReserve', (req,res) => {
    console.log(`get history ${++req_count}`);  
    connection.query(`select * from karaoke.reservhistory('${req.query.phone}'::text) where status_id = 1;`, function(err, results) {
        if(err)
        {
            res.status(404).json({
                message: 'fail',
                results: err
            });
        }
        else if(results.length != 0) res.status(200).json({
            message: 'success',
            results: results.rows
        });
    });

});




app.post("/signup_new_customer", express.json(), (req, res) => {
    console.log(`sign up ${++req_count}`); 

    var pass = createHash('sha256').update(req.body.password).digest('base64');

    if (req.body.fact_id != null )
        var query = `select * from karaoke.customerRegist_cus(
            '${req.body.fname}'::text, 
            '${req.body.lname}'::text, 
            '${req.body.phone}'::text, 
            '${req.body.fact_id}'::int2,
            '${req.body.email}'::text, 
            '${pass}'::text
        );`
    else 
        var query = `select * from karaoke.customerRegist_cus(
            '${req.body.fname}'::text, 
            '${req.body.lname}'::text, 
            '${req.body.phone}'::text, 
            ${req.body.fact_id}::int2,
            '${req.body.email}'::text, 
            '${pass}'::text
        );`

    connection.query(query, function(err, results){
        if(err) res.status(500).json({
            message: 'fail can not register',
            error:err
        }) 
        else 
        res.status(200).json({
            message: 'success',
            results: results.rows
        });
})
});





app.post('/login', express.json(), async function (req, res, next) {
    console.log(`login ${++req_count}`);  
    var pass = createHash('sha256').update(req.body.password).digest('base64');

    var query = `select * from karaoke.customerLogin('${req.body.phone}','${pass}');`;
    connection.query(query, function (err, results) {
        if (err) 
            res.status(500).json(
                {message: 'error', error: err});
        else if (results.rows[0].login != null)    
            res.status(200).json({  
                message: 'success',
                results: results.rows
            });
        else
            res.status(200).json({  
                message: 'login_fail',
                results: results.rows
            });
    });

});

