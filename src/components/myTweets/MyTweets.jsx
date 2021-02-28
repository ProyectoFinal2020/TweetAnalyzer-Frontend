import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { CardSubheader } from "../analyzers/common/CardSubheader";
import { NoContentComponent } from "../shared/noContent/NoContent";
import { AuthContext } from "../../contexts/AuthContext";
import { CustomContext } from "../../contexts/CustomContext";
import { default as React, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { deleteBatch, get } from "../../utils/api/api";
import { languagesDictionary } from "../../utils/dictionaries/language";
import { removeSelectedData } from "../../utils/localStorageManagement/selectedData";
import { routes } from "../../utils/routes/routes";
import { SpaceInfoDialog } from "./dialogs/SpaceInfoDialog";
import { TopicsRemovalDialog } from "./dialogs/TopicsRemovalDialog";
import "./MyTweets.scss";
import { SearchTweets } from "./SearchTweets";
import { TweetsTable } from "./TweetsTable";
import { DownloadButton } from "../shared/downloadButton/DownloadButton";

export const MyTweets = () => {
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [totalTweets, setTotalTweets] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(12);
  const [tweets, setTweets] = useState(undefined);
  const [tweetsTopics, setTweetsTopics] = useState(undefined);
  const [selectedTweetTopic, setSelectedTweetTopic] = useState({
    topic_title: null,
    language: null,
    spaceUsed: null,
  });
  const [spaceInfoDialogOpen, setSpaceInfoDialogOpen] = useState(false);
  const [tweetsRemovalDialogOpen, setTweetsRemovalDialogOpen] = useState(false);
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);

  useEffect(() => {
    get("/user/info").then((response) => {
      const topics = response.data.additionalInformation;
      setTweetsTopics(topics);
      setSelectedTweetTopic(topics[0]);
      getTweets(page, tweetsPerPage, topics[0]?.topic_title);
    });
    // eslint-disable-next-line
  }, []);

  const handleTweetsTopicChange = (selectedTopic) => {
    const selected = tweetsTopics.find((t) => t.topic_title === selectedTopic);
    setSelectedTweetTopic(
      selected
        ? selected
        : { topic_title: null, spaceUsed: null, language: null }
    );
    getTweets(page, tweetsPerPage, selectedTopic);
  };

  const getTweets = (page, per_page, tweetTopic) => {
    setTweets(undefined);
    get(
      "/user/tweets/paginated?page=" +
        page +
        "&per_page=" +
        per_page +
        "&topic_title=" +
        tweetTopic
    ).then((response) => {
      setResults(response.data);
    });
  };

  const setResults = (results) => {
    setPage(parseInt(results.page));
    setTweets(
      results.items.map((tweet) => {
        tweet.checked = false;
        return tweet;
      })
    );
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
    setTotalTweets(parseInt(results.total));
  };

  const updateTweetChecked = (id) => {
    const index = tweets.findIndex((t) => t.id === id);
    const tweetsAux = [...tweets];
    tweetsAux[index].checked = !tweetsAux[index].checked;
    setTweets(tweetsAux);
  };

  const handleAddClick = () => {
    history.push(routes.tweetFetcher.path);
  };

  const handleChangeCheckedAll = (allSelected) => {
    setTweets(
      tweets.map((t) => {
        t.checked = allSelected;
        return t;
      })
    );
  };

  const handleDelete = () => {
    const tweetsChecked = tweets.filter((t) => t.checked).map((t) => t.id);
    if (tweetsChecked.length === parseInt(selectedTweetTopic.spaceUsed)) {
      deleteTweetsTopics([selectedTweetTopic.topic_title]);
    } else {
      deleteTweets(tweetsChecked);
    }
  };

  const deleteTweetsTopics = (tweetsTopics) => {
    const count = tweetsTopics.length;
    deleteBatch("/user/tweets/topics", {
      topics: JSON.parse(JSON.stringify(tweetsTopics)),
    })
      .then((response) => {
        updateSelectedData(tweetsTopics);
        handleTweetsTopicsDeletion(response.data.additionalInformation);
        setSnackbarItem({
          severity: "success",
          message:
            count === 1
              ? "El tema ha sido eliminado con éxito"
              : "Los temas han sido eliminados con éxito.",
        });
        setShowSnackbar(true);
      })
      .catch((error) => {
        setSnackbarItem({
          severity: "error",
          message:
            count === 1
              ? "Lo sentimos. Hubo un error al intentar eliminar el tema."
              : "Lo sentimos. Hubo un error al intentar eliminar los temas.",
        });
        setShowSnackbar(true);
      });
  };

  const updateSelectedData = (deletedTweetsTopic) => {
    if (
      selectedData &&
      selectedData.topic &&
      deletedTweetsTopic.includes(selectedData.topic.title)
    ) {
      removeSelectedData();
      setSelectedData(undefined);
    }
  };

  const handleTweetsTopicsDeletion = (updatedTweetsTopics) => {
    setTweetsTopics(updatedTweetsTopics);
    if (
      !updatedTweetsTopics.includes(
        (t) => t.topic_title === selectedTweetTopic.topic_title
      ) &&
      updatedTweetsTopics.length > 0
    ) {
      setSelectedTweetTopic(updatedTweetsTopics[0]);
      getTweets(page, tweetsPerPage, updatedTweetsTopics[0]?.topic_title);
    }
  };

  const deleteTweets = (tweetsIds) => {
    deleteBatch("/user/tweets", {
      tweets: JSON.parse(JSON.stringify(tweetsIds)),
    }).then(() => {
      /* To-Do: actualizar el spaceused */
      const lastPage =
        (selectedTweetTopic.spaceUsed - tweetsIds.length) / tweetsPerPage;
      const newPage = lastPage > page ? page : lastPage;
      getTweets(
        Math.ceil(newPage),
        tweetsPerPage,
        selectedTweetTopic.topic_title
      );
    });
  };

  return (
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Mis tweets
      </Typography>
      {tweetsTopics && tweetsTopics.length > 0 ? (
        <>
          <Card className="card-row" style={{ padding: 15, marginBottom: 20 }}>
            <CardHeader
              action={
                <Box>
                  <Tooltip title="Agregar tweets">
                    <Button
                      className="success squared-icon-btn"
                      variant="contained"
                      onClick={handleAddClick}
                    >
                      <AddIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Eliminar temas">
                    <Button
                      className="danger squared-icon-btn"
                      variant="contained"
                      onClick={() => setTweetsRemovalDialogOpen(true)}
                    >
                      <DeleteSweepIcon />
                    </Button>
                  </Tooltip>
                </Box>
              }
              style={{ padding: "16px 24px" }}
            />
            <CardContent className="pdg-top-0">
              <SearchTweets
                tweetsTopics={tweetsTopics}
                handleTweetsTopicChange={handleTweetsTopicChange}
                selectedTweetTopic={selectedTweetTopic.topic_title}
              />
              {selectedTweetTopic.topic_title ? (
                <>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-end"
                  >
                    <Grid item>
                      <CardHeader
                        title={
                          <>
                            {selectedTweetTopic.topic_title}
                            {/* To-Do: Decidir donde poner el descargar */}
                            <DownloadButton
                              asIcon={true}
                              url={
                                "/user/tweets?topic_title=" +
                                selectedTweetTopic.topic_title
                              }
                              disableDownload={!tweets}
                              filename={
                                selectedTweetTopic.topic_title + "-tweets"
                              }
                              className="download-tweets-btn"
                            />
                          </>
                        }
                        subheader={
                          <CardSubheader
                            labels={[
                              {
                                title: "Idioma",
                                value:
                                  languagesDictionary[
                                    selectedTweetTopic.language
                                  ],
                              },
                              {
                                title: "Espacio utilizado",
                                value: totalTweets,
                                actionButton: {
                                  tooltip: "Ver espacio de almacenamiento",
                                  icon: <InfoOutlinedIcon />,
                                  onClick: () => setSpaceInfoDialogOpen(true),
                                },
                              },
                            ]}
                          />
                        }
                        style={{ padding: "0 0 10px" }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm="auto"
                      className="justify-right"
                      style={{ marginBottom: 10 }}
                    >
                      {tweets &&
                      tweets.length > 0 &&
                      tweets.every((tweet) => tweet.checked) ? (
                        <Button
                          aria-label="Deseleccionar todas"
                          onClick={() => handleChangeCheckedAll(false)}
                        >
                          <Typography variant="caption" component="span">
                            Deseleccionar todas
                          </Typography>
                        </Button>
                      ) : (
                        <Button
                          aria-label="Seleccionar todas"
                          onClick={() => handleChangeCheckedAll(true)}
                          disabled={!tweets || tweets.length === 0}
                        >
                          <Typography variant="caption" component="span">
                            Seleccionar todas
                          </Typography>
                        </Button>
                      )}
                      <Tooltip title="Eliminar tweets">
                        <span>
                          <IconButton
                            aria-label="Eliminar tweets"
                            onClick={handleDelete}
                            disabled={
                              !tweets ||
                              tweets.length === 0 ||
                              !tweets.some((t) => t.checked)
                            }
                            style={{ margin: "0 0 0 10px" }}
                          >
                            <Delete />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <TweetsTable
                    tweets={tweets}
                    count={count}
                    total={totalTweets}
                    page={page}
                    setPage={setPage}
                    tweetsPerPage={tweetsPerPage}
                    setTweetsPerPage={setTweetsPerPage}
                    selectable={true}
                    getTweets={(page, perPage) =>
                      getTweets(page, perPage, selectedTweetTopic.topic_title)
                    }
                    updateTweetChecked={updateTweetChecked}
                  />
                </>
              ) : null}
            </CardContent>
          </Card>
          <SpaceInfoDialog
            open={spaceInfoDialogOpen}
            setOpen={setSpaceInfoDialogOpen}
          />
          <TopicsRemovalDialog
            handleDelete={deleteTweetsTopics}
            tweetsTopics={tweetsTopics}
            open={tweetsRemovalDialogOpen}
            setOpen={setTweetsRemovalDialogOpen}
          />
        </>
      ) : tweetsTopics ? (
        <Paper className="no-tweets-paper">
          <Box className="no_content_box">
            {NoContentComponent(
              "No tenés tweets",
              "¡Agregá nuevos tweets para comenzar!",
              "#NoSearchResult",
              [
                {
                  handleClick: handleAddClick,
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
