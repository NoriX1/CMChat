import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from 'actions';

import Modal from 'components/Modal/Modal'

const CloseRoom = (props) => {

    function renderActions() {
        return (
            <React.Fragment>
                <Link to="/rooms" className="btn btn-secondary">Cancel</Link>
                <button className="btn btn-primary" onClick={() => {
                    props.deleteRoom(props.match.params.id, () => {
                        props.history.push('/rooms');
                    });
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

export default connect(null, actions)(CloseRoom);