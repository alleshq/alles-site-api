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
        attributes: ["id", "username", "name", "plus"],
        order: ["username"],
        limit: config.usersResultLimit
    });

    //Get IDs of first/last users (pagination)
    const first = await db.User.findOne({
        attributes: ["id"],
        order: [["username", "ASC"]]
    });
    const last = await db.User.findOne({
        attributes: ["id"],
        order: [["username", "DESC"]]
    });

    //Response
    res.json({
        users,
        firstPage: !first || users.map(u => u.id).includes(first.id),
        lastPage: !last || users.map(u => u.id).includes(last.id)
    });

};