const express = require("express");
const sessionAuth = require("../util/sessionAuth");

const router = express.Router();
router.post("/login", require("./login"));
router.get("/me", sessionAuth, require("./me"));
router.post("/me", sessionAuth, require("./updateBasicProfile"));
router.get("/application/:application", sessionAuth, require("./application"));
router.post("/authorize", sessionAuth, require("./authorize"));

module.exports = router;