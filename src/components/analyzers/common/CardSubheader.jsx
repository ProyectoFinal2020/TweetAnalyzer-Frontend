import { IconButton, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import "./CardSubheader.scss";

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
          {label.actionButton ? (
            <Tooltip title={label.actionButton.tooltip}>
              <IconButton
                onClick={label.actionButton.onClick}
                size="small"
                className="xs-icon-btn"
                disableRipple
              >
                {label.actionButton.icon}
              </IconButton>
            </Tooltip>
          ) : null}
        </span>
      ))}
    </div>
  );
};
