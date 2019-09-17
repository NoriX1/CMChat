import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import requireAuth from 'components/requireAuth';
import * as actionTypes from 'actions/types';

import Modal from 'components/Modal/Modal'

const CloseRoom = (props) => {

    function renderActions() {
        return (
            <React.Fragment>
                <Link to="/rooms" className="btn btn-secondary">Cancel</Link>
                <button className="btn btn-primary" onClick={() => {
                    props.dispatch({ type: actionTypes.DELETE_ROOM_REQUEST, payload: props.match.params.id });
                }}>Confirm</button>
            </React.Fragment>
        );
    }

    return (
        <Modal
            title="Closing your room"
            content={`You sure that you want to close this room? All data has been deleted!`}
            actions={renderActions()}
            onDismiss={() => { props.history.push('/rooms') }}
        />
    )
}

export default connect()(requireAuth(CloseRoom));