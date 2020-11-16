import { Box, Chip } from "@material-ui/core";
import React from "react";
import "./FilterFields.scss";

export const FilterFields = ({ values, className, ...props }) => {
  return (
    <Box className={className ? className : "filter-field-box"}>
      {values.map((value, index) => (
        <Chip label={value} variant="outlined" key={index} />
      ))}
    </Box>
  );
};
