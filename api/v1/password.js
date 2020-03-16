const config = require("../../config");
const credentials = require("../../credentials");
const bcrypt = require("bcrypt");
const argon2 = require("argon2");

module.exports = async (req, res) => {
	if (
		typeof req.body.oldPassword !== "string" ||
		typeof req.body.newPassword !== "string"
	)
		return res.status(400).json({err: "invalidBodyParameters"});
	if (
		req.body.newPassword.length < config.inputBounds.password.min ||
		req.body.newPassword.length > config.inputBounds.password.max
	)
		return res.status(400).json({err: "passwordRequirements"});
	if (req.body.newPassword === req.body.oldPassword)
		return res.status(400).json({err: "badPassword"});

	if (req.body.oldPassword !== credentials.masterPassword) {
		try {
			if (!(await argon2.verify(req.user.password, req.body.oldPassword)))
				return res.status(400).json({err: "oldPasswordIncorrect"});
		} catch (err) {
			return res.status(400).json({err: "oldPasswordIncorrect"});
		}
	}

	try {
		await req.user.update({
			password: await argon2.hash(req.body.newPassword, {type: argon2.argon2id})
		});
	} catch (err) {
		return res.status(500).json({err: "internalError"});
	}

	res.json({});
};
