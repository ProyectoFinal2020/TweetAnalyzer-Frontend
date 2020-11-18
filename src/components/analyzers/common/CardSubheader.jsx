import { Typography } from "@material-ui/core";
import React from "react";

export const CardSubheader = ({ labels, ...props }) => {
  return (
    <div>
      {labels.map((label, index) => (
        <span key={index}>
          <Typography variant="subtitle2" component="span">
            {label.title + ": "}
          </Typography>
          <Typography variant="subtitle1" component="span">
            {label.value + ". "}
          </Typography>
        </span>
      ))}
    </div>
  );
};
