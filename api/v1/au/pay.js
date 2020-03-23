const db = require("../../../util/db");
const config = require("../../../config");
const uuid = require("uuid").v4;

module.exports = async (req, res) => {
	if (typeof req.body.from !== "string" || typeof req.body.amount !== "number")
		return res.status(400).json({err: "invalidBodyParameters"});

	const {amount, meta, redirect} = req.body;

	if (
		amount < config.inputBounds.auTransactionAmount.min ||
		amount > config.inputBounds.auTransactionAmount.max
	)
		return res.status(400).json({err: "invalidBodyParameters"});

	if (typeof meta !== "undefined") {
		if (
			typeof meta !== "string" ||
			meta.length < config.inputBounds.auTransactionMeta.min ||
			meta.length > config.inputBounds.auTransactionMeta.max
		)
			return res.status(400).json({err: "invalidBodyParameters"});
	}

	if (typeof redirect !== "undefined") {
		if (
			typeof req.body.redirect !== "string" ||
			req.body.redirect.length < config.inputBounds.auTransactionRedirect.min ||
			req.body.redirect.length > config.inputBounds.auTransactionRedirect.max ||
			!req.body.redirect.startsWith("https://") ||
			!validUrl(req.body.redirect)
		)
			return res.status(400).json({err: "invalidBodyParameters"});
	}

	//Prevent Paying Self
	if (req.params.id === req.body.from)
		return res.status(400).json({err: "cannotPaySelf"});

	//Get To Account
	const to = await db.AuAccount.findOne({
		where: {
			id: req.params.id
		}
	});
	if (!to) return res.status(400).json({err: "invalidToAccount"});

	//Get From Account
	const from = await db.AuAccount.findOne({
		where: {
			id: req.body.from
		}
	});
	if (!from) return res.status(400).json({err: "invalidFromAccount"});

	//Check Access
	const user = await from.getUser();
	const team = await from.getTeam();
	const teamMember = team
		? await db.TeamMember.findOne({
				where: {
					userId: req.user.id,
					teamId: team.id
				}
		  })
		: null;
	const hasAccess = user
		? req.user.id === user.id
		: teamMember && (teamMember.admin || teamMember.roles.includes("au"));
	if (!hasAccess) return res.status(401).json({err: "unauthorized"});

	//Check From Account has enough Au
	if (from.balance < amount) return res.status(400).json({err: "notEnoughAu"});

	//Create transaction
	const transaction = await db.AuTransaction.create({
		id: uuid(),
		amount,
		fee: config.auFee,
		meta,
		redirect
	});
	await transaction.setFrom(from);
	await transaction.setTo(to);

	//Update Balances
	await from.update({
		balance: from.balance - amount
	});
	await to.update({
		balance: to.balance + amount - config.auFee
	});

	//Add to Vault
	const vault = await db.AuAccount.findOne({
		where: {
			id: config.auVault
		}
	});
	if (vault) {
		await vault.update({
			balance: vault.balance + config.auFee
		});
	}

	//Response
	res.json({
		id: transaction.id
	});
};

//Check Valid URL
const validUrl = str => {
	// https://stackoverflow.com/a/5717133/12913019
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return !!pattern.test(str);
};
