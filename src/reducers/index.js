import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from 'reducers/authReducer';
import roomReducer from 'reducers/roomReducer';
import messageReducer from 'reducers/messageReducer';

export default combineReducers({
    form: formReducer,
    auth: authReducer,
    rooms: roomReducer,
    messages: messageReducer
});