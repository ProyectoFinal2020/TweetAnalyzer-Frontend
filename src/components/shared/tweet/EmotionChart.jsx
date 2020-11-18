import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { emotionsDictionary } from "../../analyzers/emotionAnalyzer/emotionsDictionary.js";
import { ChartLegend } from "../charts/common/ChartLegend";
import { PieChart } from "../charts/pieChart/PieChart.jsx";
import "./EmotionChart.scss";

export const EmotionChart = ({
  className,
  fontSize = 6,
  height = 180,
  ...props
}) => {
  const [data, setData] = useState(undefined);
  const [hovered, setHovered] = useState(undefined);
  const [chartColors, setChartColors] = useState([]);

  useEffect(() => {
    let data = props.emotion.map((entry, i) => {
      if (hovered === i) {
        return {
          ...entry,
          color: "grey",
        };
      }
      return entry;
    });
    setData(data);

    let chartColors = data.map((value) => {
      return {
        emotion: value.title,
        title: emotionsDictionary[value.title],
        color: value.color,
      };
    });
    setChartColors(chartColors);
  }, [props.emotion, hovered]);

  return (
    <Grid
      container
      direction="row-reverse"
      justify="center"
      alignItems="flex-start"
      style={{ maxWidth: height * 2, margin: "auto" }}
    >
      <Grid item xs={5}>
        <Grid
          container
          justify="center"
          alignItems="flex-start"
          className={"color_description_container " + className}
        >
          {chartColors.map((value, index) => (
            <Grid item xs={12} className="color_description_item" key={index}>
              <ChartLegend label={value.title} color={value.color} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={7} className="mgn-top-10">
        <PieChart
          data={data}
          fontSize={fontSize}
          setHovered={setHovered}
          height={height}
        />
      </Grid>
    </Grid>
  );
};
