import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from 'actions';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';

const CreateRoom = (props) => {
    function handleSubmit(formValues) {
        props.createRoom(formValues, () => {
            props.history.push('/rooms');
        });
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

export default connect(null, actions)(CreateRoom);