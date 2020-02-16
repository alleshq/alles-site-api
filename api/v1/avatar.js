const config = require("../../config");
const avatarTypes = ["image/jpeg", "image/png"];

module.exports = async (req, res) => {
    if (typeof req.files !== "object" || req.files === null || typeof req.files.avatar !== "object") return res.status(400).json({err: "fileUploadFailed"});
    const {avatar} = req.files;
    if (avatar.size > config.avatar.maxSize * 1024) return res.status(400).json({err: "avatarTooBig"}); //Avatar Size in Kilobytes
    if (!avatarTypes.includes(avatar.mimetype)) return res.status(400).json({err: "badFileType"});

    const filePath = `${__dirname}/../../${config.avatar.storage}/users/${req.user._id}`;
    avatar.mv(filePath);

    res.json({});
};