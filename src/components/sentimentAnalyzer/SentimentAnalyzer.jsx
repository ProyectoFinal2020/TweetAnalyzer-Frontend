import React, { useEffect, useState } from "react";
import { Chart } from "react-charts";
import ResizableBox from "./ResizableBox";
import "./styles.css";
import { get } from "utils/api/api";

export const SentimentAnalyzer = () => {
  const [tweets, setTweets] = useState(undefined);

  useEffect(() => {
    get("/sentimentAnalyzer?topicTitle=Coronavirus").then((response) => {
      let aux = [0, 0, 0, 0, 0, 0, 0, 0];
      let i = 0;
      let j = 0;
      let max = 1;
      let min = 0.75;
      while (i < response.data.length) {
        let polarity = response.data[i].polarity;
        if (polarity <= max && polarity >= min) {
          aux[j] = aux[j] + 1;
          i++;
        } else {
          j++;
          min -= 0.25;
          max -= 0.25;
        }
      }
      const algo = [
        {
          label: "-1 a -0.75",
          data: [
            {
              primary: "Polaridad",
              radius: undefined,
              secondary: aux[7],
            },
          ],
        },
        {
          label: "-0.75 a -0.50",
          data: [
            {
              primary: "Polaridad",
              radius: undefined,
              secondary: aux[6],
            },
          ],
        },
        {
          label: "-0.5 a -0.25",
          data: [
            {
              primary: "Polaridad",
              radius: undefined,
              secondary: aux[5],
            },
          ],
        },
        {
          label: "-0.25 a 0",
          data: [
            {
              primary: "Polaridad",
              radius: undefined,
              secondary: aux[4],
            },
          ],
        },
        {
          label: "0 a 0.25",
          data: [
            {
              primary: "Polaridad",
              radius: undefined,
              secondary: aux[3],
            },
          ],
        },
        {
          label: "0.25 a 0.50",
          data: [
            {
              primary: "Polaridad",
              radius: undefined,
              secondary: aux[2],
            },
          ],
        },
        {
          label: "0.50 a 0.75",
          data: [
            {
              primary: "Polaridad",
              radius: undefined,
              secondary: aux[1],
            },
          ],
        },
        {
          label: "0.75 a 1",
          data: [
            {
              primary: "Polaridad",
              radius: undefined,
              secondary: aux[0],
            },
          ],
        },
      ];
      setTweets(algo);
    });
  }, []);

  const series = React.useMemo(
    () => ({
      type: "bar",
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "ordinal", position: "bottom" },
      { position: "left", type: "linear", stacked: false },
    ],
    []
  );

  return (
    <>
      {tweets ? (
        <ResizableBox>
          <Chart data={tweets} series={series} axes={axes} tooltip />
        </ResizableBox>
      ) : null}
    </>
  );
};
