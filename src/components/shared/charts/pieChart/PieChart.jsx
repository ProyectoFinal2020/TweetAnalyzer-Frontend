import React from "react";
import { PieChart as PieChartReact } from "react-minimal-pie-chart";

export const PieChart = ({ data, fontSize, setHovered, height, ...props }) => {
  return (
    <div style={{ height: height }}>
      <PieChartReact
        center={[50, 50]}
        viewBoxSize={[100, 100]}
        data={data}
        animation
        animationDuration={500}
        animationEasing="ease-out"
        paddingAngle={0}
        startAngle={0}
        label={({ dataEntry }) =>
          dataEntry.title !== "none"
            ? `${Math.round(dataEntry.percentage)} %`
            : ""
        }
        labelStyle={{
          fontSize: fontSize,
          fill: "white",
          fontFamily: "Roboto",
          fontWeight: 500,
        }}
        labelPosition={75}
        onMouseOver={(_, index) => {
          setHovered(index);
        }}
        onMouseOut={() => {
          setHovered(undefined);
        }}
      />
    </div>
  );
};
