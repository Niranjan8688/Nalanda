const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await User.findById(decoded._id).select('-password');
      next();
    } catch (error) {
      res.status(401).send({
        "error":"Authorization Failed"
      });

      res.status(401).send({
        "Error":"Not authorized, token failed"
      })
    }
  }

  if (!token) {
    res.status(401).send({
        "error":"Token not found"
    })
  }
});

module.exports = { protect };
