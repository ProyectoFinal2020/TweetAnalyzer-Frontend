import { Button, Grid, Typography, Box } from "@material-ui/core";
import errorIcon from "assets/custom/img/ErrorContent.svg";
import React from "react";

export const NoContentComponent = (title, subtitle, iconId, elements) => {
  return (
    <Box className="no_content">
      <Grid container direction="row" justify="center" alignItems="center">
        <svg>
          <use href={errorIcon + iconId} className="no_content_use"></use>
        </svg>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography
            component="p"
            variant="h6"
            color="textPrimary"
            align="center"
          >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography
            component="p"
            variant="subtitle2"
            color="textPrimary"
            align="center"
          >
            {subtitle}
          </Typography>
        </Grid>
        {elements && elements.length > 0 ? (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className="buttons_container"
          >
            {elements.map((element, index) => (
              <Grid item xs="auto" key={index}>
                <Button className="success" onClick={element.handleClick}>
                  {element.buttonText}
                </Button>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
};
