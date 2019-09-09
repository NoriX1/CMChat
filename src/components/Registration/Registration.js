import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from 'actions';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';


const Registration = (props) => {

    function handleSignInSubmit(formValues) {
        props.signUp(formValues, () => {
            props.history.push('/');
        });
    }

    function renderSignInButtons() {
        return (
            <div>
                <Link to="/" className="btn btn-danger">Cancel</Link>
                <button type="submit" className="btn btn-success">Create account</button>
            </div>
        );
    }

    function renderError() {
        if (props.authError) {
            return <div className="alert alert-danger">{props.authError}</div>;
        }
    }

    return (
        <div>
            <div className="container text-center">
                <h3>Creating a new account</h3>
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <Form
                            fields={fields.signup}
                            onSubmit={handleSignInSubmit}
                            renderButtons={renderSignInButtons}
                        />
                    </div>
                </div>
                {renderError()}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { authError: state.auth.errorMessage };
}

export default connect(mapStateToProps, actions)(Registration);