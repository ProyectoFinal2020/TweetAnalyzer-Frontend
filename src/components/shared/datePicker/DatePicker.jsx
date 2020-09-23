import DateFnsUtils from "@date-io/date-fns";
import { Typography } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React from "react";
import { ValidatorComponent } from "react-material-ui-form-validator";

export class DatePicker extends ValidatorComponent {
  render() {
    const props = this.props;

    return (
      <>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className="date_picker"
            margin="normal"
            format="dd/MM/yyyy"
            label={props.label}
            value={props.value}
            minDate={props.minDate}
            maxDate={props.maxDate}
            onChange={props.handleChange}
            id={props.label}
            variant="inline"
          />
        </MuiPickersUtilsProvider>
        {this.errorText()}
      </>
    );
  }
  errorText() {
    const { isValid } = this.state;

    if (!document.getElementById(this.props.label)) {
      return null;
    } else {
      if (isValid) {
        document
          .getElementById(this.props.label)
          .parentElement.parentElement.setAttribute("aria-invalid", "false");
        return null;
      } else {
        document
          .getElementById(this.props.label)
          .parentElement.parentElement.setAttribute("aria-invalid", "true");
      }
    }

    return (
      <Typography color="error" variant="caption">
        {this.getErrorMessage()}
      </Typography>
    );
  }
}
