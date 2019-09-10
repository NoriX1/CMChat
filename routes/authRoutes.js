const passport = require('passport');
const passportService = require('../services/passport');
const Authentication = require('../controllers/authentication');
const auth = require('../middlewares/auth');

const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {
    app.get('/', auth.requireAuth, function (req, res) {
        res.send({ secret: 'data' });
    })
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { session: false }), Authentication.signInGoogle);
}