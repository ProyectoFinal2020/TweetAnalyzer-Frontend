import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import Skeleton from "@material-ui/lab/Skeleton";
import { TweetsSelection } from "../../analyzers/common/TweetsSelection";
import { DownloadButton } from "../../shared/downloadButton/DownloadButton";
import { EmptyMessageResult } from "../../shared/emptyMessageResult/EmptyMessageResult";
import { NoContentComponent } from "../../shared/noContent/NoContent";
import { ResponsiveTablePaginator } from "../../shared/paginator/ResponsiveTablePaginator";
import { SimilarityAlgorithmsKeys } from "../../similarityAlgorithms/SimilarityAlgorithmsNames";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { get } from "../../../utils/api/api";
import { Tweet } from "../../shared/tweet/Tweet";
import { CardSubheader } from "../common/CardSubheader";
import { FilterByThresholdDialog } from "./dialogs/FilterByThresholdDialog";
import { getOptions, graphColors } from "./graphAuxStructures";
import "./SentimentAnalyzer.scss";

export const SentimentAnalyzer = () => {
  const [open, setOpen] = React.useState(false);
  const [searchedPolarity, setSearchedPolarity] = React.useState([-1, 1]);
  const [graphInfo, setGraphInfo] = useState(undefined);
  const [tweets, setTweets] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(6);
  const [hasTweets, setHasTweets] = useState(undefined);
  const [selectedData, setSelectedData] = useState(undefined);
  const [showResults, setShowResults] = useState(true);
  const STEP_SIZE = 0.25;

  const getTweets = (
    page,
    per_page,
    topic_title,
    min_polarity,
    max_polarity,
    reportId,
    algorithm,
    threshold
  ) => {
    setSearchedPolarity([min_polarity, max_polarity]);
    get(
      "/sentimentAnalyzer?page=" +
        page +
        "&per_page=" +
        per_page +
        "&topicTitle=" +
        topic_title +
        "&min_polarity=" +
        min_polarity +
        "&max_polarity=" +
        max_polarity +
        "&reportId=" +
        reportId +
        "&algorithm=" +
        algorithm +
        "&threshold=" +
        threshold
    ).then((response) => {
      setResults(response.data);
      setShowResults(response.data.total !== "0");
    });
  };

  const setResults = (results) => {
    setPage(parseInt(results.page));
    setTweets(results.items);
    setTweetsPerPage(parseInt(results.per_page));
    setTotal(parseInt(results.total));
    setCount(parseInt(results.pages));
  };

  const setGraphResults = (topicTitle, result) => {
    const data = {
      labels: result.map((e) => e.min_value + " a " + e.max_value),
      datasets: [
        {
          label: topicTitle,
          backgroundColor: graphColors,
          borderColor: graphColors,
          borderWidth: 1,
          data: result.map((e) => e.tweets_amount),
        },
      ],
    };
    setGraphInfo(data);
  };

  const handleSubmit = (polarity) => {
    setSearchedPolarity(polarity);
    getTweets(
      page,
      tweetsPerPage,
      selectedData.topicTitle,
      polarity[0],
      polarity[1],
      selectedData.reportId,
      selectedData.algorithm,
      selectedData.threshold
    );
  };

  const handleTweetSelectionSubmit = (
    reportId,
    topicTitle,
    algorithm,
    threshold
  ) => {
    setGraphInfo(undefined);
    setSelectedData({
      topicTitle: topicTitle,
      reportId: reportId,
      algorithm: algorithm,
      threshold: threshold,
    });
    getTweets(
      page,
      tweetsPerPage,
      topicTitle,
      searchedPolarity[0],
      searchedPolarity[1],
      reportId,
      algorithm,
      threshold
    );
    get(
      "/sentimentAnalyzer/graph?topicTitle=" +
        topicTitle +
        "&reportId=" +
        reportId +
        "&algorithm=" +
        algorithm +
        "&threshold=" +
        threshold
    ).then((response) => {
      setGraphResults(topicTitle, response.data);
    });
  };

  return (
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Análisis de sentimientos
      </Typography>
      <TweetsSelection
        sectionName="sentimientos"
        handleSubmit={handleTweetSelectionSubmit}
        setHasTweets={setHasTweets}
      />
      {selectedData ? (
        showResults ? (
          <>
            <Card className="card-row">
              <CardHeader
                title="Sentimientos"
                subheader={
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
                              value:
                                SimilarityAlgorithmsKeys[selectedData.algorithm]
                                  .name,
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
                }
                action={
                  <DownloadButton
                    asIcon={true}
                    url={
                      "/sentimentAnalyzer/download?topicTitle=" +
                      selectedData.topicTitle +
                      "&step_size=" +
                      STEP_SIZE
                    }
                    disableDownload={!graphInfo}
                    filename={selectedData.topicTitle + "-sentiment-analysis"}
                  />
                }
              />
              <CardContent style={{ padding: "0 40px 20px" }}>
                {graphInfo ? (
                  <Bar
                    height={100}
                    width={350}
                    data={graphInfo}
                    legend={{ display: false }}
                    options={getOptions()}
                  />
                ) : (
                  <Skeleton variant="rect" width="100%" height={310} />
                )}
              </CardContent>
            </Card>
            <Card style={{ marginTop: 15 }}>
              <CardHeader
                title="Filtrado de tweets"
                subheader={
                  <CardSubheader
                    labels={[
                      {
                        title: "Polaridad mínima",
                        value: searchedPolarity[0],
                      },
                      {
                        title: "Polaridad máxima",
                        value: searchedPolarity[1],
                      },
                    ]}
                  />
                }
                action={
                  <Tooltip title="Filtrar">
                    <IconButton onClick={() => setOpen(true)}>
                      <FilterListIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent>
                {tweets ? (
                  <>
                    <Grid container spacing={2} alignItems="stretch">
                      {tweets.map((tweet) => (
                        <Grid item xs={12} sm={6} lg={4} key={tweet.id}>
                          <Tweet tweet={tweet} showPolarity={true} />
                        </Grid>
                      ))}
                    </Grid>
                    <ResponsiveTablePaginator
                      count={count}
                      total={total}
                      page={page}
                      itemsPerPage={tweetsPerPage}
                      listItemsPerPage={[6, 12, 24, 48]}
                      getItems={(page, per_page) =>
                        getTweets(
                          page,
                          per_page,
                          selectedData.topicTitle,
                          searchedPolarity[0],
                          searchedPolarity[1],
                          selectedData.reportId,
                          selectedData.algorithm,
                          selectedData.threshold
                        )
                      }
                      setPage={setPage}
                      setItemsPerPage={setTweetsPerPage}
                    />
                  </>
                ) : !tweets ? (
                  <Grid
                    container
                    direction="row"
                    alignItems="stretch"
                    spacing={2}
                  >
                    {[1, 2, 3, 4, 5, 6].map((key) => (
                      <Grid item xs={12} sm={6} lg={4} key={key}>
                        <Skeleton height={300} variant="rect" />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Skeleton height={52} variant="rect" />
                    </Grid>
                  </Grid>
                ) : (
                  <EmptyMessageResult
                    title="Lo sentimos, no se encontraron tweets con esas características."
                    subtitle="¡Intentá nuevamente con otro filtro!"
                  />
                )}
              </CardContent>
            </Card>
            <FilterByThresholdDialog
              open={open}
              setOpen={setOpen}
              STEP_SIZE={STEP_SIZE}
              minPolarity={searchedPolarity[0]}
              maxPolarity={searchedPolarity[1]}
              handleSubmit={handleSubmit}
            />
          </>
        ) : (
          <Card>
            <EmptyMessageResult
              title="Lo sentimos, no se encontraron tweets con esas características."
              subtitle="¡Intentá nuevamente con otro umbral!"
            />
          </Card>
        )
      ) : hasTweets && !selectedData ? (
        <Paper>
          <Box className="no-content-box">
            {NoContentComponent(
              "Aún no realizaste un análisis de sentimientos",
              "¡Obtené los sentimientos del conjunto de tweets que desees!",
              "#NoSearchResult"
            )}
          </Box>
        </Paper>
      ) : null}
    </>
  );
};
