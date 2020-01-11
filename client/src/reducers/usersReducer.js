import _ from 'lodash';
import * as actionTypes from 'actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS: {
      return { ..._.mapKeys(action.payload, '_id') };
    }
    case actionTypes.RESET_USERS: {
      return {};
    }
    default: return state;
  }
}