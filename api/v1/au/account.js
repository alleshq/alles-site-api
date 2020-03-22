const {Op} = require("sequelize");
const db = require("../../../util/db");

module.exports = async (req, res) => {
	if (req.params.id.length > 36)
		return res.status(400).json({err: "badAccountId"});

	const query = {
		id:
			req.params.id.length < 36
				? {
						[Op.like]: req.params.id.toLowerCase() + "%"
				  }
				: req.params.id.toLowerCase()
	};

	//Check how many accounts
	const accountCount = await db.AuAccount.count({
		where: query
	});
	if (accountCount !== 1) return res.status(400).json({err: "badAccountId"});

	//Get Account
	const account = await db.AuAccount.findOne({
		where: query
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

	//Response
	res.json({
		account: {
			id: account.id,
			createdAt: account.createdAt,
			hasAccess,
			name: hasAccess ? account.name : null,
			balance: hasAccess ? account.balance : null,
			team: hasAccess && team ? team.slug : null
		}
	});
};
