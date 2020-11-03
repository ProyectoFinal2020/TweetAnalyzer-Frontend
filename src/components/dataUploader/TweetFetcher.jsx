import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import React, { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { get, post } from "utils/api/api";
import { downloadFile } from "utils/fileDownloader/downloadFile.js";
import { DatePicker } from "../shared/datePicker/DatePicker";
import { LanguageButtons } from "./LanguageButtons";
import { TagChips } from "./TagChips";
import "./TweetFetcher.scss";

export const TweetFetcher = () => {
  const substractDays = (date, days) => {
    return new Date(date - days * 24 * 60 * 60 * 1000);
  };

  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [initialDate, setInitialDate] = useState(substractDays(new Date(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [language, setLanguage] = useState("en");
  const [title, setTitle] = useState("");
  const [tweetAmount, setTweetAmount] = useState("");
  const [queryResult, setQueryResult] = useState(undefined);
  const [availableSpace, setAvailableSpace] = useState(0);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [topicsWithLanguage, setTopicsWithLanguage] = useState({});
  const [contentErrors, setContentErrors] = useState({
    endDateGreaterThanInitial: false,
  });

  useEffect(() => {
    get("/user/availableSpace").then((response) => {
      setAvailableSpace(response.data);
    });
  }, [queryResult]);

  useEffect(() => {
    get("/user/info").then((response) => {
      let aux = {};
      response.data.additionalInformation.forEach(
        (item) => (aux[item.topic] = item.language)
      );
      setTopicsWithLanguage(aux);
    });
  }, []);

  useEffect(() => {
    if (endDate < initialDate) {
      return setContentErrors({ endDateGreaterThanInitial: true });
    }
    return setContentErrors({ endDateGreaterThanInitial: false });
  }, [initialDate, endDate]);

  useEffect(() => {
    ValidatorForm.addValidationRule("titleMaxLength", (value) => {
      return value.length < 30;
    });

    ValidatorForm.addValidationRule("dateCantBeMoreThan7DaysAgo", (value) => {
      if (value < substractDays(new Date(), 7)) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("endDateNotGreaterThanToday", (value) => {
      if (value > new Date()) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("tagsNotEmpty", (value) => {
      if (tags && tags.length > 0) {
        return true;
      }
      if (document.activeElement === document.getElementById("tag-field")) {
        return true;
      }
      return false;
    });

    ValidatorForm.addValidationRule(
      "maxTweetsNotGreaterThanAvailableSpace",
      (value) => {
        return availableSpace - value >= 0;
      }
    );

    return () => {
      ValidatorForm.removeValidationRule("titleMaxLength");
      ValidatorForm.removeValidationRule("dateCantBeMoreThan7DaysAgo");
      ValidatorForm.removeValidationRule("endDateNotGreaterThanToday");
      ValidatorForm.removeValidationRule("tagsNotEmpty");
      ValidatorForm.removeValidationRule(
        "maxTweetsNotGreaterThanAvailableSpace"
      );
    };
  }, [tags, endDate, initialDate, availableSpace]);

  const handleAddTag = (e) => {
    if (tag && tag !== "") {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const pad = (n) => {
    return n < 10 ? "0" + n : n;
  };

  const getDateAsString = (date) => {
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate())
    );
  };

  const createPayload = () => {
    return {
      topic_title: title,
      since: getDateAsString(initialDate),
      until: getDateAsString(endDate),
      tags: tags,
      maxAmount: parseInt(tweetAmount),
      language: language,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = createPayload();
    setQueryResult(undefined);
    setLoadingQuery(true);
    post("/tweetRetrieval", payload)
      .then((response) => {
        setQueryResult(response.data);
        setLoadingQuery(false);
      })
      .catch((error) => setLoadingQuery(false));
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("add-tag-btn").click();
      return false;
    }
  };

  return (
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Búsqueda de tweets
      </Typography>

      <ValidatorForm
        onSubmit={handleSubmit}
        className="tweet_fetcher_container"
      >
        <Card style={{ padding: 20 }}>
          <CardHeader
            style={{ paddingBottom: 0 }}
            action={
              <Box className="tweet_fetcher_data_box">
                <Typography align="center" component="p">
                  Espacio disponible: {availableSpace}
                </Typography>
              </Box>
            }
            classes={{ action: "card-action" }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7} lg={8}>
                <TextValidator
                  fullWidth={true}
                  label="Título"
                  value={title}
                  type="text"
                  variant="outlined"
                  helperText={
                    topicsWithLanguage[title]
                      ? "Ya existe un conjunto de tweets con este título. Los nuevos tweets se agregarán allí"
                      : null
                  }
                  onChange={(e) => setTitle(e.target.value)}
                  validators={["required", "titleMaxLength"]}
                  errorMessages={[
                    "El título es requerido",
                    "No debe superar los 30 caracteres",
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={5} lg={4}>
                <TextValidator
                  fullWidth={true}
                  label="Cantidad máxima de tweets"
                  value={tweetAmount}
                  onChange={(e) => setTweetAmount(e.target.value)}
                  type="number"
                  variant="outlined"
                  validators={[
                    "required",
                    "minNumber:0",
                    "maxTweetsNotGreaterThanAvailableSpace",
                  ]}
                  errorMessages={[
                    "La cantidad máxima es requerida",
                    "Debe ser un entero positivo",
                    "No debe superar el espacio disponible",
                  ]}
                />
              </Grid>
              <Grid item xs={10} sm={11}>
                <TextValidator
                  id="tag-field"
                  fullWidth={true}
                  label="Nuevo término"
                  type="text"
                  autoComplete="off"
                  variant="outlined"
                  validators={["tagsNotEmpty"]}
                  errorMessages={["Ingrese al menos un parámetro de búsqueda"]}
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyPress={handleEnterPress}
                />
              </Grid>
              <Grid
                item
                xs={2}
                sm={1}
                style={{ paddingRight: 0, paddingLeft: 0 }}
              >
                <Tooltip title="Agregar tag">
                  <IconButton
                    onClick={handleAddTag}
                    color="primary"
                    id="add-tag-btn"
                    style={{ height: "54px", width: "54px" }}
                  >
                    <AddCircle />
                  </IconButton>
                </Tooltip>
              </Grid>
              {tags && tags.length > 0 ? (
                <Grid item xs={12} style={{ paddingTop: 0 }}>
                  <TagChips items={tags} setItems={setTags} />
                </Grid>
              ) : null}
              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="Fecha inicial"
                  minDate={substractDays(new Date(), 6)}
                  maxDate={substractDays(new Date(), 1)}
                  initialDate={initialDate}
                  endDate={endDate}
                  value={initialDate}
                  validators={["required", "dateCantBeMoreThan7DaysAgo"]}
                  errorMessages={[
                    "La fecha inicial es requerida",
                    "La fecha inicial no puede ser anterior a 7 días",
                  ]}
                  handleChange={(date) => setInitialDate(date)}
                  isValid={!contentErrors.endDateGreaterThanInitial}
                />
                <Typography
                  color="error"
                  variant="caption"
                  className="label-error"
                >
                  {contentErrors.endDateGreaterThanInitial
                    ? "La fecha inicial debe ser anterior a la fecha final"
                    : null}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="Fecha final"
                  value={endDate}
                  minDate={substractDays(new Date(), 6)}
                  maxDate={new Date()}
                  initialDate={initialDate}
                  endDate={endDate}
                  validators={[
                    "required",
                    "endDateNotGreaterThanToday",
                    "dateCantBeMoreThan7DaysAgo",
                  ]}
                  errorMessages={[
                    "La fecha final es requerida",
                    "La fecha final no puede ser mayor que hoy",
                    "La fecha final no puede ser anterior a 7 días",
                  ]}
                  handleChange={(date) => setEndDate(date)}
                  isValid={!contentErrors.endDateGreaterThanInitial}
                />
                <Typography
                  color="error"
                  variant="caption"
                  className="label-error"
                >
                  {contentErrors.endDateGreaterThanInitial
                    ? "La fecha final debe ser posterior a la fecha inicial"
                    : null}
                </Typography>
              </Grid>
              <Grid item xs={9} sm={9} md={4}>
                <LanguageButtons
                  language={language}
                  setLanguage={setLanguage}
                  topicsWithLanguage={topicsWithLanguage}
                  title={title}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className="action-btns">
            <Button
              variant="contained"
              color="secondary"
              aria-label="Descargar"
              onClick={() => downloadFile(queryResult, title + "-tweets")}
              disabled={!queryResult || loadingQuery}
              startIcon={<CloudDownloadIcon />}
            >
              Descargar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loadingQuery}
            >
              Buscar
            </Button>
          </CardActions>
        </Card>
      </ValidatorForm>
    </>
  );
};
