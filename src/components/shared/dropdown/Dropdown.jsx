import { InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";

export const Dropdown = ({
  value,
  noneValue = false,
  onChange,
  label,
  disabled = false,
  multiple = false,
  renderValue,
  menuItems,
  style,
  ...props
}) => {
  return (
    <>
      {label ? <InputLabel id="select">{label}</InputLabel> : null}
      <Select
        labelId={label ? "select" : null}
        value={value}
        onChange={onChange}
        label={label}
        disabled={disabled}
        multiple={multiple}
        renderValue={renderValue}
        onOpen={() => (document.documentElement.style.overflowY = "hidden")}
        onClose={() => (document.documentElement.style.overflowY = "auto")}
        style={style}
        MenuProps={{
          /* hace que el dropdown no haga saltitos al seleccionar */
          getContentAnchorEl: null,
        }}
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
