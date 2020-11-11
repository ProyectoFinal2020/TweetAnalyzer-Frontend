import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import "./HashtagCloudDialog.scss";

export const HashtagCloudDialog = ({
  open,
  setOpen,
  maxAmountWords,
  minimumFrequency,
  save,
  ...props
}) => {
  const [maxWords, setMaxWords] = useState(maxAmountWords);
  const [minFrequency, setMinFrequency] = useState(minimumFrequency);

  const handleClose = () => {
    setOpen(false);
    setMaxWords(maxAmountWords);
    setMinFrequency(minimumFrequency);
  };

  const handleSave = () => {
    save(maxWords, minFrequency);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Nube de hashtags</DialogTitle>
      <DialogContent>
        <DialogContentText classes={{ root: "hashtag-cloud-dialog-text" }}>
          Ingrese la cantidad máxima de palabras que se pueden ubicar en el
          diagrama y la cantidad mínima de apariciones que puede tener una
          palabra.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cantidad"
              value={maxWords}
              onChange={(e) => setMaxWords(e.target.value)}
              type="number"
              helperText="Cantidad máxima de palabras"
              variant="outlined"
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Frecuencia"
              value={minFrequency}
              onChange={(e) => setMinFrequency(e.target.value)}
              type="number"
              helperText="Frecuencia mínima"
              variant="outlined"
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions classes={{ root: "hashtag-cloud-dialog-actions" }}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Filtrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
