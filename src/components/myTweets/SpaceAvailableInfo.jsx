import React from "react";
import Typography from "@material-ui/core/Typography";
import { Grid, Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

export const SpaceAvailableInfo = ({ spaceInfo, topic, ...rest }) => {
  return spaceInfo ? (
    <Box className="info_box space_available_box">
      <Typography variant="h5" component="p" align="center">
        Espacio de almacenamiento
      </Typography>
      <Grid container className="info_box_container">
        <Grid item xs={12} sm={12} md={12} lg={12} className="all_width">
          <Box className="center_box">
            <Box className="info_box_info_margin">
              <Typography variant="subtitle1" component="p" color="primary">
                Disponible
              </Typography>
              <Typography
                align="center"
                color="primary"
                component="p"
                variant="subtitle2"
                id="available-space"
              >
                {spaceInfo.availableSpace}
              </Typography>
            </Box>
            <Box className="info_box_info_margin">
              <Typography variant="subtitle1" component="p" color="primary">
                Usado
              </Typography>
              <Typography
                align="center"
                color="primary"
                component="p"
                variant="subtitle2"
                id="space-used"
              >
                {spaceInfo.spaceUsed}
              </Typography>
            </Box>
            <Box className="info_box_info_margin">
              <Typography variant="subtitle1" component="p" color="primary">
                Total
              </Typography>
              <Typography
                align="center"
                color="primary"
                component="p"
                variant="subtitle2"
                id="total-space"
              >
                {spaceInfo.availableSpace + spaceInfo.spaceUsed}
              </Typography>
            </Box>
          </Box>
        </Grid>
        {topic.title && topic.spaceUsed ? (
          <Grid item>
            <Typography variant="subtitle1" component="span" color="primary">
              {topic.title}:{" "}
            </Typography>
            <Typography
              align="center"
              color="primary"
              component="span"
              variant="subtitle2"
              id="topic-space-used"
            >
              {topic.spaceUsed}
            </Typography>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  ) : (
    <Box>
      <Skeleton variant="text" height="56px" />
      <Skeleton variant="rect" height="90px" />
    </Box>
  );
};
