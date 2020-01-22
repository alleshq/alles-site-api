const express = require("express");
const sessionAuth = require("../util/sessionAuth");

const router = express.Router();

//Sign in
router.post("/login", require("./login"));

//Basic User Info
router.get("/me", sessionAuth, require("./me"));
router.post("/me", sessionAuth, require("./updateBasicProfile"));

//OAuth Authorization
router.get("/application/:application", sessionAuth, require("./application"));
router.post("/authorize", sessionAuth, require("./authorize"));

//Feed
router.get("/feed", sessionAuth, require("./feed"));

module.exports = router;