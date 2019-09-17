import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import requireAuth from 'components/requireAuth';
import socketIOclient from 'socket.io-client';
import { ToastsStore } from 'react-toasts';
import { reset, reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import * as actionTypes from 'actions/types';

const useMountEffect = (fun) => useEffect(fun, []);

const Room = (props) => {

    const socket = socketIOclient(`localhost:3090?token=${localStorage.getItem('token')}`);

    useMountEffect(() => {
        socket.emit('roomInformation', props.match.params.id);
        socket.on('message', (message) => {
            ToastsStore.info(message);
        });
        socket.on('error', (error) => {
            ToastsStore.error(`${error.type} ${error.code}`, 5000);
        })
        return () => {
            socket.disconnect();
        }
    });

    function onSubmit(formValues) {
        const message = {
            room: props.match.params.id,
            content: formValues.content
        }
        socket.emit('message', message);
        props.dispatch(reset('chatForm'));
    }

    return (
        <div className="container">
            <form onSubmit={props.handleSubmit(onSubmit)}>
                <Field name="content" component="textarea" />
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
            <Link to="/rooms" className="btn btn-danger">Back</Link>
        </div>
    );
}

function mapStateToProps(state) {
    return { currentUser: state.auth.currentUser };
}

export default compose(
    connect(mapStateToProps),
    requireAuth,
    reduxForm({ form: 'chatForm' })
)(Room);