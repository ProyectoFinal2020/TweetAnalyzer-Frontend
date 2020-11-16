import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
} from "@material-ui/core";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useState } from "react";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { TweetsSelection } from "../common/TweetsSelection";
import { FrequencyBubbleChart } from "./FrequencyBubbleChart";
import { HashtagCloud } from "./HashtagCloud";

export const FrequencyAnalyzer = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [hasTweets, setHasTweets] = useState(undefined);

  const handleSubmit = (reportId, topicTitle, algorithm, threshold) => {
    const newSelectedData = {
      ...selectedData,
      frequencyAnalysis: {
        topicTitle: topicTitle,
        algorithm: algorithm,
        threshold: threshold,
      },
    };
    saveSelectedData(newSelectedData);
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
      {selectedData && selectedData.frequencyAnalysis ? (
        <Card className="card-row">
          <CardHeader
            title={selectedData.frequencyAnalysis.topicTitle}
            subheader={
              selectedData.frequencyAnalysis.algorithm ? (
                <div>
                  <Typography variant="subheader" component="p">
                    Algoritmo: {selectedData.frequencyAnalysis.algorithm}
                  </Typography>
                  <Typography variant="subheader" component="p">
                    Umbral: {selectedData.frequencyAnalysis.threshold}
                  </Typography>
                </div>
              ) : null
            }
          />
          <CardContent>
            <HashtagCloud className="card-row" />
            <FrequencyBubbleChart className="card-row" />
          </CardContent>
        </Card>
      ) : hasTweets && (!selectedData || !selectedData.frequencyAnalysis) ? (
        <Paper style={{ padding: 5, marginTop: 15 }}>
          <Box className="no_content_box">
            {NoContentComponent(
              "Aún no realizaste un análisis de frecuencias",
              "¡Obtené la nube de hashtags y el gráfico de burbujas del conjunto de tweets que desees!",
              "#NoSearchResult"
            )}
          </Box>
        </Paper>
      ) : null}
    </>
  );
};
