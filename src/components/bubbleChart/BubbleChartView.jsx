import React, { useEffect, useState } from "react";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import { get } from "utils/api/api";

export const BubbleChartView = () => {
  const [wordsCount, setWordsCount] = useState(undefined);

  const bubbleClick = (label) => {
    console.log("Custom bubble click func");
  };
  const legendClick = (label) => {
    console.log("Customer legend click func");
  };
  useEffect(() => {
    get("/bubbleChart?topicTitle=Coronavirus").then((response) => {
      let aux = [];
      for (var word in response.data) {
        // To-Do: Agregar algo para que el usuario pueda elegir
        if (response.data[word] > 0) {
          aux.push({ label: word, value: response.data[word] });
        }
      }
      setWordsCount(aux);
    });
  }, []);

  return (
    <>
      {wordsCount ? (
        <BubbleChart
          graph={{
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
          }}
          width={1000}
          height={800}
          padding={0} // optional value, number that set the padding between bubbles
          showLegend={true} // optional value, pass false to disable the legend.
          legendPercentage={20} // number that represent the % of with that legend going to use.
          legendFont={{
            family: "Arial",
            size: 12,
            color: "#000",
            weight: "bold",
          }}
          valueFont={{
            family: "Arial",
            size: 12,
            color: "#fff",
            weight: "bold",
          }}
          labelFont={{
            family: "Arial",
            size: 16,
            color: "#fff",
            weight: "bold",
          }}
          //Custom bubble/legend click functions such as searching using the label, redirecting to other page
          bubbleClickFunc={bubbleClick}
          legendClickFun={legendClick}
          data={wordsCount}
        />
      ) : null}
    </>
  );
};
