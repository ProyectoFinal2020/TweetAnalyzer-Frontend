import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Slider,
  Typography,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import InfoIcon from "@material-ui/icons/Info";
import Skeleton from "@material-ui/lab/Skeleton";
import { TweetsSelection } from "components/analyzers/TweetsSelection";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { Paginator } from "components/shared/paginator/Paginator";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useHistory } from "react-router-dom";
import { get } from "utils/api/api";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { routes } from "utils/routes/routes";
import { Tweet } from "../../shared/tweet/Tweet";
import { getOptions, graphColors } from "./graphAuxStructures";

export const SentimentAnalyzer = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [polarity, setPolarity] = React.useState([-1, 1]);
  const [searchedPolarity, setSearchedPolarity] = React.useState([-1, 1]);
  const [reportId, setReportId] = React.useState(undefined);
  const [algorithm, setAlgorithm] = React.useState(undefined);
  const [threshold, setThreshold] = React.useState(undefined);
  const [graphInfo, setGraphInfo] = useState(undefined);
  const [tweets, setTweets] = useState(undefined);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(6);
  const [searchBy, setSearchBy] = useState("tweets");
  const [selectedTweetTopic, setSelectedTweetTopic] = useState(
    selectedData ? selectedData.topic.title : undefined
  );
  const [tweetTopics, setTweetTopics] = useState(undefined);
  const [wasExecuted, setWasExecuted] = useState(false);
  const STEP_SIZE = 0.25;
  const history = useHistory();

  useEffect(() => {
    if (!wasExecuted && selectedData && selectedData.sentimentAnalysis) {
      get(
        "/sentimentAnalyzer/graph?topicTitle=" + selectedData.sentimentAnalysis
      ).then((response) => {
        setGraphResults(selectedData.sentimentAnalysis, response.data);
      });
      getTweets(
        1,
        6,
        selectedData.sentimentAnalysis,
        polarity[0],
        polarity[1],
        0,
        "",
        0
      );
    }
    // eslint-disable-next-line
  }, [selectedData, wasExecuted]);

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

  useEffect(() => {
    get("/user/tweets/topics").then((response) => {
      setTweetTopics(response.data.map((topics) => topics.topic_title));
      if (response.data.length > 0) {
        setSelectedTweetTopic(response.data[0].topic_title);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    getTweets(
      page,
      tweetsPerPage,
      selectedData.topic.title,
      polarity[0],
      polarity[1],
      reportId,
      algorithm,
      threshold
    );
  };

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
    });
  };

  const setResults = (results) => {
    setPage(parseInt(results.page));
    setTweets(results.items);
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
  };

  const handleTweetSelectionSubmit = (
    reportId,
    topicTitle,
    algorithm,
    threshold
  ) => {
    setWasExecuted(true);
    setGraphInfo(undefined);
    setReportId(reportId);
    setAlgorithm(algorithm);
    setThreshold(threshold);
    saveSelectedData({
      ...selectedData,
      sentimentAnalysis: topicTitle,
    });
    setSelectedData({
      ...selectedData,
      sentimentAnalysis: topicTitle,
    });
    getTweets(
      page,
      tweetsPerPage,
      topicTitle,
      polarity[0],
      polarity[1],
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
      setGraphResults(selectedData.sentimentAnalysis, response.data);
    });
  };

  return selectedData ? (
    <>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="h1" align="center">
            Análisis de sentimientos
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TweetsSelection
            sectionName="sentimientos"
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            setSelectedTweetTopic={setSelectedTweetTopic}
            disableDownload={!graphInfo}
            tweetTopics={tweetTopics}
            selectedTweetTopic={selectedTweetTopic}
            handleSubmit={handleTweetSelectionSubmit}
            downloadUrl={
              "/sentimentAnalyzer/download?topicTitle=" +
              selectedData.topic.title +
              "&step_size=" +
              STEP_SIZE
            }
            downloadFilename={selectedData.topic.title + "-sentiment-analysis"}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: 15 }} elevation={3}>
            <Box width={650} height={400}>
              {graphInfo && selectedData && selectedData.topic.title ? (
                <Bar
                  data={graphInfo}
                  height={400}
                  width={650}
                  legend={{ display: false }}
                  options={getOptions(selectedData.topic.title)}
                />
              ) : (
                <Skeleton height={450} />
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" variant="h5">
            Filtrado de tweets
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth={true}>
              <InputLabel shrink id="polarity-slider">
                Rango de polaridad <InfoIcon />
              </InputLabel>
              <Slider
                className="polarity-slider"
                value={polarity}
                min={-1}
                step={STEP_SIZE}
                max={1}
                onChange={(event, value) => setPolarity(value)}
                valueLabelDisplay="auto"
                aria-labelledby="polarity-slider"
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              align="right"
              startIcon={<FilterListIcon />}
            >
              Filtrar
            </Button>
          </form>
          {tweets && tweets.length > 0 ? (
            <>
              <Box mb={0.5} align="right">
                <Chip
                  label={"Polaridad mínima: " + searchedPolarity[0]}
                  color="secondary"
                />
                <Chip
                  label={"Polaridad máxima: " + searchedPolarity[1]}
                  color="secondary"
                />
              </Box>
              <Grid container spacing={2} alignItems="stretch">
                {tweets.map((tweet) => (
                  <Grid item xs={12} sm={6} md={4} xl={3} key={tweet.id}>
                    <Tweet tweet={tweet} showPolarity={true} />
                  </Grid>
                ))}
              </Grid>
              <Paginator
                count={count}
                page={page}
                itemsPerPage={tweetsPerPage}
                listItemsPerPage={[6, 12, 24, 48]}
                getItems={(page, per_page) =>
                  getTweets(
                    page,
                    per_page,
                    selectedTweetTopic,
                    polarity[0],
                    polarity[1],
                    reportId,
                    algorithm,
                    threshold
                  )
                }
                setPage={setPage}
                setItemsPerPage={setTweetsPerPage}
              />
            </>
          ) : null}
        </Grid>
      </Grid>
    </>
  ) : (
    <Box className="no_content_box">
      {NoContentComponent(
        "No elegiste los datos",
        "¡Seleccioná una noticia y un conjunto de tweets antes de comenzar!",
        "#NoSearchResult",
        [
          {
            handleClick: () => history.push(routes.dataSelection.path),
            buttonText: "Seleccionar datos",
          },
        ]
      )}
    </Box>
  );
};
