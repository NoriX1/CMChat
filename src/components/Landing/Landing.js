import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from 'actions';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';


const Landing = (props) => {

    useEffect(() => {
        if (props.auth) {
            props.history.push('rooms');
        }
    });

    function handleSignInSubmit(formValues) {
        props.signIn(formValues, () => {
            props.history.push('/rooms');
        });

    }

    function renderSignInButtons() {
        return (
            <div>
                <button type="submit" className="btn btn-success">Sign In</button>
            </div>
        );
    }

    function renderError() {
        if (props.authError) {
            return <div className="alert alert-danger">{props.authError}</div>;
        }
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
                        {renderError()}
                        <div>Haven't got account? <Link to="/register">Create New</Link></div>
                        <div>Or you can</div>
                        <a className="btn btn-primary" href="http://localhost:3090/auth/google">Sign in with Google</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { authError: state.auth.errorMessage, auth: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(Landing);
