const express = require("express");
const sessionAuth = require("../util/sessionAuth");

const router = express.Router();

//Sign in
router.post("/login", require("./login"));

//Basic User Info
router.get("/me", sessionAuth, require("./me"));
router.post("/me", sessionAuth, require("./updateBasicProfile"));
router.post("/password", sessionAuth, require("./password"));
router.post("/avatar", sessionAuth, require("./avatar"));

//OAuth Authorization
router.get("/application/:application", sessionAuth, require("./application"));
router.post("/authorize", sessionAuth, require("./authorize"));

module.exports = router;