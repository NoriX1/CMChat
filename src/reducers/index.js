import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from 'reducers/authReducer';
import roomReducer from 'reducers/roomReducer';

export default combineReducers({
    form: formReducer,
    auth: authReducer,
    rooms: roomReducer
});