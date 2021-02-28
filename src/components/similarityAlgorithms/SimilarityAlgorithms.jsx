import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { CardSubheader } from "../analyzers/common/CardSubheader";
import { FilterFields } from "../shared/chips/FilterFields";
import { DownloadButton } from "../shared/downloadButton/DownloadButton";
import { Dropdown } from "../shared/dropdown/Dropdown";
import { NoContentComponent } from "../shared/noContent/NoContent";
import { ResponsiveTablePaginator } from "../shared/paginator/ResponsiveTablePaginator";
import { AuthContext } from "../../contexts/AuthContext";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { get, post } from "../../utils/api/api";
import { saveSelectedData } from "../../utils/localStorageManagement/selectedData";
import { routes } from "../../utils/routes/routes";
import { SelectSimilarityAlgorithmsForm } from "./SelectSimilarityAlgorithmsForm";
import "./SimilarityAlgorithms.scss";
import { SimilarityAlgorithmsKeys } from "./SimilarityAlgorithmsNames";
import { TweetsWithScores } from "./TweetsWithScores";

export const SimilarityAlgorithms = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [tweetsWithScores, setTweetsWithScores] = useState(undefined);
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(6);
  const [sortDescending, setSortDescending] = useState(false);
  const [selectedProp, setSelectedProp] = useState("Tweet");
  const [isExecuting, setIsExecuting] = useState(false);

  const setResults = (results) => {
    getTweetsAndScores(results.items);
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
    setTotal(parseInt(results.total));
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
    algorithms = selectedData.algorithms,
    pageNum = 1,
    perPage = 6,
    desc = false,
    orderBy = "Tweet"
  ) => {
    setIsExecuting(true);
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
    getData(selectedData.algorithms, page, tweetsPerPage, sortDescending, prop);
  };

  const changeSortDirection = (desc) => {
    setSortDescending(desc);
    getData(selectedData.algorithms, page, tweetsPerPage, desc, selectedProp);
  };

  const handleSubmit = (algorithms) => {
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
  };

  const getTweets = (page, per_page) => {
    getData(
      selectedData.algorithms,
      page,
      per_page,
      sortDescending,
      selectedProp
    );
  };

  return (
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Algoritmos de similitud
      </Typography>
      {selectedData && selectedData.topic && selectedData.report ? (
        <>
          <Card className="card-row">
            <CardContent>
              <FilterFields
                values={[
                  "Noticia: " + selectedData.report.title,
                  "Tweets: " + selectedData.topic.title,
                ]}
              />
              <SelectSimilarityAlgorithmsForm
                handleSubmit={handleSubmit}
                initializeData={getData}
              />
            </CardContent>
          </Card>
          {selectedData.algorithms ? (
            <Card className="card-row">
              <CardHeader
                title="Similitudes"
                subheader={
                  <CardSubheader
                    labels={[
                      {
                        title: "Algoritmos",
                        value: selectedData.algorithms
                          .map(
                            (algorithm) =>
                              SimilarityAlgorithmsKeys[algorithm].name
                          )
                          .join(", "),
                      },
                    ]}
                  />
                }
                action={
                  <DownloadButton
                    asIcon={true}
                    url={
                      selectedData.algorithms
                        ? "/similarityAlgorithms/download?topicTitle=" +
                          selectedData.topic.title +
                          "&reportId=" +
                          selectedData.report.id +
                          "&algorithms=" +
                          selectedData.algorithms.join()
                        : null
                    }
                    disableDownload={
                      !tweetsWithScores || tweetsWithScores.length === 0
                    }
                    filename={
                      selectedData.topic.title + "-similarity-algorithms"
                    }
                  />
                }
                className="pdg-btm-0"
              />
              <CardContent className="pdg-top-0">
                <Box style={{ float: "right" }}>
                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 200, marginRight: 10 }}
                    margin="dense"
                  >
                    <Dropdown
                      value={selectedProp}
                      onChange={(e) => sortByProp(e.target.value)}
                      label="Ordenar por"
                      disabled={!tweetsWithScores}
                      menuItems={[
                        <MenuItem value="Tweet" key={0}>
                          Tweet
                        </MenuItem>,
                      ].concat(
                        selectedData.algorithms.map((algorithm, index) => (
                          <MenuItem value={algorithm} key={index + 1}>
                            {SimilarityAlgorithmsKeys[algorithm].name}
                          </MenuItem>
                        ))
                      )}
                    />
                  </FormControl>
                  <Tooltip
                    title={
                      sortDescending
                        ? "Ordenar ascendente"
                        : "Ordenar descendente"
                    }
                  >
                    <span>
                      <Button
                        style={{ marginTop: 7, height: 42, minWidth: 50 }}
                        onClick={() => changeSortDirection(!sortDescending)}
                        disabled={!tweetsWithScores}
                      >
                        <i
                          style={{ fontSize: "18px" }}
                          className={
                            selectedProp !== "Tweet"
                              ? sortDescending
                                ? "fas fa-sort-amount-up"
                                : "fas fa-sort-amount-down"
                              : sortDescending
                              ? "fas fa-sort-alpha-up"
                              : "fas fa-sort-alpha-down"
                          }
                        ></i>
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
                {tweetsWithScores && tweetsWithScores.length > 0 ? (
                  <>
                    <TweetsWithScores tweetsWithScores={tweetsWithScores} />
                    <ResponsiveTablePaginator
                      count={count}
                      total={total}
                      page={page}
                      itemsPerPage={tweetsPerPage}
                      listItemsPerPage={[6, 12, 24, 48]}
                      getItems={getTweets}
                      setPage={setPage}
                      setItemsPerPage={setTweetsPerPage}
                    />
                  </>
                ) : isExecuting ? (
                  <Grid
                    container
                    direction="row"
                    alignItems="stretch"
                    spacing={2}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => (
                      <Grid item xs={12} md={6} xl={4} key={key}>
                        <Skeleton height={280} variant="rect" />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Skeleton height={52} variant="rect" />
                    </Grid>
                  </Grid>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <Paper style={{ padding: 5, marginTop: 15 }}>
              <Box className="no_content_box">
                {NoContentComponent(
                  "Aún no ejecutaste los algoritmos",
                  "¡Seleccioná al menos un algoritmo a ejecutar!",
                  "#EmptyInbox"
                )}
              </Box>
            </Paper>
          )}
        </>
      ) : (
        <Paper className="no-content-paper">
          <Box>
            {NoContentComponent(
              "No elegiste los datos",
              "¡Seleccioná una noticia y un conjunto de tweets antes de comenzar!",
              "#Error",
              [
                {
                  handleClick: () => history.push(routes.dataSelection.path),
                  buttonText: "Seleccionar datos",
                },
              ]
            )}
          </Box>
        </Paper>
      )}
    </>
  );
};
