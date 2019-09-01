const config = require('config'),
      jwt = require('jsonwebtoken'),
      redis = require('redis'),
      getIpRegion = require('./ip2region');


const access_ttl = 60*30; //30m
const refresh_ttl = 60*60*24*5; //5d

function createToken(payload, ttl) {
    const secret = config.get('jwt_secret');
    if(ttl) {
        return jwt.sign(payload, secret, {expiresIn: ttl, algorithm: "HS256"});
    }
    //if ttl isn't provided it means we're creating an id token 
    return jwt.sign(payload);
}

function createIdToken(user) {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email.address,
        privilege: user.privilege
    };
    return createToken(payload);
}

function createAccessToken(user, ip, refresh_jti) {
    const payload = {
        aud: ip,
        iss: config.get('app.name'),
        userid: user._id,
        rjti: refresh_jti
    };
    return createToken(payload, access_ttl);
}



function logToken(jti, region) {
    const client = redis.createClient();
    client.on("error", (err) => {
        console.log(err.message);
        //log error to some kind of db (later)
    });
    client.set(jti, region, 'EX', refresh_ttl, client.quit);
}

function createRefreshToken(user, ip, jti) {

    const region = getIpRegion(ip);

    const payload = {
        jti: jti,
        aud: ip,
        iss: config.get('app.name'),
        userid: user._id
    };

    const token = createToken(payload, refresh_ttl);
    logToken(jti, region);

    return token;
}

module.exports.createAccessToken = createAccessToken;
module.exports.createIdToken = createIdToken;
module.exports.createRefreshToken = createRefreshToken;