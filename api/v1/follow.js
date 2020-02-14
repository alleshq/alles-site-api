const db = require("../../util/mongo");

module.exports = async (req, res) => {
    const user = await db("accounts").findOne({_id: req.params.id});
    if (!user) return res.status(400).json({err: "invalidUser"});

    //Same User
    if (user._id === req.user._id) return res.status(400).json({err: "cannotFollowSelf"});

    //Already Followed
    if (user.followers.includes(req.user._id)) return res.json({});

    //Add Follower
    db("accounts").updateOne({_id: user._id}, {
        $push: {
            followers: req.user._id
        }
    }).then(() => {
        res.json({});
    });
};