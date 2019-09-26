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
            <div>
                <Link to="/rooms" className="btn btn-danger">Cancel</Link>
                <button type="submit" className="btn btn-success">Create room</button>
            </div>
        );
    }

    return (
        <div>
            <div className="container text-center">
                <h3>Creating a new chat room</h3>
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <Form
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