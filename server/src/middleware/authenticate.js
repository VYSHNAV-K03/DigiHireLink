const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");
const USER = require("../modelschemas/userschema");

require("dotenv").config({
  path: "server/.env",
});

//this is the middleware we use in about page
const Authenticate = async (req, res, next) => {
  try {
    console.log(req.body);

    const token = req.body.token;
    // console.log("token authenticate", token);
    //decoded token
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(verifyToken._id);

    const rootUser = await USER.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    // console.log(rootUser);
    if (!rootUser) {
      throw new Error("User Not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (e) {
    res.status(401).send({ error: "Unauthorized:No token provided" });
    // console.log("cookie in auth", req);
  }
};

module.exports = Authenticate;
