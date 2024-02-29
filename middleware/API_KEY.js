const API_COLLECTION = []

const API_KEY = (req,res,next) => {
    try {
        var key = req.body.key;
        console.log('body');
    }
    catch (e) {
        var key = req.query.key;
        console.log('params',e);
    }

    console.log(key);

    let index = API_COLLECTION.findIndex(x => x.key == key);
    console.log(index);
    if(index == -1) {
        res.status(401).json({message: 'Unauthorized'});
    } else if(API_COLLECTION[index]['time'] - new Date().getTime() > 1000 * 60 * 60 * 24) {
        res.status(401).json({message: 'Token Expired'});
    }
    else {
        next();
    }
}

const KEY_GENERATOR = (req,res) => {
    const key = Math.random().toString(36).substring(7);
    let username = req.body.username
    let index = API_COLLECTION.findIndex(x => x.username === username);
    if(index == -1) {
        API_COLLECTION.push({username: username, key: key, time: new Date().getTime()});
        console.log(API_COLLECTION);
        res.locals.key = key;
    }else {
        API_COLLECTION[index]['key'] = key;
        API_COLLECTION[index]['time'] = new Date().getTime();
        console.log(API_COLLECTION);
        res.locals.key = key;
    }
}
exports.API_KEY = API_KEY;
exports.KEY_GENERATOR = KEY_GENERATOR;