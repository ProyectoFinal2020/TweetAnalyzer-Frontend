import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { get } from "utils/api/api";
import "./TweetsSelectionForms.scss";

export const SelectTweetTopics = ({ handleSubmit, setHasTweets, ...rest }) => {
  const { selectedData } = useContext(AuthContext);
  const [tweetTopics, setTweetTopics] = useState(undefined);
  const [selectedTweetTopic, setSelectedTweetTopic] = useState("");

  useEffect(() => {
    get("/user/tweets/topics").then((response) => {
      setTweetTopics(response.data.map((topics) => topics.topic_title));
      if (response.data.length > 0) {
        setSelectedTweetTopic(
          selectedData && selectedData.topic
            ? selectedData.topic.title
            : response.data[0].topic_title
        );
        setHasTweets(true);
      } else {
        setHasTweets(false);
      }
    });
    // eslint-disable-next-line
  }, []);

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(0, selectedTweetTopic, "", 0);
  };

  return (
    <ValidatorForm onSubmit={submit} className="select-form">
      <FormControl fullWidth margin="normal">
        <InputLabel
          shrink={tweetTopics && tweetTopics.length > 0}
          id="selected-tweet-topic"
        >
          Tweets
        </InputLabel>
        <Select
          labelId="selected-tweet-topic"
          disabled={!tweetTopics || tweetTopics.length === 0}
          value={selectedTweetTopic}
          onChange={(e) => setSelectedTweetTopic(e.target.value)}
        >
          {tweetTopics && tweetTopics.length > 0
            ? tweetTopics.map((tweetTopic, key) => (
                <MenuItem key={key} value={tweetTopic}>
                  {tweetTopic}
                </MenuItem>
              ))
            : null}
        </Select>
        <FormHelperText>Seleccione un conjunto de tweets</FormHelperText>
      </FormControl>
      <Box classes={{ root: "submit" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!tweetTopics || tweetTopics.length === 0}
        >
          Ejecutar
        </Button>
      </Box>
    </ValidatorForm>
  );
};
