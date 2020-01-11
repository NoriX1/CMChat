const passport = require('passport');
const User = require('../models/user');
const keys = require('../config/keys');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const localOptions = { usernameField: 'email', passwordField: 'signinpassword' }
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) return done(err);
        if (!user) { return done(null, false); }

        user.comparePassword(password, function (err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false); }

            return done(null, user);
        });
    });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: keys.secret
};
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    const exp = new Date().setDate(new Date(payload.iat).getDate() + 1);
    User.findById(payload.sub, function (err, user) {
        if (err) { return done(err, false); }
        if (user) {
            if (new Date().getTime() > exp) {
                done(null, false);
            } else {
                done(null, user);
            }
        } else {
            done(null, false);
        }
    });
});

const googleOptions = {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
}
const googleAuth = new GoogleStrategy(googleOptions, function (accessToken, refreshToken, profile, done) {
    User.findOne({ googleID: profile.id }, function (err, existingUser) {
        if (err) { return done(err, false); }
        if (existingUser) {
            done(null, existingUser);
        } else {
            User.findOne({ name: profile.displayName }, (err, existingName) => {
                if (err) return done(err, false);
                let user = new User({
                    name: profile.displayName,
                    googleID: profile.id,
                    email: profile.emails[0].value
                })
                if (existingName) {
                    user.name = 'u#' + user.name;
                }
                user.save((err) => {
                    if (err) return done(err, false);
                    return done(null, user);
                });
            });
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(googleAuth);