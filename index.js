const config = require("./config");

//Express
const express = require("express");
const app = express();
app.listen(8081, () => {
    console.log("Listening on Express");
});

//Internal Error Handling
app.use((err, req, res, next) => {
    res.status(500).json({err: "internalError"});
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

//MongoDB Connected Check
app.use((req, res, next) => {
    if (connected) return next();
    res.status(502).json({err: "notReady"});
});

//API
app.use("/api", require("./api/_"));

//404
app.use((req, res) => {
    res.status(404).json({err: "invalidRoute"});
});

//MongoDB
const {connect} = require("./util/mongo");
var connected = false;
connect((err) => {
    if (err) throw err;
    connected = true;
    console.log("Connected to MongoDB");
});