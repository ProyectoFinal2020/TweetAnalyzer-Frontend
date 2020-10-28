import { Button, ButtonGroup, Grid, Tooltip } from "@material-ui/core";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext } from "react";
import { SelectSimAlgorithmForm } from "./SelectSimAlgorithmForm";
import { SelectTweetTopics } from "./SelectTweetTopics";

export const TweetsSelection = ({
  sectionName,
  searchBy,
  setSearchBy,
  setSelectedTweetTopic,
  disableDownload,
  tweetTopics,
  selectedTweetTopic,
  handleSubmit,
  downloadUrl,
  downloadFilename,
}) => {
  const { selectedData } = useContext(AuthContext);
  return (
    <>
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
            <Tooltip
              title={
                "¡Aquí puedes analizar " +
                sectionName +
                " de un conjunto de tweets almacenado!"
              }
            >
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

      {searchBy === "alg_sim" ? (
        <SelectSimAlgorithmForm
          disableDownload={disableDownload}
          handleSubmit={handleSubmit}
          downloadUrl={downloadUrl}
          downloadFilename={downloadFilename}
        />
      ) : (
        <SelectTweetTopics
          disableDownload={disableDownload}
          tweetTopics={tweetTopics}
          selectedTweetTopic={selectedTweetTopic}
          setSelectedTweetTopic={setSelectedTweetTopic}
          handleSubmit={handleSubmit}
          downloadUrl={downloadUrl}
          downloadFilename={downloadFilename}
        />
      )}
    </>
  );
};
