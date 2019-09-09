const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });   //Auth for requests with token
const requireSignin = passport.authenticate('local', { session: false });   //Signing in via login and password

module.exports = function (app) {
    app.get('/', requireAuth, function (req, res) {
        res.send({ secret: 'data' });
    })
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', {session: false}), Authentication.signInGoogle);
}