const db = require("../../util/db");

module.exports = async (req, res) => {
	const user = await db.User.findOne({
		where: {
			id: req.params.id
		}
	});
	if (!user) return res.status(400).json({err: "invalidUser"});

	//Not Followed
	if (!(await user.hasFollower(req.user))) return res.json({});

	//Add Follower
	await user.removeFollower(req.user);

	res.json({});
};
