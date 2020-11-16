import { Box, Typography } from "@material-ui/core";
import React from "react";
import "./EmptyMessageResult.scss";

export const EmptyMessageResult = ({ title, subtitle, style, ...rest }) => {
  return (
    <Box className="empty-message-result" style={style}>
      {title ? (
        <Typography component="p" variant="subtitle2" color="textPrimary">
          {title}
        </Typography>
      ) : null}
      {subtitle ? (
        <Typography component="p" variant="subtitle1" color="textPrimary">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
};
