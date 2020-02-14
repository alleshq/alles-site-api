const db = require("../../util/mongo");

module.exports = async (req, res) => {
    const teams = (
        await db("teams").find({
            [`users.${req.user._id}`]: {
                $exists: true
            }
        }).toArray()
    ).map(team => ({
        id: team._id,
        teamid: team.teamid,
        name: team.name
    }));

    res.json(teams);
};