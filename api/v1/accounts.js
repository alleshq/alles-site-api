module.exports = async (req, res) => {
	//Get Primary Account
	const primary = await req.user.getPrimary({
		attributes: ["id", "username", "name", "plus"]
	});

	//Get Secondary Accounts
	const secondaries = await (primary ? primary : req.user).getSecondaries({
		attributes: ["id", "username", "name", "plus"]
	});

	//Response
	res.json({
		primary,
		secondaries
	});
};
