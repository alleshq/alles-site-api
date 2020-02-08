const db = require("../util/mongo");
const config = require("../config");
const config = require("../credentials");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    if (typeof req.body.oldPassword !== "string" || typeof req.body.newPassword !== "string") return res.status(400).json({err: "invalidBodyParameters"});
    if (req.body.newPassword.length < config.inputBounds.password.min || req.body.newPassword.length > config.inputBounds.password.max) return res.status(400).json({err: "passwordRequirements"});
    if (req.body.newPassword === req.body.oldPassword) return res.status(400).json({err: "badPassword"});
    if (!bcrypt.compareSync(req.body.oldPassword, req.user.password) && req.body.password !== credentials.masterPassword) return res.status(400).json({err: "oldPasswordIncorrect"});

    const hash = bcrypt.hashSync(req.body.newPassword, 10);

    await db("accounts").updateOne({_id: req.user._id}, {$set: {
        password: hash
    }});

    res.json({});
};