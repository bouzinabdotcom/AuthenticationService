const express = require('express'),
      router = new express.Router(),
      {User} = require('../user'),
      error = require('../error'),
      bcrypt = require('bcrypt'),
      _ = require('lodash'),
      uniqid = require('uniqid'),
      {createIdToken, createAccessToken, createRefreshToken} = require('../tokens');



router.post('/', async (req, res) => {
    
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


    const atoken = createAccessToken(user._id, rtji);
    const rtoken = createRefreshToken(user._id, rjti);

    res.send({
        access: atoken,
        refresh: rtoken,
        user: user
    });
});





module.exports = router;