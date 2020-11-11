import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
} from "@material-ui/core";
import avatarImage from "assets/custom/img/tweetLogo.svg";
import React from "react";
import { PieChartView } from "./EmotionChart";
import "./Tweet.scss";

export const Tweet = ({ tweet, emotions, showPolarity, ...props }) => {
  const getDateAndTime = (tweet) => {
    const date = new Date(tweet.date);
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " • " +
      date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  };

  return (
    <Card variant="outlined" className="tweet_card">
      <CardHeader
        avatar={
          <Avatar
            aria-label={tweet.username}
            src={tweet.img_url ?? avatarImage}
          />
        }
        title={
          <a href={tweet.permalink} target="_blank" rel="noopener noreferrer">
            {"@" + tweet.username}
          </a>
        }
        subheader={getDateAndTime(tweet)}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" component="p">
              {tweet.text}
            </Typography>
          </Grid>
          {showPolarity ? (
            <Grid item xs={12}>
              <Box mt={2} />
              <Chip
                className="subjectivity"
                label={"Subjetividad: " + tweet.subjectivity.toFixed(2)}
              />
              <Chip
                className="polarity"
                label={"Polaridad: " + tweet.polarity.toFixed(2)}
              />
            </Grid>
          ) : null}
          {emotions ? (
            <Grid item xs={12}>
              <PieChartView emotion={emotions} />
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </Card>
  );
};
