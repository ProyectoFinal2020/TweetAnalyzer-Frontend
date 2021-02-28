import { Box, Paper, Typography } from "@material-ui/core";
import { NoContentComponent } from "../../shared/noContent/NoContent";
import React, { useState } from "react";
import { TweetsSelection } from "../common/TweetsSelection";
import { FrequencyBubbleChart } from "./FrequencyBubbleChart";
import { HashtagCloud } from "./HashtagCloud";
import "./FrequencyAnalyzer.scss";

export const FrequencyAnalyzer = () => {
  const [hasTweets, setHasTweets] = useState(undefined);
  const [selectedData, setSelectedData] = useState(undefined);

  const handleSubmit = (reportId, topicTitle, algorithm, threshold) => {
    const newSelectedData = {
      topicTitle: topicTitle,
      reportId: reportId,
      algorithm: algorithm,
      threshold: threshold,
    };
    setSelectedData(newSelectedData);
  };

  return (
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Análisis de frecuencias
      </Typography>
      <TweetsSelection
        sectionName="frecuencias"
        handleSubmit={handleSubmit}
        setHasTweets={setHasTweets}
      />
      {selectedData ? (
        <>
          <HashtagCloud className="card-row" selectedData={selectedData} />
          <FrequencyBubbleChart
            className="card-row"
            selectedData={selectedData}
          />
        </>
      ) : hasTweets && !selectedData ? (
        <Paper>
          <Box className="no-content-box">
            {NoContentComponent(
              "Aún no realizaste un análisis de frecuencias",
              "¡Obtené el gráfico de hashtags y el gráfico de contenido del conjunto de tweets que desees!",
              "#NoSearchResult"
            )}
          </Box>
        </Paper>
      ) : null}
    </>
  );
};
