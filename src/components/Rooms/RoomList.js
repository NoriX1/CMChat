import React, { useEffect, useContext } from 'react';
import requireAuth from 'components/requireAuth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SocketContext from 'contexts/SocketContext';
import * as actionTypes from 'actions/types';

const useMountEffect = (fun) => useEffect(fun, [])

const RoomList = (props) => {
    const socket = useContext(SocketContext);

    useMountEffect(() => {
        props.dispatch({ type: actionTypes.FETCH_ROOMS_REQUEST, payload: {} });
        socket.on('updateRoomInList', (roomId) => {
            props.dispatch({ type: actionTypes.FETCH_ROOM_REQUEST, payload: roomId.id });
        });
        socket.on('updateRoomList', () => {
            props.dispatch({ type: actionTypes.FETCH_ROOMS_REQUEST, payload: {} });
        });
        return () => {
            socket.off();
        }
    });


    function renderRoomsList() {
        if (props.rooms.length) {
            return props.rooms.map((room) => {
                return (
                    <li className="mb-1" key={room._id}>
                        <Link to={`/room/${room._id}`} className="list-group-item list-group-item-dark list-group-item-action d-flex justify-content-between align-items-center">
                            <div>{`${room.name}, ${room.countOfUsers || 0} user(s) joined`}</div>
                            <object>{renderOwnerOrDelete(room)}</object>
                        </Link>
                    </li>
                );
            });
        }
    }

    function renderOwnerOrDelete(room) {
        if (props.currentUser && (props.currentUser._id === room._owner._id)) {
            return (
                <div>
                    <div className="btn btn-secondary">{`Owner: ${room._owner.name}`}</div>
                    <Link className="btn btn-danger" to={`/rooms/close/${room._id}`}>Close</Link>
                </div>
            )
        }
        return <div className="btn btn-secondary">{`Owner: ${room._owner.name}`}</div>
    }

    return (
        <div className="container text-center">
            <ul className="list-group mb-3" style={{maxHeight: '70vh', overflowY: 'auto'}}>{renderRoomsList()}</ul>
            <Link className="btn btn-primary" to="/rooms/new">Create new</Link>
        </div>
    )
}

function mapStateToProps(state) {
    return { rooms: Object.values(state.rooms), currentUser: state.auth.currentUser }
}

export default connect(mapStateToProps)(requireAuth(RoomList));