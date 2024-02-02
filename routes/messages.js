const express = require("express");
const router = new express.Router();
const Message = require('../models/message')
const expressError = require('../expressError');
const {authenticateJWT, ensureLoggedIn, ensurCorrectUserForMessage, ensurCorrectUserToReadMessage} = require('../middleware/auth');


router.get('/:id', authenticateJWT, ensureLoggedIn, ensurCorrectUserForMessage, async (req,res,next) => {
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
    try{
        return res.json({ message: req.message })
    } catch(err){
        return next(err)
    }

})


router.post('/', authenticateJWT, ensureLoggedIn, async (req,res,next) => {
/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
    try{
        const message = await Message.create(req.user.username, req.body.to_username, req.body.body)
        return res.json({message})
    }catch(err){
        console.log(err.code)
        if (err.code === '23502'){
            return next(new expressError('missing parameters', 400))
        }
        return next(err)
    }
})

router.post('/:id/read', authenticateJWT, ensureLoggedIn, ensurCorrectUserToReadMessage, async (req,res, next) =>{
/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
    try{
        const message = await Message.markRead(req.params.id)
        return res.json({message})
    } catch(err){
        return next(err)
    }
})


module.exports = router;

