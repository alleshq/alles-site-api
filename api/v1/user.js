const db = require("../../util/mongo");
const plusStatus = require("../../util/plusStatus");

module.exports = async (req, res) => {
    var dbSearch;
    if (typeof req.query.id === "string") {
        dbSearch = {_id: req.query.id};
    } else if (typeof req.query.username === "string") {
        dbSearch = {username: req.query.username};
    } else {
        return res.status(400).json({err: "invalidQueryParameters"});
    }
    const user = await db("accounts").findOne(dbSearch);
    if (!user) return res.status(400).json({err: "invalidUser"});

    //User Response
    const followed = user.followers.includes(req.user._id);
    var userData = {
        id: user._id,
        username: user.username,
        name: user.name,
        nickname: user.nickname,
        about: user.about,
        private: user.private,
        followers: user.followers.length,
        followed,
        joinDate: user.createdAt,
        rubies: user.rubies,
        plus: plusStatus(user.plus)
    };

    //Respond
    res.json(userData);

};