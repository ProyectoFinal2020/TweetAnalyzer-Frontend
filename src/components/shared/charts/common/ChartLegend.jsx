import React from "react";

export const ChartLegend = ({
  label,
  color,
  width = 20,
  height = 15,
  ...props
}) => {
  return (
    <p>
      <svg width="22" height="15">
        <rect rx="5" ry="5" width="20" height="15" style={{ fill: color }} />
      </svg>
      <span>{label}</span>
    </p>
  );
};
