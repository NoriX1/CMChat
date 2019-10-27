import React, { useContext } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import * as actionTypes from 'actions/types';
import FormField from '../Form/FormField';
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
                        <div className="mt-5">
                            <form onSubmit={props.handleSubmit(handleSubmit)}>
                                <h1 className="h3 mb3 font-weight-bold">Adding new room</h1>
                                <Field component={FormField} type='text' label='Enter the name of room' name='name' />
                                <Field component={FormField} type='checkbox' style={{ fontSize: '.5rem' }} label='Is it a private room?' name='private' />
                                {props.isPrivate && <Field component={FormField} type='password' label='Password for private room' name='password' />}
                                {props.error && <div className="alert alert-danger">{props.error}</div>}
                                {renderButtons()}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function validate(values, props) {
    const errors = {};
    if (values['name'] && values['name'].length > 10) {
        errors['name'] = 'Max length 10 characters';
    }
    const re = /^[A-Za-zА-Я-а-я0-9_]+$/;
    if (!re.test(values['name'])) {
        errors['name'] = 'Only letters and numbers (and _ ) are allowed';
    }
    if (values['password'] && props.isPrivate && values['password'].length < 4) {
        errors['password'] = 'Min length of password is 4 symbols';
    }
    if (!values['name']) {
        errors['name'] = `You must provide a name of your room`;
    }
    return errors;
}

function mapStateToProps(state) {
    return { isPrivate: (state.form.createRoomForm && state.form.createRoomForm.values) ? state.form.createRoomForm.values.private : false };
}

export default compose(
    connect(mapStateToProps),
    requireAuth,
    reduxForm({
        form: 'createRoomForm',
        validate,
        initialValues: { private: false }
    })
)(CreateRoom);