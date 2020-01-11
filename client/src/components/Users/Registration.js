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
      <div className="d-flex justify-content-between">
        <Link to="/" className="btn btn-danger w-50">Cancel</Link>
        <button type="submit" className="btn btn-success w-50">Create account</button>
      </div>
    );
  }

  return (
    <div>
      <div className="container text-center">
        <div className="row d-flex justify-content-center">
          <div className="col col col-md-6 col-lg-4 col-xl-4">
            <Form
              title='Create new account'
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