const db = require("../../util/db");
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
    const application = await db.Application.findOne({
        where: {
            id: req.body.application
        },
        include: ["team"]
    });
    if (!application) return res.status(400).json({err: "invalidApplication"});
    if (!application.team.developer) return res.status(400).json({err: "applicationDisabled"});

    //Verify Redirect URI
    if (!application.callbackUrls.includes(req.body.redirectUri)) return res.status(400).json({err: "invalidRedirectUri"});

    //Create code
    const code = await db.AuthCode.create({
        id: uuid(),
        code: randomString(128),
        redirectUri: req.body.redirectUri,
        scopes
    });
    code.setUser(req.user);
    code.setApplication(application);

    res.json({code: code.code});
    
};