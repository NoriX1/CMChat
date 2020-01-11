import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SocketContext from 'contexts/SocketContext';
import * as actionTypes from 'actions/types';

const Header = (props) => {
    const socket = useContext(SocketContext);

    function onSignOutClick() {
        return new Promise((resolve, reject) => {
            props.dispatch({ type: actionTypes.SIGN_OUT_REQUEST, payload: { resolve, reject } });
        }).then(() => { socket.disconnect() });

    }

    return (
        <div className="navbar navbar-expand-md navbar-dark bg-dark shadow p-2 mb-2">
            {props.auth ?
                <Link className="navbar-brand" to="/rooms"><h4>CMChat</h4></Link> :
                <Link className="navbar-brand" to="/"><h4>CMChat</h4></Link>}
            <div className="navbar ml-auto">
                {props.auth &&
                    <div className="ml-auto">
                        <Link to="/profile" className="btn btn-outline-info mr-2">Hi{props.currentUser ? `, ${props.currentUser.name}!` : ` !`}</Link>
                        <button className="btn btn-danger" onClick={onSignOutClick}>Sign Out</button>
                    </div>}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { auth: state.auth.authenticated, currentUser: state.auth.currentUser }
}

export default connect(mapStateToProps)(Header);