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
import { Tweet } from "components/shared/tweet/Tweet";
import { SimilarityAlgorithmsKeys } from "components/similarityAlgorithms/SimilarityAlgorithmsNames";
import React, { useState } from "react";
import { get } from "utils/api/api.js";
import { CardSubheader } from "../common/CardSubheader";
import "./EmotionAnalyzer.scss";
import { getTweetAndEmotions } from "./getTweetAndEmotions";
import { SummaryChart } from "./SummaryChart";

export const EmotionAnalyzer = () => {
  const [hasTweets, setHasTweets] = useState(undefined);
  const [tweetAndEmotions, setTweetAndEmotions] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(6);
  const [count, setCount] = useState(0);
  const [selectedData, setSelectedData] = useState(undefined);

  const setResults = (results) => {
    setPage(parseInt(results.page));
    setTweetAndEmotions(getTweetAndEmotions(results.items));
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
    setTotal(parseInt(results.total));
  };

  const getTweets = (page, per_page, data = selectedData) => {
    get(
      "/emotionAnalyzer?page=" +
        page +
        "&per_page=" +
        per_page +
        "&topicTitle=" +
        data.topicTitle +
        "&reportId=" +
        data.reportId +
        "&algorithm=" +
        data.algorithm +
        "&threshold=" +
        data.threshold
    ).then((response) => {
      setResults(response.data);
    });
  };

  const handleSubmit = (reportId, topicTitle, algorithm, threshold) => {
    setTweetAndEmotions(undefined);
    const newSelectedData = {
      topicTitle: topicTitle,
      reportId: reportId,
      algorithm: algorithm,
      threshold: threshold,
    };
    setSelectedData(newSelectedData);
    getTweets(1, tweetsPerPage, newSelectedData);
  };

  const getSubheader = () => {
    return (
      <CardSubheader
        labels={
          selectedData.algorithm
            ? [
                {
                  title: "Tweets",
                  value: selectedData.topicTitle,
                },
                {
                  title: "Algoritmo",
                  value: SimilarityAlgorithmsKeys[selectedData.algorithm].name,
                },
                {
                  title: "Umbral",
                  value: selectedData.threshold,
                },
              ]
            : [
                {
                  title: "Tweets",
                  value: selectedData.topicTitle,
                },
              ]
        }
      />
    );
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
      {selectedData ? (
        <>
          <Card className="card-row">
            <CardHeader
              title="Resumen de emociones"
              subheader={getSubheader()}
              className="pdg-btm-0"
            />
            <CardContent className="pdg-top-0">
              <SummaryChart selectedData={selectedData} />
            </CardContent>
          </Card>
          <Card className="card-row">
            <CardHeader
              title="Emociones"
              subheader={getSubheader()}
              action={
                <>
                  <DownloadButton
                    asIcon={true}
                    url={
                      "/emotionAnalyzer/download?topicTitle=" +
                      selectedData.topicTitle
                    }
                    disableDownload={
                      !tweetAndEmotions || tweetAndEmotions.length === 0
                    }
                    filename={selectedData.topicTitle + "-emotion-analysis"}
                  />
                </>
              }
              classes={{
                action: "emotion-analyzer-header-action",
              }}
              className="pdg-btm-0"
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
        </>
      ) : hasTweets && !selectedData ? (
        <Paper>
          <Box className="no-content-box">
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
