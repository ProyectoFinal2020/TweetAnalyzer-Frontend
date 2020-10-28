import { Box, Grid, Typography } from "@material-ui/core";
import { TweetsSelection } from "components/analyzers/TweetsSelection";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { Paginator } from "components/shared/paginator/Paginator";
import { Tweet } from "components/shared/tweet/Tweet";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { get, post } from "utils/api/api.js";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { routes } from "utils/routes/routes";
import { getTweetAndEmotions } from "./getTweetAndEmotions";

export const EmotionAnalyzer = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
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
  const history = useHistory();

  useEffect(() => {
    if (!wasExecuted && selectedData && selectedData.emotionAnalysis) {
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
  }, [selectedData, wasExecuted]);

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

  const getTweets = (page, per_page) => {
    let aux = wasExecuted ? selectedTweetTopic : selectedData.emotionAnalysis;
    get(
      "/emotionAnalyzer?page=" +
        page +
        "&per_page=" +
        per_page +
        "&topicTitle=" +
        aux
    ).then((response) => {
      setResults(response.data);
    });
  };

  const handleSubmit = (reportId, topicTitle, algorithm, threshold) => {
    setWasExecuted(true);
    setTweetAndEmotions(undefined);
    saveSelectedData({
      ...selectedData,
      emotionAnalysis: topicTitle,
    });
    setSelectedData({
      ...selectedData,
      emotionAnalysis: topicTitle,
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

  return selectedData ? (
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
        <Grid item xs={12}>
          <TweetsSelection
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            setSelectedTweetTopic={setSelectedTweetTopic}
            disableDownload={!tweetAndEmotions || tweetAndEmotions.length === 0}
            tweetTopics={tweetTopics}
            selectedTweetTopic={selectedTweetTopic}
            handleSubmit={handleSubmit}
            downloadUrl={
              "/emotionAnalyzer/download?topicTitle=" + selectedData.topic.title
            }
            downloadFilename={selectedData.topic.title + "-emotion-analysis"}
          />
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
                  <Tweet
                    tweet={tweetAndEmotions.tweet}
                    emotions={tweetAndEmotions.emotions}
                  />
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
