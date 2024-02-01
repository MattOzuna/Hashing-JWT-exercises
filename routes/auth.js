
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
    const{username, password, first_name, last_name, phone} = req.body
    const user = await User.register(username, password, first_name, last_name, phone)
    const token = jwt.sign({ username: user.username }, SECRET_KEY)
    return res.json(token)
} catch(err){
    return next(err)
}


})

router.post('/register', (req,res,next) => {
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */



})