const db = require("./mongo");
const credentials = require("../credentials");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {

    //Parse Header
    const authHeader = req.headers.authorization;
    if (typeof authHeader !== "string") return res.status(401).json({err: "invalidSession"});
    var token;
    try {
        token = jwt.verify(authHeader, credentials.jwtSecret);
    } catch (err) {
        return res.status(401).json({err: "invalidSession"});
    }

    //Get Session
    if (!token.session) return res.status(401).json({err: "invalidSession"}); //A bad token that's somehow signed has been used. This is very bad.
    const session = await db("sessions").findOne({_id: token.session});

    //Get User
    const user = await db("accounts").findOne({_id: session.user});
    if (!user) return res.status(401).json({err: "invalidSession"});
    
    req.user = user;
    next();

};