const auth = require('../middlewares/auth');
const roomController = require('../controllers/roomController');

module.exports = function (app) {
    app.post('/rooms/new', auth.requireAuth, roomController.createNewRoom);
    app.get('/rooms', auth.requireAuth, roomController.getAllRooms);
    app.delete('/rooms/:id', auth.requireAuth, roomController.deleteRoom);
}