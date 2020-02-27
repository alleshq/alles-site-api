const db = require("./db");
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
    const session = await db.Session.findOne({
        where: {
            id: token.session
        },
        include: ["user"]
    });
    if (!session) return res.status(401).json({err: "invalidSession"});
    
    req.user = session.user;
    next();

};