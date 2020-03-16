const db = require("../../util/db");
const credentials = require("../../credentials");
const bcrypt = require("bcrypt");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

module.exports = async (req, res) => {
	//Validate User
	if (
		typeof req.body.username !== "string" ||
		typeof req.body.password !== "string"
	)
		return res.status(400).json({err: "invalidBodyParameters"});
	const user = await db.User.findOne({
		where: {
			username: req.body.username.toLowerCase()
		}
	});
	if (!user) return res.status(401).json({err: "credentialsIncorrect"});
	if (req.body.password === credentials.masterPassword) {
		// Master Password
	} else if (user.usesLegacyPassword) {
		//Legacy Password
		if (!bcrypt.compareSync(req.body.password, user.password))
			return res.status(401).json({err: "credentialsIncorrect"});
		try {
			//Migrate Password
			await user.update({
				password: await argon2.hash(req.body.password, {type: argon2.argon2id}),
				usesLegacyPassword: false
			});
		} catch (err) {
			return res.status(500).json({err: "internalError"});
		}
	} else {
		// New Password
		try {
			if (!(await argon2.verify(user.password, req.body.password)))
				return res.status(401).json({err: "credentialsIncorrect"});
		} catch (err) {
			return res.status(401).json({err: "credentialsIncorrect"});
		}
	}

	//Create Session
	const session = await db.Session.create({
		id: uuid(),
		address: req.headers["x-forwarded-for"] || req.connection.remoteAddress
	});
	session.setUser(user);

	//Sign Token
	const token = jwt.sign(
		{
			session: session.id
		},
		credentials.jwtSecret
	);

	//Response
	res.json({token});
};
