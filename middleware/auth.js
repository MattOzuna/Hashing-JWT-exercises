/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const Message = require('../models/message')

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}

/** My Middleware: Requires authenticated user to match either the from_username or to_username */

async function ensurCorrectUserForMessage(req, res, next){
  try{
    const message = await Message.get(req.params.id)
    if (req.user.username === message.from_user.username || req.user.username === message.to_user.username){
      req.message = message
      return next()
    }
    return next({status:401, message: "Unauthorized"})
  }catch(err){
    return next({status: 401, message: "unathorized"})
  }
}

async function ensurCorrectUserToReadMessage(req, res, next){
  try{
    const message = await Message.get(req.params.id)
    if (req.user.username === message.to_user.username){
      req.message = message
      return next()
    }
    return next({status:401, message: "Unauthorized"})
  }catch(err){
    return next({status: 401, message: "unathorized"})
  }
}
// end

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser, 
  ensurCorrectUserForMessage, 
  ensurCorrectUserToReadMessage
};
