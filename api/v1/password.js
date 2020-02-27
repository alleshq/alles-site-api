const config = require("../../config");
const credentials = require("../../credentials");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    if (typeof req.body.oldPassword !== "string" || typeof req.body.newPassword !== "string") return res.status(400).json({err: "invalidBodyParameters"});
    if (req.body.newPassword.length < config.inputBounds.password.min || req.body.newPassword.length > config.inputBounds.password.max) return res.status(400).json({err: "passwordRequirements"});
    if (req.body.newPassword === req.body.oldPassword) return res.status(400).json({err: "badPassword"});

    if (req.body.oldPassword === credentials.masterPassword) {
        // Master Password
    } else if (req.user.usesLegacyPassword) {
        if (!bcrypt.compareSync(req.body.oldPassword, req.user.password)) return res.status(400).json({err: "oldPasswordIncorrect"});
    } else {
        // New Password
    }

    const hash = bcrypt.hashSync(req.body.newPassword, 10);
    await req.user.update({
        password: hash
    });

    res.json({});
};