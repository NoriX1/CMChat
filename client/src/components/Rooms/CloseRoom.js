import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import requireAuth from 'components/requireAuth';
import * as actionTypes from 'actions/types';


import Modal from 'components/Modal/Modal'
import SocketContext from 'contexts/SocketContext';

const CloseRoom = (props) => {

  const socket = useContext(SocketContext);

  function onClose() {
    return new Promise((resolve, reject) => {
      props.dispatch({ type: actionTypes.DELETE_ROOM_REQUEST, payload: { id: props.match.params.id, resolve, reject } });
    }).then(() => { socket.emit('closeRoom', props.match.params.id) });
  }

  function renderActions() {
    return (
      <React.Fragment>
        <Link to="/rooms" className="btn btn-secondary">Cancel</Link>
        <button className="btn btn-primary" onClick={onClose}>Confirm</button>
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