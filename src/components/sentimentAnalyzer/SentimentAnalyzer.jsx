import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { get } from "utils/api/api";

export const SentimentAnalyzer = () => {
  const [tweets, setTweets] = useState(undefined);

  useEffect(() => {
    get("/sentimentAnalyzer?topicTitle=Coronavirus").then((response) => {
      setTweets(response.data);
    });
  }, []);

  return (
    <>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        className="emotion_analyzer"
      >
        <Grid item xs={12}>
          <Typography component="h1" variant="h1" align="center">
            Análisis de sentimientos
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
