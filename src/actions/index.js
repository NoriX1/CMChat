import { AUTH_USER, AUTH_ERROR } from 'actions/types';
import backend from 'apis/backend';

export const signIn = (formValues, callback) => async dispatch => {
    try {
        const response = await backend.post('/signin', formValues);
        dispatch({ type: AUTH_USER, payload: response.data });
        localStorage.setItem("token", response.data);
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