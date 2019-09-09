const authRoutes = require('./routes/authRoutes');

module.exports = function (app) {
    authRoutes(app);
}