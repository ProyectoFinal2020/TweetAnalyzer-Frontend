import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Slider,
  Typography,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import config from "assets/custom/scss/config.scss";
import { AuthContext } from "contexts/AuthContext";
import { default as React, useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { get } from "utils/api/api";
import { Tweet } from "../shared/tweet/Tweet";

export const SentimentAnalyzer = () => {
  const [polarity, setPolarity] = React.useState([-1, 1]);
  const [graphInfo, setGraphInfo] = useState(undefined);
  const [tweets, setTweets] = useState(undefined);
  const { selectedData } = useContext(AuthContext);

  useEffect(() => {
    get("/sentimentAnalyzer?topicTitle=" + selectedData.topic.title).then(
      (response) => {
        setTweets(response.data);
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

        setGraphInfo(data);
      }
    );
  }, [selectedData.topic.title]);

  const handleSubmit = () => {
    console.log(this.polarity[0]);
    console.log(this.polarity[1]);
    get("/sentimentAnalyzer?topicTitle=Coronavirus").then((response) => {
      setGraphInfo(response.data);
    });
  };

  return (
    <>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="h1" align="center">
            Análisis de sentimientos
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {graphInfo ? (
            <Bar
              data={graphInfo}
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
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Grid item xs={5}>
                <FormControl fullWidth={true}>
                  <InputLabel shrink id="polarity-slider">
                    Rango de polaridad <InfoIcon />
                  </InputLabel>
                  <Slider
                    className="polarity-slider"
                    value={polarity}
                    min={-1}
                    step={0.25}
                    max={1}
                    onChange={(event, value) => setPolarity(value)}
                    valueLabelDisplay="auto"
                    aria-labelledby="polarity-slider"
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid container spacing={2} alignItems="stretch">
          {tweets && tweets.length > 0
            ? tweets.map((tweet) => (
                <Grid item xs={12} sm={6} md={4} xl={3} key={tweet.id}>
                  <Tweet tweet={tweet} showPolarity={true} />
                </Grid>
              ))
            : null}
        </Grid>
      </Grid>
    </>
  );
};
