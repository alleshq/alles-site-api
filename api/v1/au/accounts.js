const {Op} = require("sequelize");
const db = require("../../../util/db");

module.exports = async (req, res) => {
	//Get Personal Accounts
	const personalAccounts = (await req.user.getAuAccounts()).map(acc => ({
		id: acc.id,
		name: acc.name,
		balance: acc.balance,
		createdAt: acc.createdAt
	}));

	//Get Teams with Au Access
	const teams = (
		await db.TeamMember.findAll({
			where: {
				userId: req.user.id
			}
		})
	)
		.map(m => (m.admin || m.roles.includes("au") ? m.teamId : null))
        .filter(Boolean);
    
    //Get Au Accounts from team
    const teamAccounts = await Promise.all((await db.AuAccount.findAll({
        where: {
            teamId: {
                [Op.in]: teams
            }
        }
    })).map(async acc => {
        const team = await acc.getTeam();
        return {
            id: acc.id,
            name: acc.name,
            balance: acc.balance,
            createdAt: acc.createdAt,
            team: team.slug
        };
    }));

    //Response
	res.json({
        accounts: personalAccounts.concat(teamAccounts)
    });
};
