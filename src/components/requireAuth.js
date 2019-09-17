import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ToastsStore } from 'react-toasts';

export default (ChildComponent) => {
    const ComposedComponent = (props) => {

        useEffect(() => {
            shouldNavigateAway();
        });


        function shouldNavigateAway() {
            if (!props.auth) {
                ToastsStore.warning('You should be signed in to watch this page!', 5000);
                props.history.push('/');
            }
        }

        return <ChildComponent {...props} />;
    }

    function mapStateToProps(state) {
        return { auth: state.auth.authenticated };
    }

    return connect(mapStateToProps)(ComposedComponent);
};
