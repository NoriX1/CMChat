import _ from 'lodash';
import { FETCH_ROOMS, CREATE_ROOM, DELETE_ROOM } from 'actions/types'

export default (state = {}, action) => {
    switch (action.type) {
        case FETCH_ROOMS: {
            return { ...state, ..._.mapKeys(action.payload, '_id') };
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