import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Slider,
  Typography,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { TweetsSelection } from "components/analyzers/TweetsSelection";
import { Paginator } from "components/shared/paginator/Paginator";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { get } from "utils/api/api";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { Tweet } from "../shared/tweet/Tweet";
import { getOptions, graphColors, labels } from "./graphAuxStructures";

export const SentimentAnalyzer = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [polarity, setPolarity] = React.useState([-1, 1]);
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

  useEffect(() => {
    if (!wasExecuted && selectedData && selectedData.sentimentAnalysis) {
      get(
        "/sentimentAnalyzer/graph?topicTitle=" + selectedData.sentimentAnalysis
      ).then((response) => {
        setGraphResults(selectedData.sentimentAnalysis, response.data);
      });
    }
  }, [selectedData, wasExecuted]);

  const setGraphResults = (topicTitle, datasetData) => {
    const data = {
      labels: labels,
      datasets: [
        {
          label: topicTitle,
          backgroundColor: graphColors,
          borderColor: graphColors,
          borderWidth: 1,
          data: datasetData,
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
    getTweets(page, tweetsPerPage);
  };

  const getTweets = (page, per_page) => {
    get(
      "/sentimentAnalyzer?page=" +
        page +
        "&per_page=" +
        per_page +
        "&topicTitle=" +
        selectedData.topic.title +
        "&min_polarity=" +
        polarity[0] +
        "&max_polarity=" +
        polarity[1]
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
    saveSelectedData({
      ...selectedData,
      sentimentAnalysis: topicTitle,
    });
    setSelectedData({
      ...selectedData,
      sentimentAnalysis: topicTitle,
    });
    get(
      "/sentimentAnalyzer/graph?topicTitle=" +
        selectedData.sentimentAnalysis +
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

  return (
    <>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="h1" align="center">
            Análisis de sentimientos
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TweetsSelection
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            setSelectedTweetTopic={setSelectedTweetTopic}
            disableDownload={!graphInfo}
            tweetTopics={tweetTopics}
            selectedTweetTopic={selectedTweetTopic}
            handleSubmit={handleTweetSelectionSubmit}
          />
        </Grid>
        <Grid item xs={12}>
          {graphInfo && selectedData ? (
            <Bar
              data={graphInfo}
              legend={{ display: false }}
              options={getOptions(selectedData.topic.title)}
            />
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
        {tweets && tweets.length > 0 ? (
          <>
            <Grid container spacing={2} alignItems="stretch">
              {tweets.map((tweet) => (
                <Grid item xs={12} sm={6} md={4} xl={3} key={tweet.id}>
                  <Tweet tweet={tweet} showPolarity={true} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Paginator
                count={count}
                page={page}
                itemsPerPage={tweetsPerPage}
                listItemsPerPage={[6, 12, 24, 48]}
                getItems={getTweets}
                setPage={setPage}
                setItemsPerPage={setTweetsPerPage}
              />
            </Grid>
          </>
        ) : null}
      </Grid>
    </>
  );
};
