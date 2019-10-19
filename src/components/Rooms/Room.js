import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import requireAuth from 'components/requireAuth';
import { ToastsStore } from 'react-toasts';
import { reset, reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import * as actionTypes from 'actions/types';
import SocketContext from 'contexts/SocketContext';

const useMountEffect = (fun) => useEffect(fun, []);

const Room = (props) => {
    let endOfMessagesRef = React.createRef();
    const socket = useContext(SocketContext);

    useMountEffect(() => {
        props.dispatch({ type: actionTypes.FETCH_MESSAGES_REQUEST, payload: props.match.params.id });
        props.dispatch({ type: actionTypes.FETCH_USERS_REQUEST, payload: props.match.params.id });
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
            ToastsStore.success(`User ${user.name} is joined!`, 5000);
            props.dispatch({ type: actionTypes.FETCH_USERS_REQUEST, payload: props.match.params.id });
        });
        socket.on('disconnectUser', (user) => {
            ToastsStore.warning(`User ${user.name} is disconnected!`, 5000);
            props.dispatch({ type: actionTypes.FETCH_USERS_REQUEST, payload: props.match.params.id });
        });
        window.onunload = window.onbeforeunload = () => {
            socket.emit('leaveRoom', props.match.params.id);
        }
        return () => {
            props.dispatch({ type: actionTypes.RESET_MESSAGES_REQUEST, payload: {} });
            socket.emit('leaveRoom', props.match.params.id);
            socket.off();
        }
    });

    useEffect(() => {
        scrollToBottom();
        if (!props.rooms.length) {
            props.dispatch({ type: actionTypes.FETCH_ROOM_REQUEST, payload: props.match.params.id });
        }
    });

    function onSubmit(formValues) {
        const message = {
            room: props.match.params.id,
            content: formValues.content.replace(/(^\s+|\s+$)/g, '')
        }
        socket.emit('message', message);
        props.dispatch(reset('chatForm'));
    }

    function renderCurrentRoomName() {
        if (props.rooms.length) {
            const currentRoom = props.rooms.filter(room => { return room._id === props.match.params.id })[0]
            return <div className="btn btn-info">Current Room: {currentRoom.name}</div>
        }

    }

    function renderMessageList() {
        if (props.messages.length) {
            return props.messages.slice(0).reverse().map(message => {
                return (
                    <li key={message._id} className="">
                        <div>
                            User
                            <span style={{ fontWeight: "bold" }}> {message._user.name} </span>
                            writed on
                            <span style={{ fontWeight: "bold" }}>
                                {` ${new Date(message.dateSent).toLocaleDateString()}, ${new Date(message.dateSent).toLocaleTimeString()} `}
                            </span>
                        </div>
                        <div className="alert alert-secondary p-2">
                            {message.content.split(/(?:\r\n|\r|\n)/g).map((line, index) => <div key={index}>{line}</div>)}
                        </div>
                    </li>
                )
            })
        }
    }

    function scrollToBottom() {
        endOfMessagesRef.scrollIntoView({ behavior: 'smooth' });
    }

    function renderListOfUsers() {
        if (props.users.length) {
            return props.users.map((user) => {
                return <li key={user.name} className="btn btn-secondary mr-1 mb-1">{user.name}</li>
            });
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="d-flex justify-content-between mb-1">
                        {renderCurrentRoomName()}
                        <Link to="/rooms" className="btn btn-danger">Exit Chat</Link>
                    </div>
                    <ul>
                        {renderListOfUsers()}
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <ul style={{ maxHeight: "55vh", overflowY: "scroll" }}>
                        {renderMessageList()}
                        <li ref={(el) => { endOfMessagesRef = el }}></li>
                    </ul>
                    <form onSubmit={props.handleSubmit(onSubmit)}>
                        <div className="d-flex">
                            <Field name="content" component="textarea" className="form-control" placeholder="Enter your message" style={{ resize: 'none' }} />
                            <button type="submit" className="btn btn-primary">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth.currentUser,
        messages: Object.values(state.messages),
        rooms: Object.values(state.rooms),
        users: Object.values(state.users)
    };
}

function validate(values) {
    const errors = {}
    if (!values.content) {
        errors['content'] = 'Empty message';
    }
    if (values.content && values.content.replace(/(^\s+|\s+$)/g, '') === '') {
        errors['content'] = 'Empty message';
    }
    if (values.content && values.content.length > 4096) {
        values.content = values.content.slice(0, 4096);
    }
    return errors;
}

export default compose(
    connect(mapStateToProps),
    requireAuth,
    reduxForm({ form: 'chatForm', validate })
)(Room);