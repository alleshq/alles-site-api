const dev = process.env.NODE_ENV === "development";

module.exports = {
	dev,
	validScopes: ["teams"],
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
		},
		auTransactionAmount: {
			min: 10,
			max: 1000000
		},
		auTransactionMeta: {
			min: 5,
			max: 100
		},
		auTransactionRedirect: {
			min: 5,
			max: 150
		}
	},
	fileUploadSize: 50,
	avatar: {
		maxSize: 200,
		storage: dev ? "../avatars/data" : "/avatars"
	},
	usersResultLimit: 20,
	auFee: 1,
	auVault: "1ba148ae-2d45-4f0b-92ef-1d254635e330",
	auSecretLength: 128
};
