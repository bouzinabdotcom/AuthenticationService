const express = require('express'),
      router = new express.Router(),
      tokens = require('../tokens'),
      error = require('../error');



router.post('/', async (req, res)=> {

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

    await tokens.deleteToken(payload.jti);

    res.send('success');



});








module.exports = router;