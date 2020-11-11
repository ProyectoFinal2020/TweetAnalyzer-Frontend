import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "utils/routes/routes";
import { SelectSimAlgorithmForm } from "./SelectSimAlgorithmForm";
import { SelectTweetTopics } from "./SelectTweetTopics";
import "./TweetsSelection.scss";

export const TweetsSelection = ({
  sectionName,
  handleSubmit,
  setHasTweets,
}) => {
  const { selectedData } = useContext(AuthContext);
  const [searchBy, setSearchBy] = useState("tweets");
  const [noContent, setNoContent] = useState(false);
  const history = useHistory();

  return (
    <>
      <Paper style={{ padding: 15 }}>
        {selectedData &&
        selectedData.topic &&
        selectedData.algorithms &&
        selectedData.algorithms.length > 0 ? (
          <Grid item className="tweets-selection-group-btn">
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
                  className={searchBy === "tweets" ? "btn-selected" : ""}
                  onClick={() => setSearchBy("tweets")}
                >
                  Tweets
                </Button>
              </Tooltip>
              <Tooltip title="¡Aquí puedes puedes seleccionar un algoritmo de similitud ejecutado previamente y filtrar los tweets de acuerdo a un umbral representativo!">
                <Button
                  className={searchBy === "alg_sim" ? "btn-selected" : ""}
                  onClick={() => {
                    setSearchBy("alg_sim");
                  }}
                >
                  Algoritmos de similitud
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        ) : null}
        {searchBy === "alg_sim" ? (
          <SelectSimAlgorithmForm handleSubmit={handleSubmit} />
        ) : (
          <SelectTweetTopics
            handleSubmit={handleSubmit}
            setHasTweets={(hasTweets) => {
              setNoContent(!hasTweets);
              setHasTweets(hasTweets);
            }}
          />
        )}
      </Paper>

      {noContent ? (
        <Paper>
          <Box className="no_content_box">
            {NoContentComponent(
              "No tienes tweets",
              "¡Agregá tweets para comenzar!",
              "#Error",
              [
                {
                  handleClick: () => history.push(routes.tweetFetcher.path),
                  buttonText: "Agregar tweets",
                },
              ]
            )}
          </Box>
        </Paper>
      ) : null}
    </>
  );
};
