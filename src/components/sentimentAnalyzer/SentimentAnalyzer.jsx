import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Slider,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { get } from "utils/api/api";
import { Tweet } from "../shared/tweet/Tweet";
import InfoIcon from "@material-ui/icons/Info";

export const SentimentAnalyzer = () => {
  const [polarity, setPolarity] = React.useState([-1, 1]);
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

  const handleSubmit = () => {
    console.log(this.polarity[0]);
    console.log(this.polarity[1]);
    get("/sentimentAnalyzer?topicTitle=Coronavirus").then((response) => {
      setTweets(response.data);
    });
  };

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
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="h1" align="center">
            Análisis de sentimientos
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {tweets ? (
            <ResizableBox>
              <Chart data={tweets} series={series} axes={axes} tooltip />
            </ResizableBox>
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
