const express = require('express'),
      router = new express.Router(),
      {verifyToken, issuer, tokenRegion, createAccessToken} = require('../tokens'),
      error = require('../error');





router.post('/', (req, res) => {
    //1- validate refresh token
    let payload;
    try{
        payload = verifyToken(req.header('x-refresh-token'));
    }
    catch(err) {
        return res.status(400).send(error('InvalidToken', err.message));
    }

    const invalidToken = error('InvalidToken', "Token not valid for this application.");
    if(payload.iss !== issuer) {
        
        return res.status(400).send(invalidToken);
        
    }
    let tokenWhitelisted;
    let tRegion;

    //2- validate whitelist and region to implement later
    // console.log(payload);
    tokenRegion(payload.jti, (err, region)=>{
        if(err || region===null) return tokenWhitelisted = false;
        
        tokenWhitelisted = true;
        return tRegion=region;
    });
    const invalidTokenLocation = error('InvalidTokenLocation', "Token not valid at your location.");
    
    if(tokenWhitelisted === false) return res.status(400).send(invalidToken);
    console.log(payload.jti)
    //3- issue new token
    const accessToken = createAccessToken(payload.userid, payload.jti);
    res.send({accessToken: accessToken});

});




module.exports = router;