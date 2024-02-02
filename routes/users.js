const express = require("express");
const router = new express.Router();
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressError = require('../expressError');
const {authenticateJWT, ensureLoggedIn, ensureCorrectUser} = require('../middleware/auth')


router.get('/', authenticateJWT, ensureLoggedIn, async (req,res,next) => {
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
    try {
        const users = await User.all()
        return res.json({ users })
    } catch(err){
        return next(err)
    }
})


router.get('/:username', authenticateJWT, ensureLoggedIn, ensureCorrectUser, async (req, res, next) =>{
/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
    try{
        const user = await User.get(req.user.username)
        return res.json(user)
    } catch(err){
        return next(err);
    }
})

router.get('/:username/to', authenticateJWT, ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
    try{
        const messages = await User.messagesTo(req.user.username)
        return res.json({messages})
    } catch(err){
        return next(err)
    }
})


router.get('/:username/from', authenticateJWT, ensureLoggedIn, ensureCorrectUser, async (req, res,next) =>{
/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
    try{
        const messages = await User.messagesFrom(req.user.username)
        return res.json({messages})
    }catch(err){
        return next(err)
    }
})


module.exports = router;