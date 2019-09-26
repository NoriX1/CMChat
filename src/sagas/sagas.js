import { call, put, takeLatest } from 'redux-saga/effects';
import backend from 'apis/backend';
import history from '../history';
import { ToastsStore } from 'react-toasts';
import { SubmissionError } from 'redux-form';

import * as actionTypes from 'actions/types';

const NOTIFICATIONS_DURATION = 5000;

function backendApi(type, url, props = {}, token = '') {
    return backend.request({
        method: type,
        url,
        data: props,
        headers: { authorization: token }
    });
}

function* signUp(action) {
    try {
        const response = yield call(backendApi, 'post', '/signup', action.payload.formValues);
        yield put({ type: actionTypes.AUTH_USER, payload: response.data.token });
        localStorage.setItem('token', response.data.token);
        yield call(fetchUser);
        action.payload.resolve();
        history.push('/rooms');
    } catch (e) {
        action.payload.reject(new SubmissionError({ _error: e.response.data.error }));
    }
}

function* signIn(action) {
    try {
        const response = yield call(backendApi, 'post', '/signin', action.payload.formValues);
        yield put({ type: actionTypes.AUTH_USER, payload: response.data.token });
        localStorage.setItem('token', response.data.token);
        yield call(fetchUser);
        action.payload.resolve();
        history.push('/rooms');
    } catch (e) {
        if (e.response.status === 401) {
            action.payload.reject(new SubmissionError({ _error: 'Incorrect email or password' }));
        } else {
            action.payload.reject(new SubmissionError({ _error: e.response.data || 'Authentication failed' }));
        }
    }
}

function* signInGoogle(action) {
    yield put({ type: actionTypes.AUTH_USER, payload: action.payload });
    localStorage.setItem('token', action.payload);
    history.push('/rooms');
}

function* signOut(action) {
    yield put({ type: actionTypes.AUTH_USER, payload: '' });
    yield put({ type: actionTypes.CHANGE_USER, payload: {} });
    localStorage.removeItem('token');
    history.push('/');
    action.payload.resolve();
}

function* fetchUser() {
    try {
        const user = yield call(backendApi, 'get', '/auth/user', {}, localStorage.getItem('token'));

        yield put({ type: actionTypes.CHANGE_USER, payload: user.data });
    } catch (e) {
        ToastsStore.error(e.response.data, NOTIFICATIONS_DURATION);
    }
}

function* fetchRooms() {
    try {
        const response = yield call(backendApi, 'get', '/rooms', {}, localStorage.getItem('token'));

        yield put({ type: actionTypes.FETCH_ROOMS, payload: response.data })
    } catch (e) {
        ToastsStore.error(e.response.data, NOTIFICATIONS_DURATION);
    }
}

function* fetchRoom(action) {
    try {
        const response = yield call(backendApi, 'get', `/rooms/${action.payload}`, {}, localStorage.getItem('token'));

        yield put({ type: actionTypes.FETCH_ROOM, payload: response.data })
    } catch (e) {
        ToastsStore.error(e.response.data, NOTIFICATIONS_DURATION);
    }
}

function* createRoom(action) {
    try {
        const response = yield call(backendApi, 'post', '/rooms/new', action.payload.formValues, localStorage.getItem('token'));
        yield put({ type: actionTypes.CREATE_ROOM, payload: response.data });
        action.payload.resolve(response.data._id);
        history.push('/rooms');
    } catch (e) {
        action.payload.reject(new SubmissionError({ _error: e.response.data.error }));
    }
}

function* deleteRoom(action) {
    try {
        const response = yield call(backendApi, 'delete', `/rooms/${action.payload.id}`, {}, localStorage.getItem('token'));
        yield put({ type: actionTypes.DELETE_ROOM, payload: response.data });
        action.payload.resolve();
        history.push('/rooms');
    } catch (e) {
        ToastsStore.error(e.response.data, NOTIFICATIONS_DURATION);
    }
}

function* fetchMessages(action) {
    try {
        const response = yield call(backendApi, 'get', `/rooms/${action.payload}/messages`, {}, localStorage.getItem('token'));
        yield put({ type: actionTypes.FETCH_MESSAGES, payload: response.data });
    } catch (e) {
        ToastsStore.error(`${e.response.status}:${e.response.statusText}`, NOTIFICATIONS_DURATION);
    }
}

function* newMessage(action) {
    yield put({ type: actionTypes.NEW_MESSAGE, payload: action.payload });
}

function* resetMessages() {
    yield put({ type: actionTypes.RESET_MESSAGES, payload: {} });
}

function* fetchUsersFromRoom(action) {
    try {
        const response = yield call(backendApi, 'get', `/rooms/${action.payload}/users`, {}, localStorage.getItem('token'));
        yield put({ type: actionTypes.FETCH_USERS, payload: response.data });
    } catch (e) {
        ToastsStore.error(`${e.response.status}:${e.response.statusText}`, NOTIFICATIONS_DURATION);
    }
}

function* resetUsers() {
    yield put({ type: actionTypes.RESET_USERS, payload: {} });
}

function* mySaga() {
    yield takeLatest(actionTypes.SIGN_UP_REQUEST, signUp);
    yield takeLatest(actionTypes.SIGN_IN_REQUEST, signIn);
    yield takeLatest(actionTypes.SIGN_IN_GOOGLE_REQUEST, signInGoogle);
    yield takeLatest(actionTypes.SIGN_OUT_REQUEST, signOut);
    yield takeLatest(actionTypes.FETCH_USER_REQUEST, fetchUser);
    yield takeLatest(actionTypes.FETCH_ROOM_REQUEST, fetchRoom);
    yield takeLatest(actionTypes.FETCH_ROOMS_REQUEST, fetchRooms);
    yield takeLatest(actionTypes.CREATE_ROOM_REQUEST, createRoom);
    yield takeLatest(actionTypes.DELETE_ROOM_REQUEST, deleteRoom);
    yield takeLatest(actionTypes.FETCH_MESSAGES_REQUEST, fetchMessages);
    yield takeLatest(actionTypes.RESET_MESSAGES_REQUEST, resetMessages);
    yield takeLatest(actionTypes.NEW_MESSAGE_REQUEST, newMessage);
    yield takeLatest(actionTypes.FETCH_USERS_REQUEST, fetchUsersFromRoom);
    yield takeLatest(actionTypes.RESET_USERS_REQUEST, resetUsers);
}

export default mySaga;