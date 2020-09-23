import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tooltip,
  Typography,
} from "@material-ui/core";
import avatarImage from "assets/custom/img/tweetLogo.svg";
import { Paginator } from "components/shared/paginator/Paginator";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { get } from "utils/api/api.js";
import { PieChartView } from "./charts";
import { getTweetAndSentiments } from "./getTweetAndSentiments";
import { SelectTweetTopics } from "./SelectTweetTopics";
import { SentimentAnalyzerForm } from "./SentimentAnalyzerForm";

export const SentimentAnalyzer = () => {
  const { selectedData } = useContext(AuthContext);
  const [tweetAndSentiments, setTweetAndSentiments] = useState(undefined);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(6);
  const [searchBy, setSearchBy] = useState("tweets");
  const [selectedTweetTopic, setSelectedTweetTopic] = useState(
    selectedData ? selectedData.topic.title : undefined
  );
  const [tweetTopics, setTweetTopics] = useState(undefined);

  useEffect(() => {
    get("/user/tweets/topics").then((response) => {
      setTweetTopics(response.data.map((topics) => topics.topic_title));
      if (response.data.length > 0) {
        setSelectedTweetTopic(response.data[0].topic_title);
      }
    });
  }, []);

  const setResults = (results) => {
    setPage(parseInt(results.page));
    setTweetAndSentiments(getTweetAndSentiments(results.items));
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
  };

  const handlePageChange = (e, value) => {
    get(
      "/sentimentAnalyzer?page=" +
        value +
        "&per_page=" +
        tweetsPerPage +
        "&topicTitle=" +
        selectedTweetTopic
    ).then((response) => {
      setResults(response.data);
    });
  };

  const handleTweetsPerPageChange = (e) => {
    get(
      "/sentimentAnalyzer?page=" +
        1 +
        "&per_page=" +
        e.target.value +
        "&topicTitle=" +
        selectedTweetTopic
    ).then((response) => {
      setResults(response.data);
    });
  };

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
    <>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        className="sentiment_analyzer"
      >
        <Grid item xs={12}>
          <Typography component="h1" variant="h1" align="center">
            Análisis de sentimientos
          </Typography>
        </Grid>
        {selectedData &&
        selectedData.topic &&
        selectedData.algorithms &&
        selectedData.algorithms.length > 0 ? (
          <Grid item className="sentiment_group_btn">
            <ButtonGroup
              disableElevation
              variant="outlined"
              color="primary"
              size="small"
            >
              <Tooltip title="¡Aquí puedes analizar el sentimiento de un conjunto de tweets almacenado!">
                <Button
                  className={searchBy === "tweets" ? "button_selected" : ""}
                  onClick={() => setSearchBy("tweets")}
                >
                  Tweets
                </Button>
              </Tooltip>
              <Tooltip title="¡Aquí puedes puedes seleccionar un algoritmo de similitud ejecutado previamente y filtrar los tweets de acuerdo a un umbral representativo!">
                <Button
                  className={searchBy === "alg_sim" ? "button_selected" : ""}
                  onClick={() => {
                    setSearchBy("alg_sim");
                    setSelectedTweetTopic(selectedData.topic.title);
                  }}
                >
                  Algoritmos de similitud
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          {searchBy === "alg_sim" ? (
            <SentimentAnalyzerForm
              disableDownload={
                !tweetAndSentiments || tweetAndSentiments.length === 0
              }
              tweetsPerPage={tweetsPerPage}
              setResults={setResults}
            />
          ) : (
            <SelectTweetTopics
              disableDownload={
                !tweetAndSentiments || tweetAndSentiments.length === 0
              }
              tweetTopics={tweetTopics}
              selectedTweetTopic={selectedTweetTopic}
              setSelectedTweetTopic={setSelectedTweetTopic}
              tweetsPerPage={tweetsPerPage}
              setResults={setResults}
            />
          )}
        </Grid>
        {tweetAndSentiments && tweetAndSentiments.length > 0 ? (
          <>
            <Grid container direction="row" alignItems="stretch">
              {tweetAndSentiments.map((tweetAndSentiments) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  className="card_container"
                  key={tweetAndSentiments.tweet.id}
                >
                  <Card variant="outlined">
                    <CardHeader
                      avatar={
                        <Avatar
                          aria-label={tweetAndSentiments.tweet.username}
                          src={tweetAndSentiments.tweet.img_url ?? avatarImage}
                        />
                      }
                      title={
                        <a
                          href={tweetAndSentiments.tweet.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"@" + tweetAndSentiments.tweet.username}
                        </a>
                      }
                      subheader={getDateAndTime(tweetAndSentiments.tweet)}
                    />
                    <CardContent>
                      <Grid container alignItems="flex-end">
                        <Grid item xs={12} className="tweet_content">
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {tweetAndSentiments.tweet.text}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <PieChartView
                            className="pie_chart"
                            sentiment={tweetAndSentiments.emotions}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Paginator
                count={count}
                page={page}
                itemsPerPage={tweetsPerPage}
                listItemsPerPage={[6, 12, 24, 48]}
                handleItemsPerPageChange={handleTweetsPerPageChange}
                handlePageChange={handlePageChange}
              />
            </Grid>
          </>
        ) : null}
      </Grid>
    </>
  );
};
