// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";
import { TextValidator } from "react-material-ui-form-validator";

export default function CustomTextValidator(props) {
  const {
    label,
    id,
    name,
    value,
    error,
    success,
    fullWidth,
    validators,
    errorMessages,
    InputProps,
  } = props;

  return (
    <TextValidator
      label={label}
      id={id}
      fullWidth={fullWidth}
      onChange={props.onChange}
      name={name}
      value={value}
      classes={{
        input: props.className,
        root: error
          ? "underline underlineError"
          : success
          ? "underline underlineSuccess"
          : "underline",
      }}
      validators={validators}
      errorMessages={errorMessages}
      InputProps={InputProps}
    />
  );
}

CustomTextValidator.propTypes = {
  label: PropTypes.node,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  fullWidth: PropTypes.bool,
  validators: PropTypes.array,
  errorMessages: PropTypes.array,
  InputProps: PropTypes.object,
};
