import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { TweetsSelection } from "components/analyzers/common/TweetsSelection";
import { DownloadButton } from "components/shared/downloadButton/DownloadButton";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { TablePaginator } from "components/shared/paginator/TablePaginator";
import { Tweet } from "components/shared/tweet/Tweet";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { get, post } from "utils/api/api.js";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import "./EmotionAnalyzer.scss";
import { getTweetAndEmotions } from "./getTweetAndEmotions";
import { SummaryChartDialog } from "./SummaryChartDialog";

export const EmotionAnalyzer = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [hasTweets, setHasTweets] = useState(undefined);
  const [tweetAndEmotions, setTweetAndEmotions] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(6);
  const [wasExecuted, setWasExecuted] = useState(false);
  const [savedData, setSavedData] = useState(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!wasExecuted && selectedData && selectedData.emotionAnalysis) {
      get(
        "/emotionAnalyzer?page=" +
          1 +
          "&per_page=" +
          6 +
          "&topicTitle=" +
          selectedData.emotionAnalysis.topicTitle
      ).then((response) => {
        setResults(response.data);
      });
    }
  }, [selectedData, wasExecuted]);

  const setResults = (results) => {
    setPage(parseInt(results.page));
    setTweetAndEmotions(getTweetAndEmotions(results.items));
    setTweetsPerPage(parseInt(results.per_page));
    setTotal(parseInt(results.total));
  };

  const getTweets = (page, per_page) => {
    get(
      "/emotionAnalyzer?page=" +
        page +
        "&per_page=" +
        per_page +
        "&topicTitle=" +
        selectedData.emotionAnalysis.topicTitle
    ).then((response) => {
      setResults(response.data);
    });
  };

  const handleSubmit = (reportId, topicTitle, algorithm, threshold) => {
    setWasExecuted(true);
    setTweetAndEmotions(undefined);
    const newSelectedData = {
      ...selectedData,
      emotionAnalysis: {
        topicTitle: topicTitle,
        algorithm: algorithm,
        threshold: threshold,
      },
    };
    saveSelectedData(newSelectedData);
    setSelectedData(newSelectedData);
    setSavedData({ ...newSelectedData.emotionAnalysis, reportId: reportId });
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

  return (
    <>
      <Typography component="h1" variant="h1" align="center">
        Análisis de emociones
      </Typography>
      <TweetsSelection
        sectionName="emociones"
        handleSubmit={handleSubmit}
        setHasTweets={setHasTweets}
      />
      {selectedData && selectedData.emotionAnalysis ? (
        <Card classes={{ root: "emotion-analyzer-container" }}>
          <CardHeader
            title={selectedData.emotionAnalysis.topicTitle}
            subheader={
              selectedData.emotionAnalysis.algorithm ? (
                <div>
                  <Typography variant="subheader" component="p">
                    Algoritmo: {selectedData.emotionAnalysis.algorithm}
                  </Typography>
                  <Typography variant="subheader" component="p">
                    Umbral: {selectedData.emotionAnalysis.threshold}
                  </Typography>
                </div>
              ) : null
            }
            action={
              <>
                <DownloadButton
                  asIcon={true}
                  url={
                    "/emotionAnalyzer/download?topicTitle=" +
                    selectedData.emotionAnalysis.topicTitle
                  }
                  disableDownload={
                    !tweetAndEmotions || tweetAndEmotions.length === 0
                  }
                  filename={
                    selectedData.emotionAnalysis.topicTitle +
                    "-emotion-analysis"
                  }
                />
                {savedData ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setDialogOpen(true)}
                  >
                    Ver resumen
                  </Button>
                ) : null}
              </>
            }
            classes={{
              root: "emotion-analyzer-header",
              action: "emotion-analyzer-header-action",
            }}
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
                <TablePaginator
                  total={total}
                  page={page}
                  itemsPerPage={tweetsPerPage}
                  listItemsPerPage={[6, 12, 24, 48]}
                  getItems={getTweets}
                  setPage={setPage}
                  setItemsPerPage={setTweetsPerPage}
                />
                <SummaryChartDialog
                  open={dialogOpen}
                  setOpen={setDialogOpen}
                  savedData={savedData}
                />
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : hasTweets && (!selectedData || !selectedData.emotionAnalysis) ? (
        <Paper style={{ padding: 5, marginTop: 15 }}>
          <Box className="no_content_box">
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
