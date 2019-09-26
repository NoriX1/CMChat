import _ from 'lodash';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import FormField from './FormField';

const Form = (props) => {

    function renderFields() {
        return _.map(props.fields, ({ label, name, type }) => {
            return <Field key={name} component={FormField} type={type} label={label} name={name} />
        });
    }

    function renderButtons() {
        if (props.renderButtons) {
            return props.renderButtons();
        }
    }

    return (
        <div className="mt-5">
            <form onSubmit={props.handleSubmit(props.onSubmit)}>
                <h1 className="h3 mb3 font-weight-bold">{props.title}</h1>
                {renderFields()}
                {props.error && <div className="alert alert-danger">{props.error}</div>}
                {renderButtons()}
            </form>
        </div>
    );
}

function validate(values, props) {
    const errors = {};
    _.each(props.fields, ({ name }) => {
        if (name === 'email') {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(values[name])) {
                errors[name] = 'Email is invalid';
            }
        }
        if (!values[name]) {
            errors[name] = `You must provide a ${name}`;
        }
    });
    return errors;
}

export default reduxForm({
    form: 'form',
    validate
})(Form);