const config = require("./config");

//Express
const express = require("express");
const app = express();

//Database
const db = require("./util/db");
db.sync({force: true}).then(() => {
    //Express Listen
    app.listen(8081, async () => {
        console.log("Listening on Express");

        const archie = await db.User.create({
            id: require("uuid/v4")(),
            username: "archie",
            password: "",
            name: "Archie Baer",
            nickname: "Hi! I'm Archie!",
            about: "this is a test",
            usesLegacyPassword: true,
            plus: true
        });

        const jessica = await db.User.create({
            id: require("uuid/v4")(),
            username: "jessica",
            password: "",
            name: "Jessica Adams",
            nickname: "Hi! I'm Jessica!",
            about: "this is a test",
            usesLegacyPassword: true,
            plus: true
        });

        const alles = await db.Team.create({
            id: "alles",
            name: "Alles",
            slug: "alles",
            developer: true
        });

        archie.addTeam(alles);
    });
});

//Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json({extended: false}));

//File Upload
const fileUpload = require("express-fileupload");
app.use(fileUpload({
    limits: {
        fileSize: config.fileUploadSize * 1024 * 1024 // File Size in Megabytes
    },
    safeFileNames: true,
    preserveExtension: 4,
    limitHandler: (req, res) => {
        res.status(400).json({err: "fileUploadFailed"});
    }
}));

//Internal Error Handling
app.use((err, req, res, next) => {
    res.status(500).json({err: "internalError"});
});

//API
app.use("/api/v1", require("./api/v1/_"));

//404
app.use((req, res) => {
    res.status(404).json({err: "invalidRoute"});
});