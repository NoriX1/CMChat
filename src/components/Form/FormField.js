import React from 'react';

export default ({ input, label, type, meta: { error, touched } }) => {

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
            <input className="form-control" {...input} type={type} autoComplete="off" />
            {renderError()}
        </div>
    );
};