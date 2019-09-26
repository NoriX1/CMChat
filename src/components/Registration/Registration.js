import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionTypes from 'actions/types';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';


const Registration = (props) => {

    function handleSignUpSubmit(formValues) {
        return new Promise((resolve, reject) => {
            props.dispatch({ type: actionTypes.SIGN_UP_REQUEST, payload: { formValues, resolve, reject } });
        });
    }

    function renderSignUpButtons() {
        return (
            <div>
                <Link to="/" className="btn btn-danger">Cancel</Link>
                <button type="submit" className="btn btn-success">Create account</button>
            </div>
        );
    }

    return (
        <div>
            <div className="container text-center">
                <h3>Creating a new account</h3>
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <Form
                            fields={fields.signup}
                            onSubmit={handleSignUpSubmit}
                            renderButtons={renderSignUpButtons}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default connect()(Registration);