import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

const GoogleAuth = (props) => {

    useEffect(() => {
        if (props.match.params.token) {
            props.signInGoogle(props.match.params.token, () => {
                props.history.push('/rooms');
            });
        }
    });

    return (
        <div></div>
    )
}

export default connect(null, actions)(GoogleAuth);