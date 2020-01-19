import { call, put, takeLatest } from 'redux-saga/effects';
import backend from 'apis/backend';
import history from '../history';
import { SubmissionError } from 'redux-form';
import * as actionTypes from 'actions/types';

const INITIATED = 1, SUCCESSED = 2, FAILED = 3;

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
    yield put({ type: actionTypes.INITIATE_REQUEST, payload: { userIsLoaded: INITIATED, requestError: {} } });
    const user = yield call(backendApi, 'get', '/auth/user', {}, localStorage.getItem('token'));
    yield put({ type: actionTypes.REQUEST_SUCCESS, payload: { userIsLoaded: SUCCESSED } });
    yield put({ type: actionTypes.CHANGE_USER, payload: user.data });
  } catch (e) {
    yield put({
      type: actionTypes.REQUEST_ERROR, payload: {
        userIsLoaded: FAILED,
        requestError: { status: e.response.status, statusText: e.response.statusText, data: e.response.data, tip: 'userIsNotLoaded' }
      }
    });
  }
}

function* fetchRooms() {
  try {
    yield put({ type: actionTypes.INITIATE_REQUEST, payload: { roomsAreLoaded: INITIATED, requestError: {} } });
    const response = yield call(backendApi, 'get', '/rooms', {}, localStorage.getItem('token'));
    yield put({ type: actionTypes.REQUEST_SUCCESS, payload: { roomsAreLoaded: SUCCESSED, requestError: {} } });
    yield put({ type: actionTypes.FETCH_ROOMS, payload: response.data });
  } catch (e) {
    yield put({
      type: actionTypes.REQUEST_ERROR, payload: {
        roomsAreLoaded: FAILED,
        requestError: { status: e.response.status, statusText: e.response.statusText, data: e.response.data, tip: 'roomsAreNotLoaded' }
      }
    });
  }
}

function* fetchRoom(action) {
  try {
    yield put({ type: actionTypes.INITIATE_REQUEST, payload: { roomIsLoaded: INITIATED, requestError: {} } });
    const response = yield call(backendApi, 'get', `/rooms/${action.payload}`, {}, localStorage.getItem('token'));
    yield put({ type: actionTypes.REQUEST_SUCCESS, payload: { roomIsLoaded: SUCCESSED, requestError: {} } });
    yield put({ type: actionTypes.FETCH_ROOM, payload: response.data });
  } catch (e) {
    yield put({
      type: actionTypes.REQUEST_ERROR, payload: {
        roomIsLoaded: FAILED,
        requestError: { status: e.response.status, statusText: e.response.statusText, data: e.response.data, tip: 'roomIsNotFetched' }
      }
    });
  }
}

function* createRoom(action) {
  try {
    yield put({ type: actionTypes.INITIATE_REQUEST, payload: { roomIsLoaded: INITIATED, requestError: {} } });
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
    yield put({ type: actionTypes.INITIATE_REQUEST, payload: { roomIsDeleted: INITIATED, requestError: {} } });
    const response = yield call(backendApi, 'delete', `/rooms/${action.payload.id}`, {}, localStorage.getItem('token'));
    yield put({ type: actionTypes.REQUEST_SUCCESS, payload: { roomIsDeleted: SUCCESSED, requestError: {} } });
    yield put({ type: actionTypes.DELETE_ROOM, payload: response.data });
    action.payload.resolve();
    history.push('/rooms');
  } catch (e) {
    yield put({
      type: actionTypes.REQUEST_ERROR, payload: {
        roomIsDeleted: FAILED,
        requestError: { status: e.response.status, statusText: e.response.statusText, data: e.response.data, tip: 'roomIsNotDeleted' }
      }
    });
  }
}

function* fetchMessages(action) {
  try {
    yield put({ type: actionTypes.INITIATE_REQUEST, payload: { messagesAreFetched: INITIATED, requestError: {} } });
    const response = yield call(backendApi, 'post', `/rooms/messages`, action.payload.formValues, localStorage.getItem('token'));
    yield put({ type: actionTypes.REQUEST_SUCCESS, payload: { messagesAreFetched: SUCCESSED, requestError: {} } });
    yield put({ type: actionTypes.FETCH_MESSAGES, payload: response.data });
    if (action.payload.resolve) { action.payload.resolve(response.data) };
  } catch (e) {
    if (action.payload.reject) {
      action.payload.reject(new SubmissionError({ _error: e.response.data.error }));
    } else {
      yield put({
        type: actionTypes.REQUEST_ERROR, payload: {
          messagesAreFetched: FAILED,
          requestError: { status: e.response.status, statusText: e.response.statusText, data: e.response.data, tip: 'messagesAreNotFetched' }
        }
      });
    }
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
    yield put({ type: actionTypes.INITIATE_REQUEST, payload: { usersAreFetched: INITIATED, requestError: {} } });
    const response = yield call(backendApi, 'get', `/rooms/${action.payload}/users`, {}, localStorage.getItem('token'));
    yield put({ type: actionTypes.REQUEST_SUCCESS, payload: { usersAreFetched: SUCCESSED } });
    yield put({ type: actionTypes.FETCH_USERS, payload: response.data });
  } catch (e) {
    yield put({
      type: actionTypes.REQUEST_ERROR, payload: {
        usersAreFetched: FAILED,
        requestError: { status: e.response.status, statusText: e.response.statusText, data: e.response.data, tip: 'usersAreNotFetched' }
      }
    });
  }
}

function* resetUsers() {
  yield put({ type: actionTypes.RESET_USERS, payload: {} });
}

function* editUser(action) {
  try {
    const response = yield call(backendApi, 'put', '/users/edit', action.payload.formValues, localStorage.getItem('token'));
    yield put({ type: actionTypes.CHANGE_USER, payload: response.data });
    action.payload.resolve();
  } catch (e) {
    action.payload.reject(new SubmissionError({ _error: e.response.data.error }));
  }
}

function* checkAuth(action) {
  try {
    yield call(backendApi, 'get', '/auth/check', null, localStorage.getItem('token'));
    action.payload.resolve();
  } catch (e) {
    action.payload.reject(e.response);
  }
}

export default function* rootSaga() {
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
  yield takeLatest(actionTypes.EDIT_USER_REQUEST, editUser);
  yield takeLatest(actionTypes.CHECK_AUTH_REQUEST, checkAuth);
}