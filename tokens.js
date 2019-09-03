const config = require('config'),
      jwt = require('jsonwebtoken'),
      redis = require('redis');


const access_ttl = 60*30; //30m
const refresh_ttl = 60*60*24*7; //1w

function createToken(payload, ttl) {
    const secret = config.get('jwt_secret');
    
    
    return jwt.sign(payload, secret, {expiresIn: ttl, algorithm: "HS256"});
    
}



function createAccessToken(userid, refresh_jti) {
    const payload = {
        iss: config.get('app.name'),
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
        client.set(jti, " ", 'EX', refresh_ttl, client.quit);
    }
    catch(err) {
        console.log(err.message);
        //log error
    }
}

function createRefreshToken(userid, jti) {


    const payload = {
        jti: jti,
        iss: config.get('app.name'),
        userid: userid
    };

    const token = createToken(payload, refresh_ttl);
    logToken(jti);

    return token;
}

module.exports.createAccessToken = createAccessToken;
module.exports.createRefreshToken = createRefreshToken;
module.exports.createToken = createToken;