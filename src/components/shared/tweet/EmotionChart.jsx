import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { emotionsDictionary } from "../../analyzers/emotionAnalyzer/emotionsDictionary.js";
import { Grid } from "@material-ui/core";
import "./EmotionChart.scss";

export const PieChartView = (props) => {
  const [hovered, setHovered] = useState(undefined);
  const [data, setData] = useState(undefined);
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
    <Grid container justify="center" alignItems="flex-end">
      <Grid item xs={12}>
        <Grid
          container
          justify="flex-end"
          alignItems="flex-end"
          className="color_description_container"
        >
          {chartColors.map((value) => (
            <Grid
              item
              xs="auto"
              className="color_description_item"
              key={value.emotion}
            >
              <p>
                <svg width="22" height="15">
                  <rect
                    rx="5"
                    ry="5"
                    width="20"
                    height="15"
                    style={{ fill: value.color }}
                  />
                </svg>
                <span>{value.title}</span>
              </p>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs="auto" className="chart_container">
        <PieChart
          className="pie_chart"
          data={data}
          animate
          radius={30}
          label={({ dataEntry }) =>
            dataEntry.title !== "none"
              ? `${Math.round(dataEntry.percentage)} %`
              : ""
          }
          labelStyle={{
            fontSize: 4,
            fill: "white",
            fontFamily: "Roboto",
            fontWeight: 600,
          }}
          labelPosition={72}
          onMouseOver={(_, index) => {
            setHovered(index);
          }}
          onMouseOut={() => {
            setHovered(undefined);
          }}
        />
      </Grid>
    </Grid>
  );
};
