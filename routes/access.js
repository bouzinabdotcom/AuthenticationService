const express = require("express"),
      router = new express.Router(),
      {verifyToken, issuer} = require('../tokens'),
      error = require('../error');




    router.post("/", async (req, res) => {
        const access_token = req.header('x-auth-token');
        
        let payload;
        try {
            payload = verifyToken(access_token);
        }
        catch(err) {
            return res.status(400).send(error('InvalidToken', err.message));
        }

        const invalidToken = error('InvalidToken', "Token not valid for this application.");
        if(payload.iss !== issuer) {
            
            return res.status(400).send(invalidToken);
            
        }
        res.send({userid: payload.userid}); 


    });   



module.exports = router;
