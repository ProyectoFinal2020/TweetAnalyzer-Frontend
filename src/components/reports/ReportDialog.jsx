import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useRef, useState } from "react";
import { Typography, Chip, Grid } from "@material-ui/core";
import { languagesDictionary } from "../../utils/dictionaries/language";

export const ReportDialog = ({ report, onClose, ...props }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Grid container>
            <Grid item xs={12}>
              <Chip
                color="default"
                variant="outlined"
                label={
                  <Typography
                    variant="caption"
                    component="span"
                    color="textSecondary"
                  >
                    {languagesDictionary[report.language]}
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" align="center" variant="h4">
                {report.title}
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            className="modal_text"
            align="justify"
          >
            {report.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
