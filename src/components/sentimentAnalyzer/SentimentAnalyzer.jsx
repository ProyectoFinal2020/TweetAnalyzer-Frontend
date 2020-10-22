import React, { useContext, useEffect, useState } from "react";
import { get } from "utils/api/api";
import { Bar } from "react-chartjs-2";
import { AuthContext } from "contexts/AuthContext";
import { getOptions, graphColors, labels } from "./graphAuxStructures";

export const SentimentAnalyzer = () => {
  const [tweets, setTweets] = useState(undefined);
  const { selectedData } = useContext(AuthContext);

  useEffect(() => {
    get("/sentimentAnalyzer/graph?topicTitle=" + selectedData.topic.title).then(
      (response) => {
        const data = {
          labels: labels,
          datasets: [
            {
              label: selectedData.topic.title,
              backgroundColor: graphColors,
              borderColor: graphColors,
              borderWidth: 1,
              data: response.data,
            },
          ],
        };

        setTweets(data);
      }
    );
  }, [selectedData.topic.title]);

  return (
    <>
      {tweets ? (
        <Bar
          data={tweets}
          legend={{ display: false }}
          options={getOptions(selectedData.topic.title)}
        />
      ) : null}
    </>
  );
};
