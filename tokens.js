const config = require('config'),
      jwt = require('jsonwebtoken'),
      redis = require('redis');


const access_ttl = 60*30; //30m
const refresh_ttl = 60*60*24*7; //1w

const token_issuer = config.get('app.name');
const jwt_secret = config.get('jwt_secret');

function createToken(payload, ttl) {
     
    
    return jwt.sign(payload, jwt_secret, {expiresIn: ttl, algorithm: "HS256"});
    
}



function createAccessToken(userid, refresh_jti) {
    const payload = {
        iss: token_issuer,
        userid: userid,
        rjti: refresh_jti
    };
    return createToken(payload, access_ttl);
}



function logToken(jti) {
    const client = redis.createClient();
    client.on("error", (err) => {
        console.log(err.message);
        //log error to some kind of db (later)
    });
    try {
        client.set(jti, " ", 'EX', refresh_ttl);

    }
    catch(err) {
        console.log(err.message);
        //log error
    }

    client.quit();
}

function createRefreshToken(userid, jti) {


    const payload = {
        jti: jti,
        iss: token_issuer,
        userid: userid
    };

    const token = createToken(payload, refresh_ttl);
    logToken(jti);

    return token;
}


function verifyToken(token) {
    
    return jwt.verify(token, jwt_secret, {algorithm: "HS256"})
}

function tokenRegion(jti, callback){
    const client = redis.createClient();
    client.on("error", (err) => {
        console.log(err.message);
        //log error to some kind of db (later)
    });
    client.get(jti, callback);

    client.quit();
}


module.exports.createAccessToken = createAccessToken;
module.exports.createRefreshToken = createRefreshToken;
module.exports.createToken = createToken;
module.exports.verifyToken = verifyToken;
module.exports.issuer = token_issuer;
module.exports.tokenRegion = tokenRegion;