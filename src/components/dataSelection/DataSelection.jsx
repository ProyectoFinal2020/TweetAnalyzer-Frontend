import {
  Box,
  Button,
  Fab,
  Grid,
  Hidden,
  Tooltip,
  Typography,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { Add } from "@material-ui/icons";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import SaveIcon from "@material-ui/icons/Save";
import { AuthContext } from "contexts/AuthContext";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { routes } from "utils/routes/routes";
import { ReportsCarousel } from "components/reports/ReportsCarousel";
import { TweetsByTopicTable } from "components/myTweets/TweetsByTopicTable";
import React, { useContext, useEffect, useState } from "react";
import {
  SelectValidator,
  ValidatorForm,
} from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";
import { get } from "utils/api/api.js";

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

  // To-Do: Border para que se vea mejor cual está seleccionado

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
            : routes.sentimentAnalyzer.path
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
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Selección de datos
      </Typography>
      <ValidatorForm onSubmit={handleSubmit}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          {reports.length > 0 ? (
            <Grid item xs={12} className="form_col_box">
              <ReportsCarousel
                reports={reports}
                selectedReport={selectedReport}
                selectedTweetsTopic={selectedTweetsTopic}
                setSelectedReport={(report) =>
                  setSelectedReport(report === selectedReport ? "" : report)
                }
                errors={errors}
              />
              {/* To-Do: Cambiar las flechas y los puntitos.*/}
            </Grid>
          ) : (
            <Grid item xs={12}>
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
            </Grid>
          )}
          <Grid container alignItems="center" justify="center">
            <Grid item className="tweets_topics_title">
              <Typography component="h5" variant="h5" color="textPrimary">
                Seleccionar tweets
              </Typography>
            </Grid>
            <Grid item className="reports_carousel_add_btn">
              <Button
                edge="end"
                aria-label="Agregar noticias"
                className="success"
                onClick={() => history.push(routes.tweetFetcher.path)}
              >
                <Hidden smUp>
                  <Add />
                </Hidden>
                <Hidden xsDown>Agregar tweets</Hidden>
              </Button>
            </Grid>
          </Grid>
          {tweetsTopic.length > 0 ? (
            <Grid item xs={12} className="form_col_box">
              <Grid item xs={12} className="data_selection_dropbox">
                <SelectValidator
                  labelid="tweets-label"
                  className="report_input"
                  value={
                    selectedTweetsTopic ? selectedTweetsTopic.topic_title : ""
                  }
                  onChange={handleTopicSelection}
                >
                  {tweetsTopic.length > 0 ? (
                    tweetsTopic.map((topic, key) => (
                      <MenuItem key={key} value={topic.topic_title}>
                        {topic.topic_title + " (" + topic.language + ")"}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key="no-tweets" value={undefined} disabled>
                      Todavia no posee tweets, realice una búsqueda presionando
                      el icono a la derecha
                    </MenuItem>
                  )}
                </SelectValidator>
                {errors.required ? (
                  <Typography
                    component="p"
                    variant="caption"
                    color="error"
                    align="right"
                  >
                    Debes seleccionar un tema
                  </Typography>
                ) : errors.language ? (
                  <Typography
                    component="p"
                    variant="caption"
                    color="error"
                    align="right"
                  >
                    El idioma del tema debe ser el mismo que el idioma de la
                    noticia
                  </Typography>
                ) : null}
              </Grid>
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
            </Grid>
          ) : (
            <Grid item xs={12}>
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
            </Grid>
          )}
          {tweetsTopic.length > 0 ? (
            <Box className="btn-group_fab">
              <Tooltip title="Guardar cambios">
                <Fab type="submit" color="secondary" aria-label="Guardar">
                  <SaveIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="Guardar y continuar">
                <Fab
                  onClick={(e) => handleSubmit(e, true)}
                  color="primary"
                  aria-label="Continuar"
                >
                  <NavigateNextIcon />
                </Fab>
              </Tooltip>
            </Box>
          ) : null}
        </Grid>
      </ValidatorForm>
    </>
  ) : tweetsTopic && reports ? (
    <>
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
    </>
  ) : null;
};
