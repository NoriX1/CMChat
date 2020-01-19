import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionTypes from 'actions/types';
import Form from 'components/Form/Form';
import fields from 'components/Form/formFields';
import './style.scss'


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
        <div className="row d-flex justify-content-center">
          <div className="col-12">
            <h5>This is a simple chat working on React.js</h5>
            <h6>To use this chat you should sign up or sign in</h6>
          </div>
          <div className="col col-md-6 col-lg-4 col-xl-3">
            <Form
              title='Sign In'
              fields={fields.signin}
              onSubmit={handleSignInSubmit}
              renderButtons={renderSignInButtons}
            />
            <div>Or</div>
            <a className="btn btn-primary mb-2" href={`${process.env.REACT_APP_BACKEND_URI}/auth/google`}>Sign in with Google</a>
            <div>Haven't got account? <Link to="/register">Create New</Link></div>
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
