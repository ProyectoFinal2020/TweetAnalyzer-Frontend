import {
  Box,
  Button,
  Fab,
  Grid,
  Hidden,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { AuthContext } from "contexts/AuthContext";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { get, post } from "utils/api/api";
import { downloadFile } from "utils/fileDownloader/downloadFile.js";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { routes } from "utils/routes/routes";
import { DataSelectedInfo } from "./DataSelectedInfo";
import { SimilarityAlgorithmsNames } from "./SimilarityAlgorithmsNames";
import { TweetsWithScoresTable } from "./TweetsWithScoresTable";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const SimilarityAlgorithms = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [similarityAlgorithms, setSimilarityAlgorithms] = useState([
    "Word2Vec",
    "Doc2Vec",
  ]);
  const [tweetsWithScores, setTweetsWithScores] = useState(undefined);
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(10);
  const [sortDirections, setSortDirections] = useState({});
  const [selectedProp, setSelectedProp] = useState("Tweet");
  const [error, setError] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [wasExecuted, setWasExecuted] = useState(false);

  useEffect(() => {
    if (!wasExecuted && selectedData.algorithms) {
      getData(selectedData.algorithms);
    }
    // eslint-disable-next-line
  }, [selectedData.algorithms, wasExecuted]);

  const getAlgorithms = () => {
    let algorithms = [];
    similarityAlgorithms.forEach((name) => {
      algorithms.push(SimilarityAlgorithmsNames[name].name);
    });
    return algorithms;
  };

  const setResults = (results) => {
    getTweetsAndScores(results.items);
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
  };

  const getTweetsAndScores = (items) => {
    let aux = [...items];
    aux.forEach((item) => {
      for (var prop in item.scores) {
        if (item.scores[prop] === null) {
          delete item.scores[prop];
        }
      }
    });
    setTweetsWithScores(aux);
  };

  const getData = (
    algorithms = getAlgorithms(),
    pageNum = 1,
    perPage = 10,
    desc = false,
    orderBy = "Tweet"
  ) => {
    get(
      "/similarityAlgorithms" +
        "?page=" +
        pageNum +
        "&per_page=" +
        perPage +
        "&orderBy=" +
        orderBy +
        "&desc=" +
        desc.toString() +
        "&reportId=" +
        selectedData.report.id +
        "&topicTitle=" +
        selectedData.topic.title +
        "&algorithms=" +
        algorithms.join()
    ).then((response) => {
      setResults(response.data);
      setIsExecuting(false);
    });
  };

  const sortByProp = (prop) => {
    setSelectedProp(prop);
    let dict = { ...sortDirections };
    dict[prop] = dict[prop] ? false : true;
    getData(
      wasExecuted ? getAlgorithms() : selectedData.algorithms,
      page,
      tweetsPerPage,
      !dict[prop],
      prop
    );
    setSortDirections(dict);
  };

  const handleChange = (event) => {
    setSimilarityAlgorithms(event.target.value);
  };

  const handleClick = () => {
    setWasExecuted(true);
    let algorithms = getAlgorithms();
    if (algorithms && algorithms.length > 0) {
      setError("");
      saveSelectedData({ ...selectedData, algorithms: algorithms });
      setSelectedData({ ...selectedData, algorithms: algorithms });
      setTweetsWithScores(undefined);
      setIsExecuting(true);

      post(
        "/similarityAlgorithms",
        JSON.parse(
          JSON.stringify({
            reportId: selectedData.report.id,
            topicTitle: selectedData.topic.title,
            language: selectedData.report.language,
            algorithms: algorithms,
          })
        )
      ).then(() => {
        getData(algorithms);
      });
    } else {
      setError("Debes seleccionar al menos un algoritmo");
      return;
    }
  };

  const getTweets = (page, per_page) => {
    getData(
      wasExecuted ? getAlgorithms() : selectedData.algorithms,
      page,
      per_page,
      sortDirections[selectedProp],
      selectedProp
    );
  };

  const handleFabClick = () => {
    get(
      "/similarityAlgorithms/download?topicTitle=" +
        selectedData.topic.title +
        "&reportId=" +
        selectedData.report.id +
        "&algorithms=" +
        getAlgorithms().join()
    ).then((response) => {
      downloadFile(
        response.data,
        selectedData.topic.title + "-similarity-algorithms"
      );
    });
  };

  return selectedData ? (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className="similarity_algorithms_container"
      >
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item className="similarity_algorithms_title">
            <Typography component="h1" variant="h1" align="center">
              Algoritmos de similitud
            </Typography>
          </Grid>
          <Grid item>
            <DataSelectedInfo />
          </Grid>
        </Grid>
        <Hidden mdUp>
          <Grid
            item
            xs={12}
            sm={12}
            className="action_btn_group similarity_algorithms_action_btn_group"
          >
            <Button
              onClick={() => history.push(routes.emotionAnalyzer.path)}
              className="success"
              aria-label="Continuar"
            >
              <NavigateNextIcon /> Continuar
            </Button>
            <Button
              onClick={handleFabClick}
              className="secondary"
              aria-label="Descargar"
              disabled={!tweetsWithScores || tweetsWithScores.length === 0}
            >
              <CloudDownloadIcon /> Descargar
            </Button>
          </Grid>
        </Hidden>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={9}
          xl={7}
          className="similarity-algorithms-execute"
        >
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} sm={12} md={9}>
              <FormControl className="similarity-algorithms-form-control">
                <InputLabel id="similarity-algorithms-label">
                  Algoritmos de similitud
                </InputLabel>
                <Select
                  labelId="similarity-algorithms-label"
                  multiple
                  value={similarityAlgorithms}
                  onChange={handleChange}
                  input={<Input />}
                  renderValue={(selected) => (
                    <Box className="chips">
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {Object.keys(SimilarityAlgorithmsNames).map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox
                        checked={similarityAlgorithms.indexOf(name) > -1}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
                {error !== "" ? (
                  <Typography
                    className="my_reports_error"
                    color="error"
                    variant="caption"
                  >
                    {error}
                  </Typography>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item xs={12} md="auto">
              <Button variant="contained" color="primary" onClick={handleClick}>
                Ejecutar
              </Button>
            </Grid>
            {/* ToDo KAIT MAGIC (poner noticia y tweets que se ejecutaron?)*/}
            {tweetsWithScores && !wasExecuted ? (
              <Typography variant="caption">
                Esto fue lo último que se ejecutó...
              </Typography>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
      {(tweetsWithScores && tweetsWithScores.length > 0) || isExecuting ? (
        <TweetsWithScoresTable
          page={page}
          setPage={setPage}
          tweetsWithScores={tweetsWithScores}
          setTweetsPerPage={setTweetsPerPage}
          setTweetsWithScores={setTweetsWithScores}
          count={count}
          tweetsPerPage={tweetsPerPage}
          getTweets={getTweets}
          sortByProp={sortByProp}
          sortDirections={sortDirections}
          setSortDirections={setSortDirections}
          selectedProp={selectedProp}
          isExecuting={isExecuting}
        />
      ) : (
        <Box>
          {NoContentComponent(
            "Aún no ejecutaste los algoritmos",
            "¡Seleccioná al menos un algoritmo a ejecutar!",
            "#EmptyInbox"
          )}
        </Box>
      )}
      <Hidden smDown>
        <Box className="btn-group_fab">
          <Tooltip title="Descargar">
            <Box>
              <Fab
                onClick={handleFabClick}
                className="secondary"
                aria-label="Descargar"
                disabled={!tweetsWithScores || tweetsWithScores.length === 0}
              >
                <CloudDownloadIcon />
              </Fab>
            </Box>
          </Tooltip>
          <Tooltip title="Continuar">
            <Box>
              <Fab
                onClick={() => history.push(routes.emotionAnalyzer.path)}
                className="success"
                aria-label="Continuar"
              >
                <NavigateNextIcon />
              </Fab>
            </Box>
          </Tooltip>
        </Box>
      </Hidden>
    </>
  ) : (
    <Box className="no_content_box">
      {NoContentComponent(
        "No elegiste los datos",
        "¡Seleccioná una noticia y un conjunto de tweets antes de comenzar!",
        "#NoSearchResult",
        [
          {
            handleClick: () => history.push(routes.dataSelection.path),
            buttonText: "Seleccionar datos",
          },
        ]
      )}
    </Box>
  );
};
