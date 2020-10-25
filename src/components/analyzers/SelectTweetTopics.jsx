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
import React from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";
import { routes } from "utils/routes/routes";
import { DownloadButton } from "../shared/downloadButton/DownloadButton";

export const SelectTweetTopics = ({
  disableDownload,
  tweetTopics,
  selectedTweetTopic,
  setSelectedTweetTopic,
  handleSubmit,
  ...rest
}) => {
  const history = useHistory();

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(0, selectedTweetTopic, "", 0);
  };

  return tweetTopics && selectedTweetTopic ? (
    <ValidatorForm onSubmit={submit}>
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
