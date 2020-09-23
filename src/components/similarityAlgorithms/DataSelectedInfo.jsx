import { Box, Grid, Typography } from "@material-ui/core";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext } from "react";

export const DataSelectedInfo = () => {
  const { selectedData } = useContext(AuthContext);
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className="selected_data_container"
    >
      <Grid item>
        <Box className="selected_data_box left">
          <Typography align="center" component="p" variant="subtitle1">
            Noticia
          </Typography>
          <Typography align="center" component="p" variant="subtitle2">
            {selectedData.report.title}
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Box className="selected_data_box right">
          <Typography align="center" component="p" variant="subtitle1">
            Tweets
          </Typography>
          <Typography align="center" component="p" variant="subtitle2">
            {selectedData.topic.title}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
