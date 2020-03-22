const db = require("../../../util/db");

module.exports = async (req, res) => {
	var searchWithSlug;
	if (typeof req.query.id === "string") {
		searchWithSlug = false;
	} else if (typeof req.query.slug === "string") {
		searchWithSlug = true;
	} else {
		return res.status(400).json({err: "invalidQueryParameters"});
    }
    
    //Get Team
	const team = await db.Team.findOne({
		where: {
			[searchWithSlug ? "slug" : "id"]: searchWithSlug
				? req.query.slug
				: req.query.id
		}
	});
    if (!team) return res.status(400).json({err: "invalidTeam"});
    
	//Get TeamMember
	const teamMember = await db.TeamMember.findOne({
		where: {
			userId: req.user.id,
			teamId: team.id
		}
	});

	//Get Member Count
	const memberCount = await team.countMembers();

	//Response
	res.json({
        id: team.id,
        name: team.name,
        slug: team.slug,
        verified: team.verified,
		developer: team.developer,
		memberCount,
		isMember: teamMember !== null,
		isAdmin: teamMember ? teamMember.admin : null,
		roles: teamMember ? teamMember.roles : null,
        plan: teamMember ? team.plan : null,
        stardust: teamMember ? team.stardust : null
	});
};
