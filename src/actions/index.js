import {
    AUTH_USER,
    CHANGE_USER,
    AUTH_ERROR,
    FETCH_ROOMS,
    CREATE_ROOM,
    DELETE_ROOM
} from 'actions/types';
import backend from 'apis/backend';

export const signIn = (formValues, callback) => async dispatch => {
    try {
        const response = await backend.post('/signin', formValues);
        dispatch({ type: AUTH_USER, payload: response.data.token });
        localStorage.setItem("token", response.data.token);
        callback();
    } catch (e) {
        e.response.status === 401 ?
            dispatch({ type: AUTH_ERROR, payload: 'Email or password are incorrect!' }) :
            dispatch({ type: AUTH_ERROR, payload: e.response.data })
    }

}

export const signInGoogle = (token, callback) => dispatch => {
    dispatch({ type: AUTH_USER, payload: token });
    localStorage.setItem("token", token);
    callback();
}

export const signUp = (formValues, callback) => async dispatch => {
    try {
        const response = await backend.post('/signup', formValues);
        dispatch({ type: AUTH_USER, payload: response.data.token });
        localStorage.setItem("token", response.data.token);
        callback();
    } catch (e) {
        dispatch({ type: AUTH_ERROR, payload: e.response.data.error })
    }
}

export const signOut = () => dispatch => {
    dispatch({ type: AUTH_USER, payload: '' });
    dispatch({ type: CHANGE_USER, payload: {} });
    localStorage.removeItem("token");
}

export const fetchRooms = () => async dispatch => {
    try {
        const response = await backend.get('/rooms', {
            headers: {
                authorization: localStorage.getItem('token')
            }
        });
        dispatch({ type: FETCH_ROOMS, payload: response.data });
    } catch (e) {
        console.warn(e.response.data);
    }
}

export const createRoom = (formValues, callback) => async dispatch => {
    try {
        const response = await backend.post('/rooms/new', formValues, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        });
        dispatch({ type: CREATE_ROOM, payload: response.data });
        callback();
    } catch (e) {
        console.warn(e.response.data);
    }
}

export const fetchUser = (token) => async dispatch => {
    try {
        const user = await backend.get('/auth/user', { headers: { authorization: token } });
        dispatch({ type: CHANGE_USER, payload: user.data });
    } catch (e) {
        console.warn(e.response.data);
    }
}

export const deleteRoom = (id, callback) => async dispatch => {
    try {
        const response = await backend.delete(`/rooms/${id}`, { headers: { authorization: localStorage.getItem('token') } });
        dispatch({ type: DELETE_ROOM, payload: response.data });
        callback();
    } catch (e) {
        console.warn(e.response.data);
    }
}