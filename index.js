const config = require("./config");

//Express
const express = require("express");
const app = express();

//Database
const db = require("./util/db");
db.sync().then(() => {
	//Express Listen
	app.listen(8081, async () => {
		console.log("Listening on Express");
	});
});

//Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json({extended: false}));

//File Upload
const fileUpload = require("express-fileupload");
app.use(
	fileUpload({
		limits: {
			fileSize: config.fileUploadSize * 1024 * 1024 // File Size in Megabytes
		},
		safeFileNames: true,
		preserveExtension: 4,
		limitHandler: (req, res) => {
			res.status(400).json({err: "fileUploadFailed"});
		}
	})
);

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
