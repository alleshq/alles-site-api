module.exports = async (req, res) => {
	//Get Primary Account
	const primary = await req.user.getPrimary({
		attributes: ["id"]
	});

	//Get Secondary Accounts
	const secondaries = (
		await (primary ? primary : req.user).getSecondaries({
			attributes: ["id"]
		})
	).map(u => u.id);

	//Check ID is in connected accounts
	if (
		req.params.id !== (primary ? primary : req.user).id &&
		!secondaries.includes(req.params.id)
	)
        return res.status(400).json({err: "accountNotRelated"});
    
    //Update Session
    await req.session.update({
        userId: req.params.id
    });

	//Response
	res.json({});
};
