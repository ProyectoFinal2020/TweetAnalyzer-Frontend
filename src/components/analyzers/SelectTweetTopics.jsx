import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import React from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { DownloadButton } from "../shared/downloadButton/DownloadButton";
import "./selectTweetTopics.scss";

export const SelectTweetTopics = ({
  disableDownload,
  tweetTopics,
  selectedTweetTopic,
  setSelectedTweetTopic,
  handleSubmit,
  downloadUrl,
  downloadFilename,
  ...rest
}) => {
  const submit = (e) => {
    e.preventDefault();
    handleSubmit(0, selectedTweetTopic, "", 0);
  };

  return (
    <ValidatorForm onSubmit={submit}>
      <Grid container alignItems="center" justify="flex-end">
        <Grid item xs={12} className="select-tweet-topics ">
          <FormControl fullWidth={true}>
            <InputLabel shrink={tweetTopics} id="selected-tweet-topic">
              Tweets
            </InputLabel>
            <Select
              labelId="selected-tweet-topic"
              displayEmpty
              value={tweetTopics ? selectedTweetTopic : null}
              onChange={(e) => setSelectedTweetTopic(e.target.value)}
            >
              {tweetTopics
                ? tweetTopics.map((tweetTopic, key) => (
                    <MenuItem key={key} value={tweetTopic}>
                      {tweetTopic}
                    </MenuItem>
                  ))
                : null}
            </Select>
            <FormHelperText>Seleccione un conjunto de tweets</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs="auto">
          <Button type="submit" variant="contained" color="primary">
            Ejecutar
          </Button>
        </Grid>
        <DownloadButton
          url={downloadUrl}
          filename={downloadFilename}
          disabled={disableDownload}
        />
      </Grid>
    </ValidatorForm>
  );
};

// To-Do: Ver si esto va en algun lado
// : tweetTopics && tweetTopics.length === 0 ? (
//   <Box className="no_content_box">
//     {NoContentComponent(
//       "No elegiste los datos",
//       "¡Seleccioná un conjunto de tweets antes de comenzar!",
//       "#NoSearchResult",
//       [
//         {
//           handleClick: () => history.push(routes.dataSelection.path),
//           buttonText: "Seleccionar datos",
//         },
//       ]
//     )}
//   </Box>
// ) : null;
