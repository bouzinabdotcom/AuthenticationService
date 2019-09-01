const express = require('express'),
      router = new express.Router(),
      {User} = require('../user'),
      error = require('../error'),
      bcrypt = require('bcrypt'),
      _ = require('lodash'),
      {ipFormat4} = require('../ip2region'),
      uniqid = require('uniqid'),
      {createIdToken, createAccessToken, createRefreshToken} = require('../tokens');



router.post('/', async (req, res) => {

    const client_ip = ipFormat4(req.clientIp);

    let user;
    try {
        user = await User.findOne({username: req.body.username});
    }
    catch(err) {
        return res.status(500).send(error("Database Problem", "Something went wrong."));
        //Log real error message here.
    }

    const authError = error("Authentication Error", "Username or Password incorrect.");
    if(!user) return res.status(400).send(authError);
    
    const pwdIsValid = await bcrypt.compare(req.body.pwd, user.pwd);
    if(!pwdIsValid) return res.status(400).send(authError);

    user = _.omit(user, "pwd");

    const rjti = uniqid();


    const itoken = createIdToken(user);
    const atoken = createAccessToken(user, client_ip, rtji);
    const rtoken = createRefreshToken(user, client_ip, rjti);

    res.send({
        id: itoken,
        access: atoken,
        refresh: rtoken
    });
});





module.exports = router;