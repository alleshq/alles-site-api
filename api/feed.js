const db = require("../util/mongo");

module.exports = async (req, res) => {
    
    //Get Posts
    const posts = await Promise.all((
        await db("posts").find({feeds: req.user._id}).sort({date: -1}).limit(500).toArray()
    ).map(async (p) => {
        const author = await db("accounts").findOne({_id: p.author});
        return {
            id: p.shortId,
            author: {
                id: author._id,
                username: author.username,
                name: author.name
            },
            content: p.content,
            date: p.date,
            liked: p.likes.includes(req.user._id),
            boosted: p.likes.includes(req.user._id)
        };
    }));

    res.json(posts);

};