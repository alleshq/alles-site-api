const dev = process.env.NODE_ENV === "development";

module.exports = {
    dev,
    validScopes: [
        "basic-profile",
        "team-list"
    ],
    inputBounds: {
        name: {
            min: 1,
            max: 50
        },
        nickname: {
            min: 1,
            max: 50
        },
        about: {
            min: 1,
            max: 125
        },
        password: {
            min: 6,
            max: 128
        }
    },
    fileUploadSize: 50,
    avatar: {
        maxSize: 200,
        storage: dev ? "../avatars/data" : "/avatars"
    }
};