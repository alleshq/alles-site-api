const config = require("../config");
const db = require("../util/mongo");

module.exports = async (req, res) => {
    if (
        typeof req.body.content !== "string" ||
        req.body.content.length > 5000
    ) return res.status(400).json({err: "invalidBodyParameters"});

    if (await db("2030letters").findOne({_id: req.user._id})) return res.status(400).json({err: "alreadyDone"});

    await db("2030letters").insertOne({
        _id: req.user._id,
        content: req.body.content
    });

    res.json({});
};