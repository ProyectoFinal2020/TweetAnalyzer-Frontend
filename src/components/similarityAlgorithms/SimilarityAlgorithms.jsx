import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Skeleton from "@material-ui/lab/Skeleton";
import { FilterFields } from "components/shared/chips/FilterFields";
import { DownloadButton } from "components/shared/downloadButton/DownloadButton";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { ResponsiveTablePaginator } from "components/shared/paginator/ResponsiveTablePaginator";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { get, post } from "utils/api/api";
import { saveSelectedData } from "utils/localStorageManagement/selectedData";
import { routes } from "utils/routes/routes";
import { SelectSimilarityAlgorithmsForm } from "./SelectSimilarityAlgorithmsForm";
import "./SimilarityAlgorithms.scss";
import { TweetsWithScores } from "./TweetsWithScores";
import { TweetsWithScoresTable } from "./TweetsWithScoresTable";

export const SimilarityAlgorithms = () => {
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const [tweetsWithScores, setTweetsWithScores] = useState(undefined);
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(10);
  const [sortDirections, setSortDirections] = useState({});
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
    getData(selectedData.algorithms, page, tweetsPerPage, !dict[prop], prop);
    setSortDirections(dict);
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
      sortDirections[selectedProp],
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
          <Card>
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
                title={selectedData.topic.title}
                subheader={selectedData.algorithms.join(", ")}
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
              />
              <CardContent>
                {tweetsWithScores && tweetsWithScores.length > 0 ? (
                  <>
                    <TweetsWithScores tweetsWithScores={tweetsWithScores} />
                    <ResponsiveTablePaginator
                      count={count}
                      total={total}
                      page={page}
                      itemsPerPage={tweetsPerPage}
                      listItemsPerPage={[10, 25, 50, 100]}
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
                        <Skeleton height={300} variant="rect" />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Skeleton height={52} variant="rect" />
                    </Grid>
                  </Grid>
                ) : null}
              </CardContent>
              <CardActions style={{ justifyContent: "flex-end" }}>
                <Button
                  className="success"
                  aria-label="Continuar"
                  variant="contained"
                  startIcon={<NavigateNextIcon />}
                  onClick={() => history.push(routes.emotionAnalyzer.path)}
                >
                  Continuar
                </Button>
              </CardActions>
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
        <Paper style={{ padding: 5, marginTop: 15 }}>
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
        </Paper>
      )}
    </>
  );
};
