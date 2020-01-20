const db = require("../util/mongo");

module.exports = async (req, res) => {
    
    //Get Application
    const application = await db("applications").findOne({_id: req.params.application});
    if (!application) return res.status(400).json({err: "invalidApplication"});
    const team = await db("teams").findOne({_id: application.team});
    if (!team) return res.status(400).json({err: "orphanedApplication"});
    if (!team.developer) return res.status(400).json({err: "applicationDisabled"});

    //Response
    res.json({
        id: application._id,
        team: {
            id: team._id,
            name: team.name,
            teamid: team.teamid,
            verified: team.verified
        },
        name: application.name,
        description: application.description,
        firstParty: application.firstParty,
        creationDate: application.creationDate,
        callbackUrls: application.signin.callbackUrls
    });

};