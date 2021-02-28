import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { get } from "../../../utils/api/api";
import "./SpaceInfoDialog.scss";

export const SpaceInfoDialog = ({ open, setOpen, ...props }) => {
  const [spaceInfo, setSpaceInfo] = useState(undefined);

  useEffect(() => {
    get("/user/info").then((response) => {
      setSpaceInfo(response.data);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const infoBox = (title, value) => {
    return (
      <Grid item xs={4} className="info-box-paper">
        {value ? (
          <Typography
            component="p"
            variant="h6"
            className="w-100 justify-center info-box-label"
            align="center"
          >
            {value}
          </Typography>
        ) : (
          <Skeleton height={38} />
        )}
        <Typography
          component="p"
          variant="subtitle2"
          className="w-100 justify-center info-box-label"
          align="center"
        >
          {title}
        </Typography>
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">Espacio de almacenamiento</DialogTitle>
      <DialogContent style={{ paddingRight: 10, paddingLeft: 10 }}>
        <Grid container alignItems="stretch" justify="center">
          {infoBox("Disponible", spaceInfo?.availableSpace)}
          {infoBox("Usado", spaceInfo?.spaceUsed)}
          {infoBox("Total", spaceInfo?.availableSpace + spaceInfo?.spaceUsed)}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
