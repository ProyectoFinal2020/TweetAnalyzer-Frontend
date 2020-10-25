import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";
import { get, post } from "utils/api/api.js";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { routes } from "utils/routes/routes";
import { DownloadButton } from "../shared/downloadButton/DownloadButton";

export const SelectTweetTopics = ({
  tweetTopics,
  selectedTweetTopic,
  setSelectedTweetTopic,
  tweetsPerPage,
  disableDownload,
  setResults,
  setWasExecuted,
  setTweetAndEmotions,
  ...rest
}) => {
  const history = useHistory();
  const { selectedData, setSelectedData } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setWasExecuted(true);
    setTweetAndEmotions(undefined);
    saveSelectedData({
      ...selectedData,
      emotionAnalysis: selectedTweetTopic,
    });
    setSelectedData({
      ...selectedData,
      emotionAnalysis: selectedTweetTopic,
    });
    post("/emotionAnalyzer/unfiltered", {
      reportId: 0,
      topicTitle: selectedTweetTopic,
      algorithm: "",
      threshold: 0,
    }).then(() => {
      get(
        "/emotionAnalyzer?page=1&per_page=" +
          tweetsPerPage +
          "&topicTitle=" +
          selectedTweetTopic
      ).then((response) => {
        setResults(response.data);
      });
    });
  };

  return tweetTopics && selectedTweetTopic ? (
    <ValidatorForm onSubmit={handleSubmit}>
      <Grid container alignItems="center" justify="flex-end">
        <Grid item xs={12} sm="auto" className="select_tweet_topics">
          <FormControl>
            <InputLabel shrink id="selected-tweet-topic">
              Tweets
            </InputLabel>
            <Select
              labelId="selected-tweet-topic"
              id="selected-tweet-topic-label"
              value={selectedTweetTopic}
              onChange={(e) => setSelectedTweetTopic(e.target.value)}
            >
              {tweetTopics.map((tweetTopic, key) => (
                <MenuItem key={key} value={tweetTopic}>
                  {tweetTopic}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Seleccione un conjunto de tweets</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs="auto">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="select_tweet_topic_btn"
          >
            Ejecutar
          </Button>
        </Grid>
        <DownloadButton
          url={"/emotionAnalyzer/download?topicTitle=" + selectedTweetTopic}
          filename={selectedTweetTopic + "-emotion-analysis"}
          disabled={disableDownload}
        />
      </Grid>
    </ValidatorForm>
  ) : tweetTopics && tweetTopics.length === 0 ? (
    <Box className="no_content_box">
      {NoContentComponent(
        "No elegiste los datos",
        "¡Seleccioná un conjunto de tweets antes de comenzar!",
        "#NoSearchResult",
        [
          {
            handleClick: () => history.push(routes.dataSelection.path),
            buttonText: "Seleccionar datos",
          },
        ]
      )}
    </Box>
  ) : null;
};
