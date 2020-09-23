import React from "react";
import { Box } from "@material-ui/core";

// https://codepen.io/mikeambrosi/pen/JdEMVX
export const LoadingIcon = () => {
  return (
    <Box className="loading_container">
      <div className="loading">
        <div className="loading_animation"></div>
      </div>
    </Box>
  );
};
