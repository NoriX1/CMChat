import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from 'actions/types';

const App = (props) => {

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.dispatch({ type: actionTypes.FETCH_USER_REQUEST, payload: {} })
        }
    });

    return (
        <div>{props.children}</div>
    );
}

export default connect()(App);