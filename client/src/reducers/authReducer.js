import { AUTH_USER, CHANGE_USER } from 'actions/types';

const INITIAL_STATE = {
  authenticated: '',
  currentUser: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER: {
      return { ...state, authenticated: action.payload };
    }
    case CHANGE_USER: {
      return { ...state, currentUser: action.payload };
    }
    default: { return state; }
  }
}