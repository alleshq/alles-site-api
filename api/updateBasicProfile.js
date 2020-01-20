const config = require("../config");
const db = require("../util/mongo");

module.exports = async (req, res) => {
    if (
        typeof req.body.name !== "string" ||
        typeof req.body.nickname !== "string" ||
        typeof req.body.about !== "string" ||
        req.body.name.length < config.inputBounds.name.min ||
        req.body.name.length > config.inputBounds.name.max ||
        req.body.nickname.length < config.inputBounds.nickname.min ||
        req.body.nickname.length > config.inputBounds.nickname.max ||
        req.body.about.length < config.inputBounds.about.min ||
        req.body.about.length > config.inputBounds.about.max
    ) return res.status(400).json({err: "badInput"});

    await db("accounts").updateOne({_id: req.user._id}, {$set: {
        name: req.body.name,
        nickname: req.body.nickname,
        about: req.body.about
    }});

    res.json({});
};