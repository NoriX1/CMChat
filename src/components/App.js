import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

const App = (props) => {

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.fetchUser(localStorage.getItem('token'));
        }
    });

    return (
        <div>{props.children}</div>
    );
}

export default connect(null, actions)(App);