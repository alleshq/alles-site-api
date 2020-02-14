const db = require("../../util/mongo");
const config = require("../../config");
const uuid = require("uuid/v4");
const randomString = require("randomstring").generate;

module.exports = async (req, res) => {

    if (typeof req.body.scopes !== "string" || typeof req.body.application !== "string" || typeof req.body.redirectUri !== "string") return res.status(400).json({err: "invalidBodyParameters"});

    //Verify Scopes
    const scopes = [...new Set(req.body.scopes.split(" "))].filter(Boolean);
    if (scopes.length > 50) return res.status(400).json({err: "tooManyScopes"});
    for (var i = 0; i < scopes.length; i++) {
        if (scopes[i] && !config.validScopes.includes(scopes[i])) return res.status(400).json({err: "invalidScope"});
    }

    //Get Application
    const application = await db("applications").findOne({_id: req.body.application});
    if (!application) return res.status(400).json({err: "invalidApplication"});
    const team = await db("teams").findOne({_id: application.team});
    if (!team) return res.status(400).json({err: "orphanedApplication"});
    if (!team.developer) return res.status(400).json({err: "applicationDisabled"});

    //Verify Redirect URI
    if (!application.signin.callbackUrls.includes(req.body.redirectUri)) return res.status(400).json({err: "invalidRedirectUri"});

    //Create code
    const code = {
        _id: uuid(),
        user: req.user._id,
        application: application._id,
        code: randomString(128),
        createdAt: new Date(),
        used: false,
        redirectUri: req.body.redirectUri,
        scopes
    };
    db("authCodes").insertOne(code);

    res.json({code: code.code});
    
};