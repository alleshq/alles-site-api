const db = require("../util/mongo");
const credentials = require("../credentials");
const config = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {

    //Validate User
    if (typeof req.body.username !== "string" || typeof req.body.password !== "string") return res.status(400).json({err: "invalidBodyParameters"});
    const user = await db("accounts").findOne({username: req.body.username});
    if (!user) return res.status(401).json({err: "credentialsIncorrect"});
    if (!bcrypt.compareSync(req.body.password, user.password)) return res.status(401).json({err: "credentialsIncorrect"});
    
    //Sign Token
    const token = jwt.sign({
        user: user._id
    }, credentials.jwtSecret, {
        expiresIn: config.sessionTokenLifespan
    });

    //Response
    res.json({token});
    
};