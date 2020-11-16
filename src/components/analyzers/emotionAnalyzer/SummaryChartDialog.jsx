import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import { get } from "utils/api/api";
import { EmotionChart } from "components/shared/tweet/EmotionChart";
import { getEmotions } from "./getTweetAndEmotions";

export const SummaryChartDialog = ({ open, setOpen, savedData, ...props }) => {
  const [topicEmotions, setTopicEmotions] = useState(undefined);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (savedData) {
      get(
        "/emotionAnalyzer/topic?topicTitle=" +
          savedData.topicTitle +
          "&reportId=" +
          savedData.reportId +
          "&algorithm=" +
          savedData.algorithm +
          "&threshold=" +
          savedData.threshold
      ).then((response) => {
        setTopicEmotions(getEmotions(response.data));
      });
    }
  }, [savedData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Resumen</DialogTitle>
      <DialogContent>
        <DialogContentText classes={{ root: "summary-chart-dialog-text" }}>
          Ingrese la cantidad máxima de palabras que se pueden ubicar en el
          diagrama y la cantidad mínima de apariciones que puede tener una
          palabra.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {topicEmotions ? <EmotionChart emotion={topicEmotions} /> : null}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions classes={{ root: "summary-chart-dialog-actions" }}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
