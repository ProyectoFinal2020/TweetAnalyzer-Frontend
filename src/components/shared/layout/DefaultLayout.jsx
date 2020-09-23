import { Box, Grid, Hidden } from "@material-ui/core";
import { Sidebar } from "components/shared/sidebar/Sidebar.jsx";
import React from "react";

export const DefaultLayout = (props) => {
  return (
    <>
      <Hidden smDown>
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          justify="flex-start"
          className="body_margin"
        >
          <Grid item xs={3} className="sidebar">
            <Sidebar />
          </Grid>
          <Grid item xs={9} className="sidebar_content">
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} lg={11} xl={10}>
                {props.children}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Box className="body_margin">{props.children}</Box>
      </Hidden>
    </>
  );
};
