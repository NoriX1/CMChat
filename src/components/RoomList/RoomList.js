import React, { useEffect } from 'react';
import requireAuth from 'components/requireAuth';
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
                return <li key={room._id}>{room.name}</li>
            })
        }
    }

    return (
        <div className="container">
            <ul>{renderRoomsList()}</ul>
        </div>
    )
}

function mapStateToProps(state) {
    return { rooms: Object.values(state.rooms) }
}

export default connect(mapStateToProps, actions)(requireAuth(RoomList));