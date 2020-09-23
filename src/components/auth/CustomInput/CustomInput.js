import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";
import { Typography } from "@material-ui/core";

export default function CustomInput(props) {
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    errorMessage,
    success,
  } = props;

  return (
    <FormControl
      {...formControlProps}
      className={
        formControlProps && formControlProps.className
          ? "formControl " + formControlProps.className
          : "formControl"
      }
      aria-invalid={errorMessage ? true : false}
    >
      {labelText !== undefined ? (
        <InputLabel
          className={success ? "labelRoot underlineSuccess" : "labelRoot"}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
      <Input
        onChange={props.onChange}
        classes={{
          input: props.className,
          disabled: "disabled",
          underline: success ? "underline underlineSuccess" : "underline",
        }}
        id={id}
        {...inputProps}
      />
      <Typography
        variant="caption"
        component="p"
        color="error"
        className="errorLabel"
      >
        {errorMessage ? errorMessage : null}
      </Typography>
    </FormControl>
  );
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  errorMessage: PropTypes.string,
  success: PropTypes.bool,
};
