import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import requireAuth from 'components/requireAuth';
import socket from 'apis/socket';
import { ToastsStore } from 'react-toasts';
import { reset, reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import * as actionTypes from 'actions/types';

const useMountEffect = (fun) => useEffect(fun, []);

const Room = (props) => {
    let endOfMessagesRef = React.createRef();

    useMountEffect(() => {
        props.dispatch({ type: actionTypes.FETCH_MESSAGES_REQUEST, payload: props.match.params.id });
        socket.emit('joinRoom', props.match.params.id);
        socket.on('message', (message) => {
            props.dispatch({ type: actionTypes.NEW_MESSAGE_REQUEST, payload: message });
        });
        socket.on('error', (error) => {
            ToastsStore.error(`${error.type}: ${error.code}`, 5000);
            props.history.push('/rooms');
        });
        socket.on('errorEvent', (error) => {
            ToastsStore.error(`${error.type}: ${error.code}`, 5000);
            props.history.push('/rooms');
        });
        socket.on('closeRoom', () => {
            ToastsStore.error(`Room is closed by owner`, 5000);
            props.history.push('/rooms');
        });
        socket.on('joinUser', (user) => {
            ToastsStore.success(`User ${user.name} is joined!`);
        });
        socket.on('disconnectUser', (user) => {
            ToastsStore.warning(`User ${user.name} is disconnected!`);
        });
        window.addEventListener('beforeunload', (e) => {
            socket.emit('leaveRoom', props.match.params.id);
        });
        return () => {
            props.dispatch({ type: actionTypes.RESET_MESSAGES_REQUEST, payload: {} });
            socket.emit('leaveRoom', props.match.params.id);
            socket.off();
        }
    });

    useEffect(() => {
        scrollToBottom();
    });

    function onSubmit(formValues) {
        const message = {
            room: props.match.params.id,
            content: formValues.content
        }
        socket.emit('message', message);
        props.dispatch(reset('chatForm'));
    }

    function renderMessageList() {
        if (props.messages.length) {
            return props.messages.slice(0).reverse().map(message => {
                return (
                    <li key={message._id} className="list-group-item">
                        <div>
                            User
                            <span style={{ fontWeight: "bold" }}> {message._user.name} </span>
                            writed on
                            <span style={{ fontWeight: "bold" }}>
                                {` ${new Date(message.dateSent).toLocaleDateString()}, ${new Date(message.dateSent).toLocaleTimeString()} `}
                            </span>
                        </div>
                        <div className="alert alert-secondary">
                            {message.content}
                        </div>
                    </li>
                )
            })
        }
    }

    function scrollToBottom() {
        endOfMessagesRef.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="container">
            <Link to="/rooms" className="btn btn-danger">Exit Chat</Link>
            <ul className="list-group" style={{ maxHeight: "60vh", overflowY: "scroll" }}>
                {renderMessageList()}
                <li ref={(el) => { endOfMessagesRef = el }}></li>
            </ul>
            <form onSubmit={props.handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-11">
                        <Field name="content" component="textarea" className="form-control" placeholder="Enter your message" />
                    </div>
                    <div className="col-1">
                        <button type="submit" className="btn btn-primary">Send</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function mapStateToProps(state) {
    return { currentUser: state.auth.currentUser, messages: Object.values(state.messages) };
}

export default compose(
    connect(mapStateToProps),
    requireAuth,
    reduxForm({ form: 'chatForm' })
)(Room);