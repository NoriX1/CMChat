import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

const Header = (props) => {

    function onSignOutClick() {
        props.signOut();
        props.history.push('/');
    }

    return (
        <div className="header">
            <div className="container">
                <div className="row">
                    <div className="col-10 text-center"><h4>CMChat</h4></div>
                    {props.auth && <div className="col-2"><button className="btn btn-danger" onClick={onSignOutClick}>SignOut</button></div>}
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { auth: state.auth.authenticated }
}

export default connect(mapStateToProps, actions)(Header);