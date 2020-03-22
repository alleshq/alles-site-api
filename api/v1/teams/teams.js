module.exports = async (req, res) => {
	const teams = (
		await req.user.getTeams({
			order: ["name"]
		})
	).map(team => ({
		id: team.id,
		slug: team.slug,
		name: team.name
	}));

	res.json(teams);
};
