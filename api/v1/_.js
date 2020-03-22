const express = require("express");
const sessionAuth = require("../../util/sessionAuth");
const router = express.Router();

//Sign in
router.post("/login", require("./login"));

//Basic User Info
router.get("/me", sessionAuth, require("./me"));
router.post("/me", sessionAuth, require("./manageAccount/profile"));
router.post("/password", sessionAuth, require("./manageAccount/password"));
router.post("/avatar", sessionAuth, require("./manageAccount/avatar"));

//Users
router.get("/user", sessionAuth, require("./users/user"));
router.get("/users", sessionAuth, require("./users/users"));
router.post("/follow/:id", sessionAuth, require("./users/follow"));
router.post("/unfollow/:id", sessionAuth, require("./users/unfollow"));

//OAuth Authorization
router.get("/application/:application", sessionAuth, require("./oauth/application"));
router.post("/authorize", sessionAuth, require("./oauth/authorize"));

//Accounts
router.get("/accounts", sessionAuth, require("./accounts/accounts"));
router.post("/accounts/switch/:id", sessionAuth, require("./accounts/switchAccount"));

//Teams
router.get("/team", sessionAuth, require("./teams/team"));
router.get("/teams", sessionAuth, require("./teams/teams"));

module.exports = router;
