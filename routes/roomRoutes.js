const auth = require('../middlewares/auth');
const roomController = require('../controllers/roomController');

module.exports = function (app) {
    app.post('/rooms/new', auth.requireAuth, roomController.createNewRoom);
    app.get('/rooms', auth.requireAuth, roomController.getAllRooms);
    app.delete('/rooms/:id', auth.requireAuth, roomController.deleteRoom);
    app.get('/rooms/:id/messages', auth.requireAuth, roomController.getAllMessagesFromRoom);
    app.get('/rooms/:id', auth.requireAuth, roomController.getRoom);
    app.get('/rooms/:id/users', auth.requireAuth, roomController.getAllUsersOfRoom);
    app.post('/rooms/checkpass', auth.requireAuth, roomController.checkPassword);
}