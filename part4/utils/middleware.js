const jwt = require("jsonwebtoken");
const User = require("../model/user.js");

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }
  next(error);
};

const getTokenFrom = (request, respond, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "");
    request.token = token;
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (request, respond, next) => {
  const authorization = request.get("Authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "");

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return respond.status(401).json({ error: "invalid token" });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return respond.status(401).json({ error: "user not found" });
    }

    request.user = user;
  }

  next();
};

module.exports = { unknownEndpoint, errorHandler, getTokenFrom, userExtractor };
