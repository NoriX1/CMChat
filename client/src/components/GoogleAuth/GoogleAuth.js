import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from 'actions/types';

const GoogleAuth = (props) => {

    useEffect(() => {
        if (props.match.params.token) {
            props.dispatch({ type: actionTypes.SIGN_IN_GOOGLE_REQUEST, payload: props.match.params.token });
        }
    });

    return (
        <div></div>
    )
}

export default connect()(GoogleAuth);