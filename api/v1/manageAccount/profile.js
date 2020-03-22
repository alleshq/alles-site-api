const config = require("../../../config");

module.exports = async (req, res) => {
	if (
		typeof req.body.name !== "string" ||
		typeof req.body.nickname !== "string" ||
		typeof req.body.about !== "string"
	)
		return res.status(400).json({err: "invalidBodyParameters"});

	const fullname = req.body.name.trim();
	const nickname = req.body.nickname.trim();
	const about = req.body.about.trim();

	if (
		fullname.length < config.inputBounds.name.min ||
		fullname.length > config.inputBounds.name.max ||
		nickname.length < config.inputBounds.nickname.min ||
		nickname.length > config.inputBounds.nickname.max ||
		about.length < config.inputBounds.about.min ||
		about.length > config.inputBounds.about.max
	)
		return res.status(400).json({err: "invalidBodyParameters"});

	await req.user.update({
		name: fullname,
		nickname,
		about
	});

	res.json({});
};
