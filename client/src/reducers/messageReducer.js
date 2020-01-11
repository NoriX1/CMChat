import _ from 'lodash';
import { FETCH_MESSAGES, RESET_MESSAGES, NEW_MESSAGE } from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case FETCH_MESSAGES: {
            return { ...state, ..._.mapKeys(action.payload, '_id') };
        }
        case NEW_MESSAGE: {
            return { [action.payload._id]: action.payload, ...state };
        }
        case RESET_MESSAGES: {
            return {};
        }
        default: return state;
    }
}