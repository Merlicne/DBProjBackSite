

var OTP_collection = [];

var OTP_holding = (req,res,next) => {
    var OTP_data = {
        email: res.locals.email,
        OTP: res.locals.otp,
        time: new Date().getTime()
    }
    OTP_collection.push(OTP_data);
    console.log(OTP_collection);
}

var OTP_check = (req,res,next) => {
    var OTP = req.body.otp;
    var email = req.body.email;

    var index = OTP_collection.findIndex((element) => {
        return element.email == email;
    });

    if(OTP == null) {
        res.status(400).json({message: 'error', 'error': 'OTP or email is missing'});
    }
    else if(OTP_collection[index].OTP != OTP) {
        res.status(400).json({message: 'error', 'error': 'OTP is incorrect'});
    }
    else if(new Date().getTime() - OTP_collection[index].time > 1000 * 60 * 1) {
        res.status(400).json({message: 'error', 'error': 'OTP is expired'});
    }
    else {
        OTP_collection.splice(index,1);
        next();
    }
}

exports.OTP_holding = OTP_holding;
exports.OTP_check = OTP_check;