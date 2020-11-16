import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { TweetsSelection } from "components/analyzers/common/TweetsSelection";
import { DownloadButton } from "components/shared/downloadButton/DownloadButton";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { ResponsiveTablePaginator } from "components/shared/paginator/ResponsiveTablePaginator";
import { EmotionChart } from "components/shared/tweet/EmotionChart";
import { Tweet } from "components/shared/tweet/Tweet";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { get, post } from "utils/api/api.js";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import "./EmotionAnalyzer.scss";
import { getEmotions, getTweetAndEmotions } from "./getTweetAndEmotions";

export const EmotionAnalyzer = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [hasTweets, setHasTweets] = useState(undefined);
  const [tweetAndEmotions, setTweetAndEmotions] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(6);
  const [count, setCount] = useState(0);
  const [wasExecuted, setWasExecuted] = useState(false);
  const [topicEmotions, setTopicEmotions] = useState(undefined);

  useEffect(() => {
    if (!wasExecuted && selectedData && selectedData.emotionAnalysis) {
      get(
        "/emotionAnalyzer?page=" +
          1 +
          "&per_page=" +
          6 +
          "&topicTitle=" +
          selectedData.emotionAnalysis.topicTitle
      ).then((response) => {
        setResults(response.data);
      });
    }
  }, [selectedData, wasExecuted]);

  const setResults = (results) => {
    setPage(parseInt(results.page));
    setTweetAndEmotions(getTweetAndEmotions(results.items));
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
    setTotal(parseInt(results.total));
  };

  const getTweets = (page, per_page) => {
    get(
      "/emotionAnalyzer?page=" +
        page +
        "&per_page=" +
        per_page +
        "&topicTitle=" +
        selectedData.emotionAnalysis.topicTitle
    ).then((response) => {
      setResults(response.data);
    });
  };

  const handleSubmit = (reportId, topicTitle, algorithm, threshold) => {
    setWasExecuted(true);
    setTweetAndEmotions(undefined);
    const newSelectedData = {
      ...selectedData,
      emotionAnalysis: {
        topicTitle: topicTitle,
        algorithm: algorithm,
        threshold: threshold,
      },
    };
    saveSelectedData(newSelectedData);
    setSelectedData(newSelectedData);
    get(
      "/emotionAnalyzer/topic?topicTitle=" +
        topicTitle +
        "&reportId=" +
        reportId +
        "&algorithm=" +
        algorithm +
        "&threshold=" +
        threshold
    ).then((response) => {
      setTopicEmotions(getEmotions(response.data));
    });
    post("/emotionAnalyzer", {
      reportId: reportId,
      topicTitle: topicTitle,
      algorithm: algorithm,
      threshold: threshold,
    }).then(() => {
      get(
        "/emotionAnalyzer?page=1&per_page=" +
          tweetsPerPage +
          "&topicTitle=" +
          topicTitle
      ).then((response) => {
        setResults(response.data);
      });
    });
  };

  return (
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Análisis de emociones
      </Typography>
      <TweetsSelection
        sectionName="emociones"
        handleSubmit={handleSubmit}
        setHasTweets={setHasTweets}
      />
      {topicEmotions ? <EmotionChart emotion={topicEmotions} /> : null}
      {selectedData && selectedData.emotionAnalysis ? (
        <Card classes={{ root: "emotion-analyzer-container" }}>
          <CardHeader
            title={selectedData.emotionAnalysis.topicTitle}
            subheader={
              selectedData.emotionAnalysis.algorithm ? (
                <div>
                  <Typography variant="subheader" component="p">
                    Algoritmo: {selectedData.emotionAnalysis.algorithm}
                  </Typography>
                  <Typography variant="subheader" component="p">
                    Umbral: {selectedData.emotionAnalysis.threshold}
                  </Typography>
                </div>
              ) : null
            }
            action={
              <DownloadButton
                asIcon={true}
                url={
                  "/emotionAnalyzer/download?topicTitle=" +
                  selectedData.emotionAnalysis.topicTitle
                }
                disableDownload={
                  !tweetAndEmotions || tweetAndEmotions.length === 0
                }
                filename={
                  selectedData.emotionAnalysis.topicTitle + "-emotion-analysis"
                }
              />
            }
            classes={{
              root: "emotion-analyzer-header",
              action: "emotion-analyzer-header-action",
            }}
          />
          <CardContent>
            {tweetAndEmotions && tweetAndEmotions.length > 0 ? (
              <>
                <Grid
                  container
                  direction="row"
                  alignItems="stretch"
                  spacing={2}
                >
                  {tweetAndEmotions.map((tweetAndEmotions) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      lg={4}
                      key={tweetAndEmotions.tweet.id}
                    >
                      <Tweet
                        tweet={tweetAndEmotions.tweet}
                        emotions={tweetAndEmotions.emotions}
                      />
                    </Grid>
                  ))}
                </Grid>
                <ResponsiveTablePaginator
                  count={count}
                  total={total}
                  page={page}
                  itemsPerPage={tweetsPerPage}
                  listItemsPerPage={[6, 12, 24, 48]}
                  getItems={getTweets}
                  setPage={setPage}
                  setItemsPerPage={setTweetsPerPage}
                />
              </>
            ) : (
              <>
                <Grid
                  container
                  direction="row"
                  alignItems="stretch"
                  spacing={2}
                >
                  {[1, 2, 3, 4, 5, 6].map((key) => (
                    <Grid item xs={12} sm={6} lg={4} key={key}>
                      <Skeleton height={530} variant="rect" />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Skeleton height={52} variant="rect" />
                  </Grid>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>
      ) : hasTweets && (!selectedData || !selectedData.emotionAnalysis) ? (
        <Paper style={{ padding: 5, marginTop: 15 }}>
          <Box className="no_content_box">
            {NoContentComponent(
              "Aún no realizaste un análisis de emociones",
              "¡Obtené las emociones del conjunto de tweets que desees!",
              "#NoSearchResult"
            )}
          </Box>
        </Paper>
      ) : null}
    </>
  );
};
