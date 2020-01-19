import React from 'react';

export default ({ input, label, type, style, meta: { error, touched } }) => {

  function renderError() {
    if (touched && error) {
      return <div className="alert alert-danger" role="alert">{error}</div>
    } else {
      return;
    }
  }

  return (
    <div className="form-group">
      <label>{label}</label>
      <input className="form-control" style={style} {...input} type={type} autoComplete="off" />
      {renderError()}
    </div>
  );
};