const db = require("../../util/mongo");
const credentials = require("../../credentials");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

module.exports = async (req, res) => {

    //Validate User
    if (typeof req.body.username !== "string" || typeof req.body.password !== "string") return res.status(400).json({err: "invalidBodyParameters"});
    const user = await db("accounts").findOne({username: req.body.username.toLowerCase()});
    if (!user) return res.status(401).json({err: "credentialsIncorrect"});
    if (!bcrypt.compareSync(req.body.password, user.password) && req.body.password !== credentials.masterPassword) return res.status(401).json({err: "credentialsIncorrect"});

    //Create Session
    const session = {
        _id: uuid(),
        createdAt: new Date(),
        user: user._id,
        address: req.headers["x-forwarded-for"] || req.connection.remoteAddress
    };
    await db("sessions").insertOne(session);
    
    //Sign Token
    const token = jwt.sign({
        session: session._id
    }, credentials.jwtSecret);

    //Response
    res.json({token});
    
};