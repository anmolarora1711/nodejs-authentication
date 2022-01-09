const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const PasswordUtility = require('../utilities/password');


// Tell passport to use a new strategy for google login
passport.use(
	new googleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL,
			passReqToCallback: true,
		}, function (request, accessToken, refreshToken, profile, done) {
			// Find a user
			console.log(profile);
			User.findOne(
				{ email: profile.emails[0].value },
				function (err, user) {
					if (err) {
						console.log('Error in google strategy-passport', err);
						done(err);
						return;
					}

					console.log(profile);

					if (user) {
						// If found, set this user as req.user
						return done(null, user);
					} else {
						// If not found, set the user and set it as req.user
						const password = crypto.randomBytes(20).toString('hex');
						const hashedPassword = PasswordUtility.genPassword(password);
						User.create(
							{
								name: profile.displayName,
								email: profile.emails[0].value,
								hash: hashedPassword.genHash,
								salt: hashedPassword.salt
							},
							function (err, user) {
								if (err) {
									console.log(
										'Error in creating user using google strategy-passport',
										err
									);
									done(err);
									return;
								}
								return done(null, user);
							}
						);
					}
				}
			);
		}
	)
);

module.exports = passport;
