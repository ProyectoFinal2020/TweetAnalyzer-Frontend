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
import { getTweetAndEmotions } from "./getTweetAndEmotions";
import { SelectTweetTopics } from "./SelectTweetTopics";
import { EmotionAnalyzerForm } from "./EmotionAnalyzerForm";

export const EmotionAnalyzer = () => {
  const { selectedData } = useContext(AuthContext);
  const [tweetAndEmotions, setTweetAndEmotions] = useState(undefined);
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
    if (!wasExecuted && selectedData.emotionAnalysis) {
      get(
        "/emotionAnalyzer?page=" +
          1 +
          "&per_page=" +
          6 +
          "&topicTitle=" +
          selectedData.emotionAnalysis
      ).then((response) => {
        setResults(response.data);
      });
    }
  }, [selectedData.emotionAnalysis, wasExecuted]);

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
    setTweetAndEmotions(getTweetAndEmotions(results.items));
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
  };

  const handlePageChange = (e, value) => {
    let aux = wasExecuted ? selectedTweetTopic : selectedData.emotionAnalysis;
    get(
      "/emotionAnalyzer?page=" +
        value +
        "&per_page=" +
        tweetsPerPage +
        "&topicTitle=" +
        aux
    ).then((response) => {
      setResults(response.data);
    });
  };

  const handleTweetsPerPageChange = (e) => {
    let aux = wasExecuted ? selectedTweetTopic : selectedData.emotionAnalysis;
    get(
      "/emotionAnalyzer?page=" +
        1 +
        "&per_page=" +
        e.target.value +
        "&topicTitle=" +
        aux
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
        className="emotion_analyzer"
      >
        <Grid item xs={12}>
          <Typography component="h1" variant="h1" align="center">
            Análisis de emociones
          </Typography>
        </Grid>
        {selectedData &&
        selectedData.topic &&
        selectedData.algorithms &&
        selectedData.algorithms.length > 0 ? (
          <Grid item className="emotion_group_btn">
            <ButtonGroup
              disableElevation
              variant="outlined"
              color="primary"
              size="small"
            >
              <Tooltip title="¡Aquí puedes analizar las emociones de un conjunto de tweets almacenado!">
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
            <EmotionAnalyzerForm
              disableDownload={
                !tweetAndEmotions || tweetAndEmotions.length === 0
              }
              tweetsPerPage={tweetsPerPage}
              setResults={setResults}
              setWasExecuted={setWasExecuted}
              setTweetAndEmotions={setTweetAndEmotions}
            />
          ) : (
            <SelectTweetTopics
              disableDownload={
                !tweetAndEmotions || tweetAndEmotions.length === 0
              }
              tweetTopics={tweetTopics}
              selectedTweetTopic={selectedTweetTopic}
              setSelectedTweetTopic={setSelectedTweetTopic}
              tweetsPerPage={tweetsPerPage}
              setResults={setResults}
              setWasExecuted={setWasExecuted}
              setTweetAndEmotions={setTweetAndEmotions}
            />
          )}
        </Grid>
        {/* ToDo KAIT MAGIC  (poner el algoritmo y/o titulo que se ejecuto?)*/}
        {tweetAndEmotions && !wasExecuted ? (
          <Typography variant="caption">
            Esto fue lo último que se ejecutó...
          </Typography>
        ) : null}
        {tweetAndEmotions && tweetAndEmotions.length > 0 ? (
          <>
            <Grid container direction="row" alignItems="stretch">
              {tweetAndEmotions.map((tweetAndEmotions) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  className="card_container"
                  key={tweetAndEmotions.tweet.id}
                >
                  <Card variant="outlined">
                    <CardHeader
                      avatar={
                        <Avatar
                          aria-label={tweetAndEmotions.tweet.username}
                          src={tweetAndEmotions.tweet.img_url ?? avatarImage}
                        />
                      }
                      title={
                        <a
                          href={tweetAndEmotions.tweet.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"@" + tweetAndEmotions.tweet.username}
                        </a>
                      }
                      subheader={getDateAndTime(tweetAndEmotions.tweet)}
                    />
                    <CardContent>
                      <Grid container alignItems="flex-end">
                        <Grid item xs={12} className="tweet_content">
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {tweetAndEmotions.tweet.text}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <PieChartView
                            className="pie_chart"
                            emotion={tweetAndEmotions.emotions}
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
