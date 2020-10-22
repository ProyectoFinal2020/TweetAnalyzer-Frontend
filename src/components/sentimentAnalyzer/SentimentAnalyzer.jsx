import React, { useContext, useEffect, useState } from "react";
import { get } from "utils/api/api";
import { Bar } from "react-chartjs-2";
import config from "assets/custom/scss/config.scss";
import { AuthContext } from "contexts/AuthContext";

export const SentimentAnalyzer = () => {
  const [tweets, setTweets] = useState(undefined);
  const { selectedData } = useContext(AuthContext);

  useEffect(() => {
    get("/sentimentAnalyzer?topicTitle=" + selectedData.topic.title).then(
      (response) => {
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

        const data = {
          labels: [
            "-1 a -0.75",
            "-0.75 a -0.50",
            "-0.5 a -0.25",
            "-0.25 a 0",
            "0 a 0.25",
            "0.25 a 0.50",
            "0.50 a 0.75",
            "0.75 a 1",
          ],
          datasets: [
            {
              label: selectedData.topic.title,
              backgroundColor: [
                config["graphBlue"],
                config["graphOrange"],
                config["graphRed"],
                config["graphTeal"],
                config["graphYellow"],
                config["graphGreen"],
                config["graphPurple"],
                config["graphPink"],
              ],
              borderColor: [
                config["graphBlue"],
                config["graphOrange"],
                config["graphRed"],
                config["graphTeal"],
                config["graphYellow"],
                config["graphGreen"],
                config["graphPurple"],
                config["graphPink"],
              ],
              borderWidth: 1,
              data: aux,
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
          options={{
            title: {
              text: selectedData.topic.title,
              display: true,
              fontSize: 22,
            },
            scales: {
              xAxes: [
                {
                  scaleLabel: {
                    labelString: "Polaridad",
                    display: true,
                    fontSize: 18,
                  },
                  gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                  },
                },
              ],
              yAxes: [
                {
                  scaleLabel: {
                    labelString: "Cantidad de tweets",
                    display: true,
                    fontSize: 18,
                  },
                },
              ],
            },
          }}
        />
      ) : null}
    </>
  );
};
