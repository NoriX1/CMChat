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
        <div className="header">
            <div className="container">
                <div className="row mt-3 mb-3">
                    <div className="col-6 text-left">
                        {props.auth ?
                            <Link to="/rooms"><h4>CMChat</h4></Link> :
                            <Link to="/"><h4>CMChat</h4></Link>}
                    </div>
                    {props.auth &&
                        <div className="col-6 text-right">
                            <div className="btn btn-outline-info">Welcome{props.currentUser ? `, ${props.currentUser.name}` : ` !`}</div>
                            <button className="btn btn-danger" onClick={onSignOutClick}>Sign Out</button>
                        </div>}
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { auth: state.auth.authenticated, currentUser: state.auth.currentUser }
}

export default connect(mapStateToProps)(Header);