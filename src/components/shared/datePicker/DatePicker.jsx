import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React from "react";
import { ValidatorComponent } from "react-material-ui-form-validator";
import "./DatePicker.scss";

export class DatePicker extends ValidatorComponent {
  renderValidatorComponent() {
    const props = this.props;
    const { isValid } = this.state;

    return (
      <>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className="date_picker"
            format="dd/MM/yyyy"
            fullWidth={true}
            label={props.label}
            value={props.value}
            minDate={props.minDate}
            maxDate={props.maxDate}
            onChange={props.handleChange}
            id={props.label}
            variant="inline"
            error={!isValid || !props.isValid}
            helperText={
              (!isValid && this.getErrorMessage()) || props.helperText
            }
            onKeyDown={(e) => e.preventDefault()}
          />
        </MuiPickersUtilsProvider>
      </>
    );
  }
}
