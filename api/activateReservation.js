const db = require("../util/mongo");
const config = require("../config");
const credentials = require("../credentials");
const uuid = require("uuid/v4");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
    if (typeof req.body.code !== "string" || typeof req.body.password !== "string") return res.status(400).json({err: "invalidBodyParameters"});
    if (req.body.password.length < config.inputBounds.password.min || req.body.password.length > config.inputBounds.password.max) return res.status(400).json({err: "passwordRequirements"});
    const reservation = await db("reservations").findOne({code: req.body.code});
    if (!reservation || reservation.account) return res.status(400).json({err: "invalidReservation"});

    //Create user
    const user = {
        _id: uuid(),
        username: reservation.username,
        name: reservation.name,
        nickname: reservation.nickname,
        about: `Hi! I'm ${reservation.nickname}!`,
        private: false,
        createdAt: new Date(),
        password: bcrypt.hashSync(req.body.password, 10),
        au: 0,
        reputation: 0,
        rubies: 0,
        plus: {
            until: new Date(1609459200000)
        },
        followers: []
    };
    db("accounts").insertOne(user);

    //Mark reservation as used
    db("reservations").updateOne({_id: reservation._id}, {$set: {account: user._id}});

    //Sign Token
    const token = jwt.sign({
        user: user._id
    }, credentials.jwtSecret, {
        expiresIn: config.sessionTokenLifespan
    });

    res.json({token});
    
};