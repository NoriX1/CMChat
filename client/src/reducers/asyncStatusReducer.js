import {
  INITIATE_REQUEST,
  REQUEST_SUCCESS,
  REQUEST_ERROR
} from 'actions/types'

const NOT_INITIATED = 0;

const INITIAL_STATE = {
  requestError: {},
  userIsLoaded: NOT_INITIATED,
  roomsAreLoaded: NOT_INITIATED,
  roomIsLoaded: NOT_INITIATED,
  roomIsDeleted: NOT_INITIATED,
  messagesAreFetched: NOT_INITIATED,
  usersAreFetched: NOT_INITIATED
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INITIATE_REQUEST: {
      return { ...state, ...action.payload }
    }
    case REQUEST_SUCCESS: {
      return { ...state, ...action.payload }
    }
    case REQUEST_ERROR: {
      return { ...state, ...action.payload }
    }
    default: { return state; }
  }
}