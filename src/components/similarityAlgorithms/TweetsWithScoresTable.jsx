import {
  Box,
  ButtonBase,
  Chip,
  Hidden,
  Paper,
  Tooltip,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandLess";
import Skeleton from "@material-ui/lab/Skeleton";
import avatarImage from "assets/custom/img/tweetLogo.svg";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useState } from "react";
import { Tweet } from "react-fake-tweet";
import { SimilarityAlgorithmsKeys } from "./SimilarityAlgorithmsNames";

export const TweetsWithScoresTable = ({
  className,
  tweetsWithScores,
  setTweetsWithScores,
  sortDirections,
  setSortDirections,
  sortByProp,
  selectedProp,
  isExecuting,
  view,
  ...rest
}) => {
  const truncate = (num) => {
    num = num.toString();
    num = num.slice(0, num.indexOf(".") + 5);
    return num;
  };
  const [propHovered, setPropHovered] = useState("");

  const renderChipsView = () => {
    return (
      <Box className="fake_tweets_with_scores_container">
        <Paper elevation={2}>
          <MDBTable>
            <MDBTableHead color="primary-color" textWhite>
              <tr>
                <th>
                  <ButtonBase
                    onMouseOver={() => setPropHovered("Tweets")}
                    onMouseLeave={() => setPropHovered(null)}
                    onClick={() => sortByProp("Tweets")}
                  >
                    Tweet{" "}
                    <ExpandMoreIcon
                      hidden={
                        selectedProp !== "Tweets" && propHovered !== "Tweets"
                      }
                      className={
                        sortDirections["Tweets"] ? "rotate" : "inverseRotate"
                      }
                    />
                  </ButtonBase>
                </th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {tweetsWithScores.map((tweetWithScores) => (
                <tr key={tweetWithScores.tweet.id}>
                  <td className="tweets_col">
                    <Tweet
                      config={{
                        user: {
                          avatar:
                            tweetWithScores.tweet.img_url &&
                            tweetWithScores.tweet.img_url !== ""
                              ? tweetWithScores.tweet.img_url
                              : avatarImage,
                          nickname: tweetWithScores.tweet.username,
                        },
                        text: tweetWithScores.tweet.text,
                        date: tweetWithScores.tweet.date,
                        retweets: tweetWithScores.tweet.retweets,
                        likes: tweetWithScores.tweet.favorites,
                      }}
                    />
                    {Object.entries(tweetWithScores.scores).map((entry, k) => (
                      <Chip
                        key={k}
                        className="tweet_with_scores_chips"
                        style={{
                          backgroundColor:
                            SimilarityAlgorithmsKeys[entry[0]].color,
                        }}
                        label={
                          SimilarityAlgorithmsKeys[entry[0]].name +
                          ": " +
                          truncate(entry[1])
                        }
                      ></Chip>
                    ))}
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </Paper>
      </Box>
    );
  };

  return !isExecuting ? (
    <>
      {view === "table" ? (
        <Hidden mdDown>
          <Paper elevation={2} className="tweets_with_scores_table">
            <MDBTable hover>
              <MDBTableHead color="primary-color" textWhite>
                <tr>
                  <th>
                    <ButtonBase
                      onMouseOver={() => setPropHovered("Tweet")}
                      onMouseLeave={() => setPropHovered(null)}
                      onClick={() => sortByProp("Tweet")}
                    >
                      Tweet
                      <ExpandMoreIcon
                        hidden={
                          selectedProp !== "Tweet" && propHovered !== "Tweet"
                        }
                        className={
                          sortDirections["Tweet"] ? "rotate" : "inverseRotate"
                        }
                      />
                    </ButtonBase>
                  </th>
                  {Object.entries(tweetsWithScores[0].scores).map(
                    (entry, key) => (
                      <th key={key} width="8%">
                        <Tooltip
                          title={SimilarityAlgorithmsKeys[entry[0]].name}
                          placement="top"
                        >
                          <ButtonBase
                            onMouseOver={() => setPropHovered(entry[0])}
                            onMouseLeave={() => setPropHovered(null)}
                            onClick={() => sortByProp(entry[0])}
                          >
                            {SimilarityAlgorithmsKeys[entry[0]].key}
                            <ExpandMoreIcon
                              hidden={
                                selectedProp !== entry[0] &&
                                propHovered !== entry[0]
                              }
                              className={
                                sortDirections[entry[0]]
                                  ? "rotate"
                                  : "inverseRotate"
                              }
                            />
                          </ButtonBase>
                        </Tooltip>
                      </th>
                    )
                  )}
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {tweetsWithScores.map((item, key) => (
                  <tr key={key}>
                    <td className="tweets_column">{item.tweet.text}</td>
                    {Object.entries(tweetsWithScores[key].scores).map(
                      (entry, k) => (
                        <td key={k} width="8%">
                          {truncate(entry[1])}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </Paper>
        </Hidden>
      ) : (
        renderChipsView()
      )}
      <Hidden lgUp>{renderChipsView()}</Hidden>
    </>
  ) : (
    <Box>
      <Skeleton variant="text" height="70px" />
      <Skeleton variant="rect" height="450px" />
      <Skeleton variant="text" height="56px" />
    </Box>
  );
};
