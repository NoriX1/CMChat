import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { ToastsStore } from 'react-toasts';
import SocketContext from 'contexts/SocketContext';
import * as actionTypes from 'actions/types';

export default (ChildComponent) => {

  const useMountEffect = (fun) => useEffect(fun, []);

  const ComposedComponent = (props) => {

    const socket = useContext(SocketContext);
    const [displayChild, setDisplayChild] = useState(false);

    useMountEffect(() => {
      shouldNavigateAway();
    });

    function shouldNavigateAway() {
      new Promise((resolve, reject) => {
        props.dispatch({
          type: actionTypes.CHECK_AUTH_REQUEST, payload: {
            resolve,
            reject
          }
        });
      }).then(() => { setDisplayChild(true) }, (reason) => {
        ToastsStore.warning(`${reason.data}: token invalid or expired`, 5000);
        return new Promise((resolve, reject) => {
          props.dispatch({ type: actionTypes.SIGN_OUT_REQUEST, payload: { resolve, reject } });
        }).then(() => { socket.disconnect() });
      });
    }

    function renderComponent() {
      if (!displayChild) {
        return <div></div>
      } else {
        return <ChildComponent {...props} />
      }
    }

    return renderComponent();
  }

  function mapStateToProps(state) {
    return { auth: state.auth.authenticated };
  }

  return connect(mapStateToProps)(ComposedComponent);
};
