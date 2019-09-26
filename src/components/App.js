import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import SocketContext from 'contexts/SocketContext';
import * as actionTypes from 'actions/types';

const App = (props) => {

    const socket = io(`${process.env.REACT_APP_SOCKET_URI}?token=${props.auth}`);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.dispatch({ type: actionTypes.FETCH_USER_REQUEST, payload: {} })
        }
        return () => {
            socket.disconnect();
        }
    });
    return (
        <div>
            <SocketContext.Provider value={socket}>
                {props.children}
            </SocketContext.Provider>
        </div>
    );
}

function mapStateToProps(state) {
    return { auth: state.auth.authenticated }
}

export default connect(mapStateToProps)(App);