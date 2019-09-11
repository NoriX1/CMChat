import React, { useEffect } from 'react';
import requireAuth from 'components/requireAuth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from 'actions';

const useMountEffect = (fun) => useEffect(fun, [])

const RoomList = (props) => {

    useMountEffect(() => {
        props.fetchRooms();
    });

    function renderRoomsList() {
        if (props.rooms.length) {
            return props.rooms.map((room) => {
                return (
                    <li key={room._id}>
                        <Link to={`/rooms/${room._id}`} className="list-group-item list-group-item-action d-flex justify-content-between">
                            <div>{room.name}</div>
                            <div>{`Owner: ${room._owner.name}`}</div>
                        </Link>
                    </li>
                );
            })
        }
    }

    return (
        <div className="container">
            <ul className="list-group">{renderRoomsList()}</ul>
            <Link className="btn btn-primary" to="/rooms/new">Create new</Link>
        </div>
    )
}

function mapStateToProps(state) {
    return { rooms: Object.values(state.rooms) }
}

export default connect(mapStateToProps, actions)(requireAuth(RoomList));