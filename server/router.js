const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

module.exports = function (app) {
    authRoutes(app);
    roomRoutes(app);
}