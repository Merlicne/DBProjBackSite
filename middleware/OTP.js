

var OTP_collection = [];

var OTP_holding = (req,res,next) => {
    var OTP_data = {
        email: res.locals.email,
        OTP: res.locals.otp,
        time: new Date().getTime()
    }
    var email = res.locals.email;
    var index = OTP_collection.findIndex((element) => {
        return element.email == email && new Date().getTime() - element.time < 1000 * 60 * 5;
    });
    if(index != -1) {
    OTP_collection[index] = OTP_data;
    console.log(OTP_collection);
    }else {
        OTP_collection.push(OTP_data);
        console.log(OTP_collection);
    }
};

var OTP_check = (req,res,next) => {
    var OTP = req.body.otp;
    var email = req.body.email;
    console.log(OTP);
    console.log(email);
    if(OTP == null || email == null) {
        res.status(400).json({message: 'error', 'error': 'OTP or email is missing'});
    }

    var index = OTP_collection.findIndex((element) => {
        return element.email == email;
    });

    if(index == -1) {
        res.status(400).json({message: 'error', 'error': 'OTP is not found'});
    }
    
    var otp;
    try {
        otp = OTP_collection[index].OTP;
    }
    catch(err) {
        res.status(400).json({message: 'error', 'error': 'OTP was used'});
    }

    if(otp != OTP) {
        res.status(403).json({message: 'error', 'error': 'OTP is incorrect'});
    }
    else if(new Date().getTime() - OTP_collection[index].time > 1000 * 60 * 5) {
        res.status(408).json({message: 'error', 'error': 'OTP is expired'});
    }
    else {
        OTP_collection.splice(index,1);
        res.status(200).json({message: 'success'});
    }
}

exports.OTP_holding = OTP_holding;
exports.OTP_check = OTP_check;