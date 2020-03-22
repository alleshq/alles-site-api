const db = require("../../util/db");

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
    
    //If User is in Team
    const userIsMember = await team.hasMember(req.user);

	//Response
	res.json({
        id: team.id,
        name: team.name,
        slug: team.slug,
        verified: team.verified,
        developer: team.developer,
        plan: userIsMember ? team.plan : null,
        stardust: userIsMember ? team.stardust : null
	});
};
