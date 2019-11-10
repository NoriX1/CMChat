const auth = require('../middlewares/auth');
const roomController = require('../controllers/roomController');

module.exports = function (app) {
    app.post('/rooms/new', auth.requireAuth, roomController.createNewRoom);
    app.get('/rooms', auth.requireAuth, roomController.getAllRooms);
    app.delete('/rooms/:id', auth.requireAuth, roomController.deleteRoom);
    app.post('/rooms/messages', auth.requireAuth, roomController.fetchAllMessagesFromRoom);
    app.get('/rooms/:id', auth.requireAuth, roomController.getRoom);
    app.get('/rooms/:id/users', auth.requireAuth, roomController.getAllUsersOfRoom);
}