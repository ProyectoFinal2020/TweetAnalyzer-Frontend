import {
  Button,
  Checkbox,
  Fab,
  Grid,
  Hidden,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { AuthContext } from "contexts/AuthContext";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { get, deleteBatch } from "utils/api/api";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import { removeSelectedData } from "utils/localStorageManagement/selectedData";
import { routes } from "utils/routes/routes";
import { SpaceAvailableInfo } from "./SpaceAvailableInfo";
import { TweetsByTopicTable } from "./TweetsByTopicTable";
import { CloudDownload } from "@material-ui/icons";
import { downloadFile } from "utils/fileDownloader/downloadFile.js";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

export const MyTweets = () => {
  const [value, setValue] = useState(0);
  const [tweetsTopics, setTweetsTopics] = useState(undefined);
  const [spaceInfo, setSpaceInfo] = useState(undefined);
  const [additionalInfo, setAdditionalInfo] = useState(undefined);
  const [selectedTopic, setSelectedTopic] = useState(undefined);
  const [selectedSpaceUsed, setSelectedSpaceUsed] = useState(undefined);
  const [dictionary, setDictionary] = useState({});
  const history = useHistory();
  const { selectedData, setSelectedData } = useContext(AuthContext);

  const initializeAuxStructures = (response) => {
    setTweetsTopics(
      response.data.additionalInformation.map((item) => item.topic)
    );
    setSpaceInfo(response.data);
    if (response.data.additionalInformation.length > 0) {
      let dict = [];
      let dictAux = {};
      let i = 0;
      Object.values(response.data.additionalInformation).forEach((item) => {
        dict[item.topic] = item.spaceUsed;
        dictAux[i++] = item.topic;
      });
      setDictionary(dictAux);
      setAdditionalInfo(dict);
      setSelectedTopic(response.data.additionalInformation[0].topic);
      setSelectedSpaceUsed(dict[response.data.additionalInformation[0].topic]);
      return () => {
        dict = [];
        dictAux = {};
      };
    }
  };

  useEffect(() => {
    get("/user/info").then((response) => {
      initializeAuxStructures(response);
    });
  }, []);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
    setSelectedTopic(dictionary[newValue]);
    setSelectedSpaceUsed(additionalInfo[dictionary[newValue]]);
  };

  const uncheckBoxes = (checkboxes) => {
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.click();
      }
    });
  };

  const getTopicsToDelete = () => {
    let topicsToDelete = [];
    let checkboxes = [];
    tweetsTopics.forEach((topic) => {
      let checkbox = document.getElementById("topicId:" + topic);
      checkboxes.push(checkbox);
      if (checkbox.checked) {
        topicsToDelete.push(topic);
      }
    });
    return { topicsToDelete, checkboxes };
  };

  const handleAddClick = () => {
    history.push(routes.tweetFetcher.path);
  };

  const handleDelete = (topicsToDelete, checkboxes) => {
    deleteBatch("/user/tweets/topics", {
      topics: JSON.parse(JSON.stringify(topicsToDelete)),
    }).then((response) => {
      initializeAuxStructures(response);
      uncheckBoxes(checkboxes);
      if (selectedData && topicsToDelete.includes(selectedData.topic.title)) {
        removeSelectedData();
        setSelectedData(undefined);
      }
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    let { topicsToDelete, checkboxes } = getTopicsToDelete();
    if (topicsToDelete.length > 0) {
      swal({
        title: "¿Estás seguro?",
        text: "Una vez borrados, no podrás recuperar estos tweets",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          handleDelete(topicsToDelete, checkboxes);
          if (!topicsToDelete.includes(selectedTopic)) {
            document
              .getElementById("delete-selected-tweets-without-modal")
              .click();
          }
        }
      });
    } else {
      document.getElementById("delete-selected-tweets").click();
    }
  };

  const handleDeleteTopicClick = (e) => {
    e.preventDefault();
    let { topicsToDelete, checkboxes } = getTopicsToDelete();
    if (topicsToDelete.length > 0) {
      swal({
        title: "¿Estás seguro?",
        text: "Una vez borrados, no podrás recuperar estos tweets",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          handleDelete(topicsToDelete, checkboxes);
        }
      });
    }
  };

  const handleDownloadTweets = () => {
    get("/user/tweets?topic_title=" + selectedTopic).then((response) => {
      downloadFile(response.data, selectedTopic + "-tweets");
    });
  };

  return tweetsTopics && tweetsTopics.length > 0 ? (
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Mis tweets
      </Typography>
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={12} lg={3}>
          <SpaceAvailableInfo
            spaceInfo={spaceInfo}
            topic={{ title: selectedTopic, spaceUsed: selectedSpaceUsed }}
          />
          <Grid item xs={12} sm={12} md={12} lg={12} className="user_menu_tabs">
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Temas"
            >
              <Tab
                key="title-tab"
                disabled
                label={
                  <Grid container>
                    <Grid item xs={11} sm={11} md={11} lg={11}>
                      <Typography variant="h6" align="center">
                        Títulos
                      </Typography>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1} lg={1}>
                      <span
                        typeof="button"
                        onClick={handleDeleteTopicClick}
                        className="user_menu_delete_topics_button"
                      >
                        <Tooltip title="Eliminar temas">
                          <DeleteIcon />
                        </Tooltip>
                      </span>
                    </Grid>
                  </Grid>
                }
              ></Tab>
              {tweetsTopics.map((topic, key) => (
                <Tab
                  key={key}
                  label={
                    <Grid container>
                      <Grid item xs={11} sm={11} md={11} lg={11}>
                        <Typography variant="body1">{topic}</Typography>
                        {additionalInfo ? (
                          <Typography
                            variant="caption"
                            color="secondary"
                            id={"topic-space-used-tabs" + topic}
                          >
                            {"Espacio usado:" + additionalInfo[topic]}
                          </Typography>
                        ) : null}
                      </Grid>
                      <Grid item xs={1} sm={1} md={1} lg={1}>
                        <Checkbox
                          id={"topicId:" + topic}
                          value={topic}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                        />
                      </Grid>
                    </Grid>
                  }
                  {...a11yProps(topic)}
                  value={tweetsTopics.indexOf(topic)}
                />
              ))}
            </Tabs>
          </Grid>
          <Hidden smDown>
            <Box className="btn-group_fab">
              <Tooltip title="Descargar tweets">
                <Fab
                  onClick={handleDownloadTweets}
                  aria-label="Download"
                  className="secondary"
                >
                  <CloudDownload />
                </Fab>
              </Tooltip>
              <Tooltip title="Agregar tweets">
                <Fab
                  onClick={handleAddClick}
                  aria-label="Agregar"
                  className="success"
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="Eliminar temas y tweets">
                <Fab
                  onClick={handleClick}
                  aria-label="Eliminar"
                  className="danger"
                >
                  <DeleteIcon />
                </Fab>
              </Tooltip>
            </Box>
          </Hidden>
          <Hidden mdUp>
            <Box className="action_btn_group user_menu_add_delete_btn_box">
              <Button
                onClick={handleClick}
                aria-label="Eliminar temas y tweets individuales"
                className="danger"
              >
                <DeleteIcon /> Eliminar
              </Button>
              <Button
                onClick={handleAddClick}
                aria-label="Agregar tweets"
                className="success"
              >
                <AddIcon /> Agregar
              </Button>
            </Box>
          </Hidden>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={9}>
          {tweetsTopics.map((topic, key) => (
            <TabPanel
              key={key}
              value={value}
              index={tweetsTopics.indexOf(topic)}
              className="my_tweets_tab_panel"
            >
              <TweetsByTopicTable
                className="my_tweet_tweets_by_topic"
                topicTitle={topic}
                deleteable={true}
                reloadTopics={initializeAuxStructures}
                setTopicValue={setValue}
              />
            </TabPanel>
          ))}
        </Grid>
      </Grid>
    </>
  ) : tweetsTopics ? (
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
  ) : null;
};
