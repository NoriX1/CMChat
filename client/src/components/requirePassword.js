import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from 'actions/types';
import Modal from 'components/Modal/Modal'
import { Link } from 'react-router-dom';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';

export default (ChildComponent) => {
  const useMountEffect = (fun) => useEffect(fun, []);
  const ComposedComponent = (props) => {
    const [displayComponent, setDisplayComponent] = useState(false);
    useMountEffect(() => {
      if (!props.currentRoom) {
        props.dispatch({ type: actionTypes.FETCH_ROOM_REQUEST, payload: props.match.params.id });
      }
    });

    function handleSubmit(formValues) {
      return new Promise((resolve, reject) => {
        props.dispatch(
          {
            type: actionTypes.FETCH_MESSAGES_REQUEST,
            payload: {
              formValues: { _id: props.currentRoom._id, ...formValues },
              resolve,
              reject
            }
          });
      }).then(() => { setDisplayComponent(true) });
    }

    function renderButtons() {
      return (
        <div className="d-flex justify-content-between">
          <Link to="/rooms" className="btn btn-danger w-50">Back</Link>
          <button type="submit" className="btn btn-success w-50">Submit</button>
        </div>
      );
    }

    function renderComponent() {
      if ((props.currentRoom && !props.currentRoom.isPrivate) || displayComponent) {
        return <ChildComponent {...props} />;
      }
      if (props.currentRoom && props.currentRoom.isPrivate) {
        return (
          <Modal
            title="Joining private room"
            content={
              <Form
                title=''
                fields={fields.privateRoom}
                onSubmit={handleSubmit}
                renderButtons={renderButtons}
              />
            }
            onDismiss={() => { props.history.push('/rooms') }}
          />
        );
      }
      return <div></div>;
    }
    return renderComponent();
  }

  function mapStateToProps(state, props) {
    return {
      auth: state.auth.authenticated,
      currentUser: state.auth.currentUser,
      currentRoom: state.rooms[props.match.params.id]
    };
  }

  return connect(mapStateToProps)(ComposedComponent);
};
