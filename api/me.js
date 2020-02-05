const plusStatus = require("../util/plusStatus");

module.exports = async (req, res) => {
    res.json({
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        nickname: req.user.nickname,
        about: req.user.about,
        private: req.user.private,
        au: req.user.au,
        plus: {
            active: plusStatus(req.user.plus),
            ...req.user.plus
        },
        rubies: req.user.rubies,
        createdAt: req.user.createdAt
    });
};