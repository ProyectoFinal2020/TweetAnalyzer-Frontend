import { Grid } from "@material-ui/core";
import { Tweet } from "../shared/tweet/Tweet";
import React from "react";
import { SimilarityAlgorithmsKeys } from "./SimilarityAlgorithmsNames";

export const TweetsWithScores = ({ tweetsWithScores, ...rest }) => {
  const truncate = (num) => {
    num = num.toString();
    num = num.slice(0, num.indexOf(".") + 5);
    return num;
  };

  return (
    <Grid container spacing={2} alignItems="stretch">
      {tweetsWithScores.map((tweetWithScores) => (
        <Grid item xs={12} md={6} xl={4} key={tweetWithScores.tweet.id}>
          <Tweet
            tweet={tweetWithScores.tweet}
            showPolarity={false}
            simAlgorithms={Object.entries(tweetWithScores.scores).map(
              (entry) => {
                return {
                  color: SimilarityAlgorithmsKeys[entry[0]].color,
                  name: SimilarityAlgorithmsKeys[entry[0]].name,
                  value: truncate(entry[1]),
                };
              }
            )}
          />
        </Grid>
      ))}
    </Grid>
  );
};
