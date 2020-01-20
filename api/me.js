module.exports = async (req, res) => {
    res.json({
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        nickname: req.user.nickname,
        about: req.user.about,
        private: req.user.private
    });
};