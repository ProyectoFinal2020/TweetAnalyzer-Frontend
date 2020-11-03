/*eslint-disable*/
import { Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {
  CloudUpload,
  EmojiEmotions,
  ListAlt,
  Storage,
  Home,
} from "@material-ui/icons";
import styles from "assets/custom/jss/material-kit/headerLinksStyle.js";
import navbarsStyle from "assets/custom/jss/material-kit/navbarsStyle";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "../../../utils/routes/routes";
import CustomDropdown from "./CustomDropdown/CustomDropdown";

const useStyles = makeStyles(styles);
const useNavbarStyles = makeStyles(navbarsStyle);

export const CenteredHeaderLinks = (props) => {
  const classes = useStyles();
  const navbarClasses = useNavbarStyles();
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  return currentUser && currentUser.emailVerified ? (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Tooltip title="Home">
          <Button
            href={routes.home.path}
            color="inherit"
            className={classes.navLink}
          >
            <Home className={classes.icons} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          left
          caret={false}
          hoverColor="black"
          tooltip="Carga de datos"
          buttonText={<CloudUpload className={classes.icons} />}
          buttonProps={{
            className: navbarClasses.navLink,
            color: "primary",
          }}
          dropdownList={[
            {
              name: "Tweets",
              onClick: () => history.push(routes.tweetFetcher.path),
            },
            {
              name: "Noticias",
              onClick: () => history.push(routes.createReports.path),
            },
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip title="Selección de datos">
          <Button
            href={routes.dataSelection.path}
            color="inherit"
            className={classes.navLink}
          >
            <Storage className={classes.icons} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip title="Algoritmos de similitud">
          <Button
            href={routes.similarityAlgorithms.path}
            color="inherit"
            className={classes.navLink}
          >
            <ListAlt className={classes.icons} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          left
          caret={false}
          hoverColor="black"
          tooltip="Análisis de Tweets"
          buttonText={<EmojiEmotions className={classes.icons} />}
          buttonProps={{
            className: navbarClasses.navLink,
            color: "primary",
          }}
          dropdownList={[
            {
              name: "Frecuencias",
              onClick: () => history.push(routes.bubbleChart.path),
            },
            {
              name: "Sentimientos",
              onClick: () => history.push(routes.sentimentAnalyzer.path),
            },
            {
              name: "Emociones",
              onClick: () => history.push(routes.emotionAnalyzer.path),
            },
          ]}
        />
      </ListItem>
    </List>
  ) : null;
};
