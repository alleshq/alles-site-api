const db = require("../../util/mongo");

module.exports = async (req, res) => {
    if (typeof req.query.code !== "string") return res.status(400).json({err: "invalidQueryParameters"});
    const reservation = await db("reservations").findOne({code: req.query.code});
    if (!reservation || reservation.account) return res.status(400).json({err: "invalidReservation"});

    //Response
    res.json({
        code: reservation.code,
        username: reservation.username
    });

};