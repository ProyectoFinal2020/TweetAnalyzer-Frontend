import FormControl from "@material-ui/core/FormControl";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";
import { TextValidator } from "react-material-ui-form-validator";

export default function CustomTextValidator(props) {
  const {
    formControlProps,
    label,
    id,
    name,
    value,
    inputProps,
    error,
    success,
    validators,
    errorMessages,
    InputProps,
  } = props;

  return (
    <FormControl
      {...formControlProps}
      className={
        formControlProps
          ? "formControl " + formControlProps.className
          : "formControl"
      }
    >
      <TextValidator
        label={label}
        id={id}
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
        {...inputProps}
      />
    </FormControl>
  );
}

CustomTextValidator.propTypes = {
  label: PropTypes.node,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  InputProps: PropTypes.object,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  validators: PropTypes.array,
  errorMessages: PropTypes.array,
};
