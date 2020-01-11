import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actionTypes from 'actions/types';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';
import requireAuth from 'components/requireAuth';
import SocketContext from 'contexts/SocketContext';

const EditUser = (props) => {

    const socket = useContext(SocketContext);

    function handleSubmit(formValues) {
        return new Promise((resolve, reject) => {
            props.dispatch({ type: actionTypes.EDIT_USER_REQUEST, payload: { formValues: formValues, resolve, reject } });
        }).then(() => {
            props.history.push('/rooms');
            socket.emit('updateRoomList');
        });
    }

    function renderButtons() {
        return (
            <div className="d-flex justify-content-between">
                <Link to="/rooms" className="btn btn-danger w-50">Back</Link>
                <button type="submit" className="btn btn-success w-50">Save changes</button>
            </div>
        );
    }

    function renderInfo() {
        return (
            <React.Fragment>
                <div>ID: <b>{props.currentUser && props.currentUser._id}</b></div>
                <div>Email: <b>{props.currentUser && props.currentUser.email}</b></div>
                <div>Nickname: <b>{props.currentUser && props.currentUser.name}</b></div>
            </React.Fragment>
        );

    }

    return (
        <div>
            <div className="container text-center">
                <div className="row d-flex justify-content-center">

                    <div className="col col-md-6 col-lg-4 col-xl-3">
                        <h3>Your Profile</h3>
                        {renderInfo()}
                        <Form
                            title=''
                            fields={fields.editUser}
                            onSubmit={handleSubmit}
                            renderButtons={renderButtons}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { currentUser: state.auth.currentUser };
}

export default connect(mapStateToProps)(requireAuth(EditUser));