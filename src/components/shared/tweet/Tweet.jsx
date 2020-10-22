import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tooltip,
  Typography,
} from "@material-ui/core";
import avatarImage from "assets/custom/img/tweetLogo.svg";
import React from "react";
import { PieChartView } from "./EmotionChart";

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
              <Tooltip title="Polaridad">
                <Avatar className="tweet_polarity">
                  <Typography variant="subtitle1">
                    {tweet.polarity.toFixed(2)}
                  </Typography>
                </Avatar>
              </Tooltip>
            </Grid>
          ) : null}
          {emotions ? (
            <Grid item xs={12}>
              <PieChartView className="pie_chart" emotion={emotions} />
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </Card>
  );
};
