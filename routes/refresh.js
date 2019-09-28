const express = require('express'),
      router = new express.Router(),
      tokens = require('../tokens'),
      error = require('../error');





router.post('/', async (req, res) => {
    //1- validate refresh token
    let payload;
    try{
        payload = tokens.verifyToken(req.header('x-refresh-token'));
    }
    catch(err) {
        return res.status(400).send(error('InvalidToken', err.message));
    }

    const invalidToken = error('InvalidToken', "Token not valid for this application.");

    

    if(!tokens.verifyRefreshPayload(payload) || payload.iss !== tokens.issuer) {
        
        return res.status(400).send(invalidToken);
        
    }
    
    

    //2- validate whitelist and region to implement later
    // console.log(payload);

    const region = await tokens.tokenRegion(payload.jti);
    const invalidTokenLocation = error('InvalidTokenLocation', "Token not valid at your location.");
    
    
    
    if(region == null) return res.status(400).send(invalidTokenLocation);

    //3- issue new token
    const accessToken = tokens.createAccessToken(payload.userid, payload.jti);
    res.send({access: accessToken});

});




module.exports = router;