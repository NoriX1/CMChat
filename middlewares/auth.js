const passport = require('passport');
const passportService = require('../services/passport');

exports.requireAuth = passport.authenticate('jwt', { session: false });