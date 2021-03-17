import { FormControl, Slider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import "./FilterByThresholdDialog.scss";

const FilterByThresholdDialog = ({
  open,
  setOpen,
  minPolarity,
  maxPolarity,
  STEP_SIZE,
  handleSubmit,
  ...props
}) => {
  const [polarity, setPolarity] = React.useState([minPolarity, maxPolarity]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
    handleSubmit(polarity);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      classes={{ paper: "filter-threshold-dialog" }}
    >
      <DialogTitle id="form-dialog-title">Rango a evaluar</DialogTitle>
      <form>
        <DialogContent>
          <DialogContentText>
            Ingrese el rango de polaridades que quiere obtener.
          </DialogContentText>
          <FormControl fullWidth>
            <Slider
              className="polarity-slider"
              value={polarity}
              min={-1}
              step={STEP_SIZE}
              max={1}
              onChange={(event, value) => setPolarity(value)}
              valueLabelDisplay="on"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Filtrar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FilterByThresholdDialog;
