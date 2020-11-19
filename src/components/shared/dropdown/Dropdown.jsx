import { InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";

export const Dropdown = ({
  value,
  noneValue,
  onChange,
  label,
  menuItems,
  ...props
}) => {
  return (
    <>
      <InputLabel id="select">{label}</InputLabel>
      <Select
        labelId="select"
        value={value}
        onChange={onChange}
        label={label}
        onOpen={() => (document.documentElement.style.overflowY = "hidden")}
        onClose={() => (document.documentElement.style.overflowY = "auto")}
      >
        {noneValue ? (
          <MenuItem value="">
            <em>Ninguno</em>
          </MenuItem>
        ) : null}
        {menuItems}
      </Select>
    </>
  );
};
