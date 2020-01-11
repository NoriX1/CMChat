import _ from 'lodash';
import { FETCH_ROOMS, FETCH_ROOM, CREATE_ROOM, DELETE_ROOM } from 'actions/types'

export default (state = {}, action) => {
    switch (action.type) {
        case FETCH_ROOMS: {
            return { ..._.mapKeys(action.payload, '_id') };
        }
        case FETCH_ROOM: {
            return { ...state, [action.payload._id]: action.payload };
        }
        case CREATE_ROOM: {
            return { ...state, [action.payload._id]: action.payload };
        }
        case DELETE_ROOM: {
            return _.omit(state, action.payload._id);
        }
        default: { return state; }
    }
}