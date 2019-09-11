import { AUTH_USER, AUTH_ERROR, CHANGE_USER } from 'actions/types';

const INITIAL_STATE = {
    authenticated: '',
    errorMessage: '',
    currentUser: {}
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case AUTH_USER: {
            return { ...state, authenticated: action.payload, errorMessage: '' };
        }
        case AUTH_ERROR: {
            return { ...state, errorMessage: action.payload };
        }
        case CHANGE_USER: {
            return { ...state, currentUser: action.payload };
        }
        default: { return state; }
    }
}