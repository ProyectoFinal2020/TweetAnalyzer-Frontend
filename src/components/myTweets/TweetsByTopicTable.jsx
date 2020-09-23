import {
  Box,
  Checkbox,
  Grid,
  Hidden,
  IconButton,
  Paper,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Skeleton from "@material-ui/lab/Skeleton";
import avatarImage from "assets/custom/img/tweetLogo.svg";
import { Paginator } from "components/shared/paginator/Paginator";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useEffect, useState } from "react";
import { Tweet } from "react-fake-tweet";
import swal from "sweetalert";
import { deleteBatch, get } from "utils/api/api.js";

export const TweetsByTopicTable = ({
  topicTitle,
  selectedTweetsPerPage = 10,
  listTweetsPerPage = [10, 25, 50, 100],
  className,
  height = "500px",
  deleteable = false,
  reloadTopics,
  setTopicValue,
  ...rest
}) => {
  const [tweets, setTweets] = useState({});
  const [count, setCount] = useState(0);
  const [totalTweets, setTotalTweets] = useState(0);
  const [page, setPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPage] = useState(selectedTweetsPerPage);
  const [checkboxes, setCheckboxes] = useState({});

  const setResults = (results) => {
    setPage(parseInt(results.page));
    setTweets(results.items);
    setTweetsPerPage(parseInt(results.per_page));
    setCount(parseInt(results.pages));
    setTotalTweets(parseInt(results.total));
  };

  useEffect(() => {
    get(
      "/user/tweets/paginated?topic_title=" +
        topicTitle +
        "&per_page=" +
        tweetsPerPage
    ).then((response) => {
      setResults(response.data);
    });
  }, [topicTitle, tweetsPerPage]);

  const handlePageChange = (e, value) => {
    get(
      "/user/tweets/paginated?page=" +
        value +
        "&per_page=" +
        tweetsPerPage +
        "&topic_title=" +
        topicTitle
    ).then((response) => {
      setResults(response.data);
    });
  };

  const handleTweetsPerPageChange = (e) => {
    get(
      "/user/tweets/paginated?page=" +
        1 +
        "&per_page=" +
        e.target.value +
        "&topic_title=" +
        topicTitle
    ).then((response) => {
      setResults(response.data);
    });
  };

  const adjustSpaceInfo = (count) => {
    let spaceUsed = document.getElementById("space-used");
    let availableSpace = document.getElementById("available-space");
    let topicSpaceUsed = document.getElementById("topic-space-used");
    let topicSpaceUsedTab = document.getElementById(
      "topic-space-used-tabs" + topicTitle
    );
    spaceUsed.textContent = parseInt(spaceUsed.textContent) - count;
    availableSpace.textContent = parseInt(availableSpace.textContent) + count;
    topicSpaceUsed.textContent = parseInt(topicSpaceUsed.textContent) - count;
    topicSpaceUsedTab.textContent =
      "Espacio Usado:" + (getSpaceUsed() - count).toString();
  };

  const getSpaceUsed = () => {
    let topicSpaceUsedTab = document.getElementById(
      "topic-space-used-tabs" + topicTitle
    );
    return parseInt(topicSpaceUsedTab.textContent.split(":")[1]);
  };

  const handleTableDeleteWithoutModalClick = () => {
    let keys = Object.keys(checkboxes);
    if (keys.length > 0) {
      handleDelete(keys);
    }
  };

  const handleTableDeleteClick = () => {
    let keys = Object.keys(checkboxes);
    if (keys.length > 0) {
      swal({
        title: "¿Estás seguro?",
        text: "Una vez borrados, no podrás recuperar estos tweets",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          handleDelete(keys);
        }
      });
    }
  };

  const handleDelete = (keys) => {
    if (keys.length === getSpaceUsed()) {
      deleteBatch("/user/tweets/topics", {
        topics: [topicTitle],
      }).then((response) => {
        reloadTopics(response);
        setTopicValue(0);
      });
    } else {
      deleteBatch("/user/tweets", {
        tweets: JSON.parse(JSON.stringify(keys)),
      }).then((response) => {
        adjustSpaceInfo(keys.length);
        const lastPage = (totalTweets - keys.length) / tweetsPerPage;
        const newPage = lastPage > page ? page : lastPage;
        setCheckboxes({});
        handlePageChange(undefined, Math.ceil(newPage));
      });
    }
  };

  const handleTableCheckboxClick = (e, id) => {
    e.stopPropagation();
    let aux = { ...checkboxes };
    let value = aux[id];
    if (value) {
      delete aux[id];
    } else {
      aux[id] = true;
    }
    setCheckboxes(aux);
  };

  const getCheckbox = (tweet) => {
    return (
      <Tooltip title="Tildar para eliminar">
        <Checkbox
          id={"checkboxTweetId:" + tweet.id}
          value={tweet.id}
          onClick={(e) => handleTableCheckboxClick(e, tweet.id)}
          onFocus={(e) => e.stopPropagation()}
          checked={checkboxes[tweet.id] ? true : false}
        />
      </Tooltip>
    );
  };

  return tweets.length > 0 ? (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Hidden smDown>
          <Grid item xs={12} sm={12} md={12} lg={12} className="all_width">
            <Paper elevation={2}>
              <MDBTable hover className={className + " tweets_by_topic"}>
                <MDBTableHead color="primary-color" textWhite>
                  <tr>
                    <th className="tweets_table_user_img">
                      <Tooltip title="Foto de perfil">
                        <AccountCircleIcon />
                      </Tooltip>
                    </th>
                    <th className="tweets_table_username">Usuario</th>
                    <th
                      className={
                        deleteable
                          ? "tweets_table_text_30"
                          : "tweets_table_text_40"
                      }
                    >
                      Texto
                    </th>
                    <th className="tweets_table_rts">
                      <Tooltip title="Retweets">
                        <span>RTs</span>
                      </Tooltip>
                    </th>
                    <th className="tweets_table_favs">
                      <Tooltip title="Favoritos">
                        <span>Favs</span>
                      </Tooltip>
                    </th>
                    <th className="tweets_table_link">Enlace</th>
                    {deleteable ? (
                      <th className="tweets_table_delete">
                        <IconButton
                          id="delete-selected-tweets"
                          aria-label="Eliminar tweets"
                          onClick={handleTableDeleteClick}
                        >
                          <Tooltip title="Eliminar tweets">
                            <DeleteIcon />
                          </Tooltip>
                        </IconButton>
                      </th>
                    ) : null}
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {tweets.map((tweet) => (
                    <tr key={tweet.id}>
                      <td className="tweets_table_user_img">
                        <img
                          src={tweet.img_url}
                          alt="perfil de usuario"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = avatarImage;
                          }}
                        />
                      </td>
                      <td className="tweets_table_username">
                        {tweet.username}
                      </td>
                      <td
                        className={
                          deleteable
                            ? "tweets_table_text_30"
                            : "tweets_table_text_40"
                        }
                      >
                        {tweet.text}
                      </td>
                      <td className="tweets_table_rts">{tweet.retweets}</td>
                      <td className="tweets_table_favs">{tweet.favorites}</td>
                      <td className="tweets_table_link">
                        <a
                          href={tweet.permalink}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <ExitToAppIcon />
                        </a>
                      </td>
                      {deleteable ? (
                        <td className="tweets_table_delete">
                          {getCheckbox(tweet)}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </Paper>
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Paper elevation={2}>
            <MDBTable className={className + " fake_tweets_container"}>
              <MDBTableHead color="primary-color" textWhite>
                <tr>
                  <th className={deleteable ? "tweets_col" : ""}>
                    {topicTitle}
                  </th>
                  {deleteable ? (
                    <th className="delete_tweets">
                      {/* TO-DO estilo del hover */}
                      <IconButton
                        id="delete-selected-tweets"
                        aria-label="Eliminar tweets"
                        onClick={handleTableDeleteClick}
                      >
                        <Tooltip title="Eliminar tweets">
                          <DeleteIcon />
                        </Tooltip>
                      </IconButton>
                    </th>
                  ) : null}
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {tweets.map((tweet) => (
                  <tr key={tweet.id}>
                    <td className={deleteable ? "tweets_col" : ""}>
                      <Tweet
                        config={{
                          user: {
                            avatar:
                              tweet.img_url && tweet.img_url !== ""
                                ? tweet.img_url
                                : avatarImage,
                            nickname: tweet.username,
                          },
                          text: tweet.text,
                          date: tweet.date,
                          retweets: tweet.retweets,
                          likes: tweet.favorites,
                        }}
                      />
                    </td>
                    {deleteable ? (
                      <td className="delete_tweets">{getCheckbox(tweet)}</td>
                    ) : null}
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </Paper>
        </Hidden>
        {deleteable ? (
          <Button
            id="delete-selected-tweets-without-modal"
            onClick={handleTableDeleteWithoutModalClick}
            hidden={true}
          ></Button>
        ) : null}
      </Grid>
      <Grid item size="12" className="all_width">
        <Paginator
          page={page}
          count={count}
          itemsPerPage={tweetsPerPage}
          listItemsPerPage={listTweetsPerPage}
          handleItemsPerPageChange={handleTweetsPerPageChange}
          handlePageChange={handlePageChange}
        />
      </Grid>
    </Grid>
  ) : (
    <Box>
      <Skeleton variant="text" height="70px" />
      <Skeleton variant="rect" height={height} />
      <Skeleton variant="text" height="56px" />
    </Box>
  );
};
