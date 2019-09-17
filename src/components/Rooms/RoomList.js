import React, { useEffect } from 'react';
import requireAuth from 'components/requireAuth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from 'actions/types';

const useMountEffect = (fun) => useEffect(fun, [])

const RoomList = (props) => {

    useMountEffect(() => {
        props.dispatch({ type: actionTypes.FETCH_ROOMS_REQUEST, payload: {} })
    });

    function renderRoomsList() {
        if (props.rooms.length) {
            return props.rooms.map((room) => {
                return (
                    <li key={room._id}>
                        <Link to={`/room/${room._id}`} className="list-group-item list-group-item-action d-flex justify-content-between">
                            <div>{room.name}</div>
                            <object><div>{renderOwnerOrDelete(room)}</div></object>
                        </Link>
                    </li>
                );
            });
        }
    }

    function renderOwnerOrDelete(room) {
        if (props.currentUser._id === room._owner._id) {
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
        <div className="container">
            <ul className="list-group">{renderRoomsList()}</ul>
            <Link className="btn btn-primary" to="/rooms/new">Create new</Link>
        </div>
    )
}

function mapStateToProps(state) {
    return { rooms: Object.values(state.rooms), currentUser: state.auth.currentUser }
}

export default connect(mapStateToProps)(requireAuth(RoomList));