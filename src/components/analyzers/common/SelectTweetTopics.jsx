import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";
import { Dropdown } from "../../shared/dropdown/Dropdown";
import React, { useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { get } from "../../../utils/api/api";
import "./TweetsSelectionForms.scss";

export const SelectTweetTopics = ({ handleSubmit, setHasTweets, ...rest }) => {
  const [tweetTopics, setTweetTopics] = useState(undefined);
  const [selectedTweetTopic, setSelectedTweetTopic] = useState("");

  useEffect(() => {
    get("/user/tweets/topics").then((response) => {
      setTweetTopics(response.data.map((topics) => topics.topic_title));
      if (response.data.length > 0) {
        setSelectedTweetTopic(response.data[0].topic_title);
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
        <Dropdown
          label="Tweets"
          disabled={!tweetTopics || tweetTopics.length === 0}
          value={selectedTweetTopic}
          onChange={(e) => setSelectedTweetTopic(e.target.value)}
          menuItems={
            tweetTopics && tweetTopics.length > 0
              ? tweetTopics.map((tweetTopic, key) => (
                  <MenuItem key={key} value={tweetTopic}>
                    {tweetTopic}
                  </MenuItem>
                ))
              : null
          }
        />
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
