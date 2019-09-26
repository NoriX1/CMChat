import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionTypes from 'actions/types';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';


const Landing = (props) => {

    useEffect(() => {
        if (props.auth) {
            props.history.push('rooms');
        }
    });

    function handleSignInSubmit(formValues) {
        return new Promise((resolve, reject) => {
            props.dispatch({ type: actionTypes.SIGN_IN_REQUEST, payload: { formValues, resolve, reject } });
        });
    }

    function renderSignInButtons() {
        return (
            <div>
                <button type="submit" className="btn btn-success">Sign In</button>
            </div>
        );
    }

    return (
        <div className="landing">
            <div className="container text-center">
                <h3>To use this chat you should sign in</h3>
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <Form
                            fields={fields.signin}
                            onSubmit={handleSignInSubmit}
                            renderButtons={renderSignInButtons}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div>Haven't got account? <Link to="/register">Create New</Link></div>
                        <div>Or you can</div>
                        <a className="btn btn-primary" href={`${process.env.REACT_APP_BACKEND_URI}/auth/google`}>Sign in with Google</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { auth: state.auth.authenticated };
}

export default connect(mapStateToProps)(Landing);
