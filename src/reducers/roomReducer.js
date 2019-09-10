import _ from 'lodash';
import { FETCH_ROOMS } from 'actions/types'

export default (state = {}, action) => {
    switch (action.type) {
        case FETCH_ROOMS: {
            return { ...state, ..._.mapKeys(action.payload, '_id') }
        }
        default: { return state; }
    }
}