import { Grid } from "@material-ui/core";
import React from "react";

export const DefaultLayout = (props) => {
  return (
    <Grid container direction="row" justify="center" className="body_margin">
      <Grid item xs={12} md={9} xl={7}>
        {props.children}
      </Grid>
    </Grid>
  );
};
