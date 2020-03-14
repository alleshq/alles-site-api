const db = require("../../util/db");
const config = require("../../config");
const {Op} = require("sequelize");

module.exports = async (req, res) => {
    //Form Database Query
    var dbQuery = {
        private: false
    };
    if (typeof req.query.after === "string") {
        dbQuery.username = {
            [Op.gt]: req.query.after
        };
    } else if (typeof req.query.before === "string") {
        dbQuery.username = {
            [Op.lt]: req.query.before
        };
    }

    //Get Users
    const users = await db.User.findAll({
        where: dbQuery,
        order: ["username"],
        limit: config.usersResultLimit
    });

    //Response
    res.json(users);

};