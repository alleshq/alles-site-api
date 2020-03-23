const db = require("../../../util/db");
const config = require("../../../config");
const randomString = require("randomstring").generate;

module.exports = async (req, res) => {
	//Get Account
	const account = await db.AuAccount.findOne({
		where: {
			id: req.params.id
		}
	});
	if (!account) return res.status(400).json({err: "badAccountId"});

	//Get User or Team
	const user = await account.getUser();
	const team = await account.getTeam();
	const teamMember = team
		? await db.TeamMember.findOne({
				where: {
					userId: req.user.id,
					teamId: team.id
				}
		  })
		: null;

	//Check if user has access
	const hasAccess = user
		? req.user.id === user.id
		: teamMember && (teamMember.admin || teamMember.roles.includes("au"));
	if (!hasAccess) return res.status(401).json({err: "unauthorized"});

	//Update Secret
	const secret = randomString(config.auSecretLength);
	await account.update({secret});

	//Response
	res.json({secret});
};
