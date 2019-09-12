import { call, put, takeLatest } from 'redux-saga/effects';
import backend from 'apis/backend';
import history from '../history';
import * as actionTypes from 'actions/types';

function signUpApi(formValues) {
    return backend.post('/signup', formValues);
}
function signInApi(formValues) {
    return backend.post('/signin', formValues);
}
function getUserApi(token) {
    return backend.get('/auth/user', { headers: { authorization: token } });
}
function fetchRoomsApi(token) {
    return backend.get('/rooms', { headers: { authorization: token } });
}
function createRoomApi(formValues, token) {
    return backend.post('/rooms/new', formValues, { headers: { authorization: token } });
}
function deleteRoomApi(id, token) {
    return backend.delete(`/rooms/${id}`, { headers: { authorization: token } });
}


function* signUp(action) {
    try {
        const response = yield call(signUpApi, action.payload);
        yield put({ type: actionTypes.AUTH_USER, payload: response.data.token });
        localStorage.setItem('token', response.data.token);
        yield call(fetchUser);
        history.push('/rooms');
    } catch (e) {
        yield put({ type: actionTypes.AUTH_ERROR, payload: e.response.data.error });
    }
}

function* signIn(action) {
    try {
        const response = yield call(signInApi, action.payload);
        yield put({ type: actionTypes.AUTH_USER, payload: response.data.token });
        localStorage.setItem('token', response.data.token);
        yield call(fetchUser);
        history.push('/rooms');
    } catch (e) {
        e.response.status === 401 ?
            yield put({ type: actionTypes.AUTH_ERROR, payload: 'Email or password are incorrect!' }) :
            yield put({ type: actionTypes.AUTH_ERROR, payload: e.response.data });
    }
}

function* signInGoogle(action) {
    yield put({ type: actionTypes.AUTH_USER, payload: action.payload });
    localStorage.setItem('token', action.payload);
    history.push('/rooms');
}

function* signOut() {
    yield put({ type: actionTypes.AUTH_USER, payload: '' });
    yield put({ type: actionTypes.CHANGE_USER, payload: {} });
    localStorage.removeItem('token');
    history.push('/');
}

function* fetchUser() {
    try {
        const user = yield call(getUserApi, localStorage.getItem('token'));
        yield put({ type: actionTypes.CHANGE_USER, payload: user.data });
    } catch (e) {
        console.warn(e.response.data);
    }
}

function* fetchRooms() {
    try {
        const response = yield call(fetchRoomsApi, localStorage.getItem('token'));
        yield put({ type: actionTypes.FETCH_ROOMS, payload: response.data })
    } catch (e) {
        console.warn(e.response.data);
    }
}

function* createRoom(action) {
    try {
        const response = yield call(createRoomApi, action.payload, localStorage.getItem('token'));
        yield put({ type: actionTypes.CREATE_ROOM, payload: response.data });
        history.push('/rooms');
    } catch (e) {
        console.warn(e.response.data);
    }
}

function* deleteRoom(action){
    try {
        const response = yield call(deleteRoomApi, action.payload, localStorage.getItem('token'));
        yield put({ type: actionTypes.DELETE_ROOM, payload: response.data });
        history.push('/rooms');
    } catch (e) {
        console.warn(e.response.data);
    }
}

function* mySaga() {
    yield takeLatest(actionTypes.SIGN_UP_REQUEST, signUp);
    yield takeLatest(actionTypes.SIGN_IN_REQUEST, signIn);
    yield takeLatest(actionTypes.SIGN_IN_GOOGLE_REQUEST, signInGoogle);
    yield takeLatest(actionTypes.SIGN_OUT_REQUEST, signOut);
    yield takeLatest(actionTypes.FETCH_USER_REQUEST, fetchUser);
    yield takeLatest(actionTypes.FETCH_ROOMS_REQUEST, fetchRooms);
    yield takeLatest(actionTypes.CREATE_ROOM_REQUEST, createRoom);
    yield takeLatest(actionTypes.DELETE_ROOM_REQUEST, deleteRoom);
}

export default mySaga;