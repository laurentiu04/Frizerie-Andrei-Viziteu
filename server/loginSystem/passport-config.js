const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

function initialize(passport, Admin) {
	passport.use(
		new LocalStrategy(
			{ usernameField: "user" },
			async (username, password, done) => {
				try {
					const user = await Admin.findOne({ user: username });
					if (!user) return done(null, false, { message: "User inexistent" });

					const match = await bcrypt.compare(password, user.password);
					if (!match) {
						console.log("Wrong password");
						return done(null, false, { message: "Parolă greșită" });
					}

					return done(null, user);
				} catch (err) {
					console.log(err);
					return done(err);
				}
			},
		),
	);

	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await Admin.findById(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});
}

module.exports = initialize;
