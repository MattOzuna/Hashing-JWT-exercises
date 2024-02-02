
const express = require("express");
const router = new express.Router();
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressError = require('../expressError')
const { SECRET_KEY } = require("../config");


router.post('/login', async (req,res,next) => {
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
    try{
    const {username, password} = req.body;
    const signedIn = await User.authenticate(username, password);
    if(signedIn){
        await User.updateLoginTimestamp(username);
        const token = jwt.sign({username}, SECRET_KEY);
        return res.json(token);
    }
    throw new expressError('invlaid username/password', 400)
    }catch(err){
        
        return next(err)
    }
})

router.post('/register', async (req,res,next) => {
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
    try{
        const user = await User.register(req.body)
        const token = jwt.sign({ username: user.username }, SECRET_KEY);
        return res.json(token);
    } catch(err){
        if (err.code === '23502'){
            return next(new expressError('missing parameters', 400))
        }
        if (err.code === '23505'){
            return next(new expressError(`${req.body.username} is already taken`, 400))
        }
        return next(err)
    }
})

module.exports = router;