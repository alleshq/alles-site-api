module.exports = async (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        nickname: req.user.nickname,
        about: req.user.about,
        private: req.user.private,
        au: 0,
        plus: req.user.plus,
        rubies: req.user.rubies,
        createdAt: req.user.createdAt
    });
};