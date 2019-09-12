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
        <div>
            <form onSubmit={props.handleSubmit(props.onSubmit)}>
                {renderFields()}
                {renderButtons()}
            </form>
        </div>
    );
}

function validate(values) {
    
}

export default reduxForm({
    form: 'form',
    validate
})(Form);