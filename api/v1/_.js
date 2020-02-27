const express = require("express");
const sessionAuth = require("../../util/sessionAuth");
const router = express.Router();

//Sign in
router.post("/login", require("./login"));

//Basic User Info
router.get("/me", sessionAuth, require("./me"));
router.post("/me", sessionAuth, require("./profile"));
router.post("/password", sessionAuth, require("./password"));
router.post("/avatar", sessionAuth, require("./avatar"));

//User
router.get("/user", sessionAuth, require("./user"));

//OAuth Authorization
router.get("/application/:application", sessionAuth, require("./application"));
router.post("/authorize", sessionAuth, require("./authorize"));

//Follow
router.post("/follow/:id", sessionAuth, require("./follow"));
router.post("/unfollow/:id", sessionAuth, require("./unfollow"));

//Teams
router.get("/teams", sessionAuth, require("./teams"));

module.exports = router;