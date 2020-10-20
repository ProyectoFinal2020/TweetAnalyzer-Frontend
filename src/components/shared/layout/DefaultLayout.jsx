import { Grid, Hidden } from "@material-ui/core";
import { Sidebar } from "components/shared/sidebar/Sidebar.jsx";
import React from "react";

export const DefaultLayout = (props) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="flex-start"
      justify="flex-start"
      className="body_margin"
    >
      <Hidden smDown>
        <Grid item xs={3} className="sidebar">
          <Sidebar />
        </Grid>
      </Hidden>
      <Grid item xs={12} md={9} className="sidebar_content">
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} lg={11} xl={10}>
            {props.children}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
