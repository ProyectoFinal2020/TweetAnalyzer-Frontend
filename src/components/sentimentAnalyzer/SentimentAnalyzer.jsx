import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Slider,
  Typography,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { get } from "utils/api/api";
import { Tweet } from "../shared/tweet/Tweet";
import { getOptions, graphColors, labels } from "./graphAuxStructures";

export const SentimentAnalyzer = () => {
  const [polarity, setPolarity] = React.useState([-1, 1]);
  const [graphInfo, setGraphInfo] = useState(undefined);
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
              options={getOptions(selectedData.topic.title)}
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
