import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  Hidden,
  InputLabel,
  Select,
  Typography,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { Add } from "@material-ui/icons";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import SaveIcon from "@material-ui/icons/Save";
import { TweetsByTopicTable } from "components/myTweets/TweetsByTopicTable";
import { ReportsCarousel } from "components/reports/ReportsCarousel";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { get } from "utils/api/api";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { routes } from "utils/routes/routes";
import "./DataSelection.scss";

export const DataSelection = () => {
  const [reports, setReports] = useState(undefined);
  const [selectedReport, setSelectedReport] = useState("");
  const [tweetsTopic, setTweetsTopic] = useState(undefined);
  const [selectedTweetsTopic, setSelectedTweetsTopic] = useState("");
  const history = useHistory();
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [errors, setErrors] = useState({ language: false, required: false });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedReport && selectedTweetsTopic) {
      setErrors({
        language: selectedReport.language !== selectedTweetsTopic.language,
        required: false,
      });
    } else {
      setErrors({
        language: false,
        required: submitted && selectedTweetsTopic === "",
      });
    }
  }, [selectedTweetsTopic, selectedReport, submitted]);

  useEffect(() => {
    get("/reports").then((response) => {
      setReports(response.data);
    });
  }, []);

  useEffect(() => {
    get("/user/tweets/topics").then((response) => {
      setTweetsTopic(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedData) {
      if (tweetsTopic && tweetsTopic.length > 0 && selectedData.topic) {
        setSelectedTweetsTopic({
          language: selectedData.topic.language,
          topic_title: selectedData.topic.title,
        });
      }
      if (reports && reports.length > 0 && selectedData.report) {
        setSelectedReport(selectedData.report);
      }
    }
  }, [selectedData, tweetsTopic, reports]);

  const saveChanges = () => {
    let data = {
      report: selectedReport,
      topic: {
        language: selectedTweetsTopic.language,
        title: selectedTweetsTopic.topic_title,
      },
    };
    saveSelectedData(data);
    setSelectedData(data);
  };

  const handleSubmit = (e, redirect = false) => {
    if (!errors.language && !errors.required) {
      setSubmitted(true);
      e.preventDefault();
      saveChanges();
      if (redirect) {
        history.push(
          selectedReport !== ""
            ? routes.similarityAlgorithms.path
            : routes.emotionAnalyzer.path
        );
      }
    }
  };

  const handleAddReportClick = () => {
    history.push(routes.createReports.path);
  };

  const handleAddTweetsClick = () => {
    history.push(routes.tweetFetcher.path);
  };

  const handleTopicSelection = (e) => {
    var selectedTopic = tweetsTopic.find(
      (topics) => topics.topic_title === e.target.value
    );
    setSelectedTweetsTopic({ ...selectedTopic });
  };

  return tweetsTopic &&
    reports &&
    (tweetsTopic.length > 0 || reports.length > 0) ? (
    <Box paddingBottom={10}>
      <Typography component="h1" variant="h1" align="center" className="title">
        Selección de datos
      </Typography>
      <form onSubmit={handleSubmit}>
        {reports.length > 0 ? (
          <Card classes={{ root: "card" }}>
            <CardHeader
              action={
                <Button
                  edge="end"
                  aria-label="Agregar noticias"
                  className="success"
                  variant="contained"
                  onClick={() => history.push(routes.createReports.path)}
                >
                  <Hidden smUp>
                    <Add />
                  </Hidden>
                  <Hidden xsDown>Agregar noticias</Hidden>
                </Button>
              }
              title="Seleccionar noticia"
              classes={{ action: "card-action" }}
            />
            <CardContent classes={{ root: "card-content" }}>
              <ReportsCarousel
                reports={reports}
                selectedReport={selectedReport}
                selectedTweetsTopic={selectedTweetsTopic}
                setSelectedReport={(report) =>
                  setSelectedReport(report === selectedReport ? "" : report)
                }
                errors={errors}
              />
              {/* To-Do: Cambiar los puntitos.*/}
            </CardContent>
          </Card>
        ) : (
          <Card fullWidth={true} classes={{ root: "card" }}>
            <CardContent>
              {NoContentComponent(
                "No tenés noticias",
                "¡Agregá nuevas noticias para comenzar!",
                "#NoDocuments",
                [
                  {
                    handleClick: handleAddReportClick,
                    buttonText: "Agregar noticias",
                  },
                ]
              )}
            </CardContent>
          </Card>
        )}
        {tweetsTopic.length > 0 ? (
          <Card classes={{ root: "card" }}>
            <CardHeader
              action={
                <Button
                  edge="end"
                  aria-label="Agregar noticias"
                  className="success"
                  variant="contained"
                  onClick={() => history.push(routes.tweetFetcher.path)}
                >
                  <Hidden smUp>
                    <Add />
                  </Hidden>
                  <Hidden xsDown>Agregar tweets</Hidden>
                </Button>
              }
              title=" Seleccionar tweets"
              classes={{ action: "card-action" }}
            />
            <CardContent classes={{ root: "card-content" }}>
              <FormControl fullWidth={true}>
                <InputLabel
                  shrink={selectedTweetsTopic?.topic_title ? true : false}
                  id="selected-tweet-topic"
                >
                  Seleccione un conjunto de tweets
                </InputLabel>
                <Select
                  labelId="selected-tweet-topic"
                  value={
                    selectedTweetsTopic ? selectedTweetsTopic.topic_title : ""
                  }
                  onChange={handleTopicSelection}
                >
                  {tweetsTopic.map((topic, key) => (
                    <MenuItem key={key} value={topic.topic_title}>
                      {topic.topic_title + " (" + topic.language + ")"}
                    </MenuItem>
                  ))}
                </Select>
                <Typography
                  component="p"
                  variant="caption"
                  color="error"
                  align="right"
                  style={{ minHeight: 20 }}
                >
                  {errors.required
                    ? "Debes seleccionar un tema"
                    : errors.language
                    ? "El idioma del tema debe ser el mismo que el idioma de la noticia"
                    : ""}
                </Typography>
              </FormControl>
              <Box m={1} />
              <Grid item xs={12} className="all_width">
                {selectedTweetsTopic ? (
                  <TweetsByTopicTable
                    className="data_selection_tweets_by_topic"
                    topicTitle={selectedTweetsTopic.topic_title}
                    selectedTweetsPerPage={5}
                    listTweetsPerPage={[5, 10, 15]}
                    height="400px"
                  />
                ) : null}
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Card fullWidth={true} classes={{ root: "card" }}>
            <CardContent>
              {NoContentComponent(
                "No tenés tweets",
                "¡Agregá nuevos tweets para comenzar!",
                "#NoSearchResult",
                [
                  {
                    handleClick: handleAddTweetsClick,
                    buttonText: "Agregar tweets",
                  },
                ]
              )}
            </CardContent>
          </Card>
        )}
        {tweetsTopic.length > 0 ? (
          <Box position="relative">
            <Box position="absolute" right={0}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                aria-label="Guardar selección"
                startIcon={<SaveIcon />}
                style={{ marginRight: 10 }}
              >
                Guardar
              </Button>
              <Button
                variant="contained"
                color="primary"
                aria-label="Guardar y continuar"
                onClick={(e) => handleSubmit(e, true)}
                startIcon={<NavigateNextIcon />}
              >
                Continuar
              </Button>
            </Box>
          </Box>
        ) : null}
      </form>
    </Box>
  ) : tweetsTopic && reports ? (
    <Card fullWidth={true} classes={{ root: "card" }}>
      <CardContent>
        <Box className="no_content_box">
          {NoContentComponent(
            "No tenés noticias ni tweets",
            "¡Agregá nuevas noticias y nuevos tweets para comenzar!",
            "#Error",
            [
              {
                handleClick: handleAddReportClick,
                buttonText: "Agregar noticias",
              },
              {
                handleClick: handleAddTweetsClick,
                buttonText: "Agregar tweets",
              },
            ]
          )}
        </Box>
      </CardContent>
    </Card>
  ) : null;
};
