const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(
    new GoogleStrategy({
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: 'http://localhost:4200/home'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }));