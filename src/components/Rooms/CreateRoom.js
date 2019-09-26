import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actionTypes from 'actions/types';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';
import requireAuth from 'components/requireAuth';
import SocketContext from 'contexts/SocketContext';

const CreateRoom = (props) => {

    const socket = useContext(SocketContext);

    function handleSubmit(formValues) {
        return new Promise((resolve, reject) => {
            props.dispatch({ type: actionTypes.CREATE_ROOM_REQUEST, payload: { formValues: formValues, resolve, reject } });
        }).then((id) => { socket.emit('updateRoomInList', { id }) });

    }

    function renderButtons() {
        return (
            <div className="d-flex justify-content-between">
                <Link to="/rooms" className="btn btn-danger w-50">Cancel</Link>
                <button type="submit" className="btn btn-success w-50">Create room</button>
            </div>
        );
    }

    return (
        <div>
            <div className="container text-center">
                <div className="row d-flex justify-content-center">
                    <div className="col col-md-6 col-lg-4 col-xl-3">
                        <Form
                            title='Add new room'
                            fields={fields.newRoom}
                            onSubmit={handleSubmit}
                            renderButtons={renderButtons}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default connect()(requireAuth(CreateRoom));