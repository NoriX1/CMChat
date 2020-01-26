import _ from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ToastsContainer, ToastsStore } from 'react-toasts';

const Toasts = (props) => {

  const NOTIFICATIONS_DURATION = 5000;

  useEffect(() => {
    if (Object.keys(props.requestError).length !== 0) {
      const { status, statusText, data, tip } = props.requestError;
      ToastsStore.error(`${status}:${statusText}
      (${data.length < 30 ? data : 'empty description'})
      ${process.env.NODE_ENV === 'development' ? tip : ''}`, NOTIFICATIONS_DURATION);
    }
  });

  return (
    <div>
      <ToastsContainer store={ToastsStore} />
    </div>
  );

}

function mapStateToProps(state) {
  return {
    requestError: state.loadStatus.requestError,
    statuses: _.omit(state.loadStatus, 'requestError')
  }
}

export default connect(mapStateToProps)(Toasts);