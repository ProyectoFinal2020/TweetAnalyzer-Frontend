/*eslint-disable*/
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/custom/jss/material-kit/headerLinksStyle.js";
import navbarsStyle from "assets/custom/jss/material-kit/navbarsStyle";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { app } from "../../../utils/firebase/firebase";
import { logout } from "../../../utils/localStorageManagement/authentication";
import { routes } from "../../../utils/routes/routes";
import { get } from "utils/api/api";
import CustomDropdown from "./CustomDropdown/CustomDropdown";
import anonymousUser from "assets/custom/img/anonymousUser.png";
import {
  CloudUpload,
  EmojiEmotions,
  ListAlt,
  Storage,
} from "@material-ui/icons";
import { Grid, Hidden } from "@material-ui/core";

const useStyles = makeStyles(styles);
const useNavbarStyles = makeStyles(navbarsStyle);

export const HeaderLinks = (props) => {
  const classes = useStyles();
  const navbarClasses = useNavbarStyles();
  const history = useHistory();
  const {
    currentUser,
    isAuthenticated,
    setIsAuthenticated,
    setSelectedData,
  } = useContext(AuthContext);

  const customLogout = () => {
    setSelectedData(undefined);
    logout();
    setIsAuthenticated(false);
    app.auth().signOut();
    history.push(routes.login.path);
  };

  const handleLogout = (e) => {
    if (currentUser) {
      e.preventDefault();
      get("/account/logout").then(() => {
        customLogout();
      });
    } else {
      customLogout();
    }
  };

  return (
    <List className={classes.list}>
      {isAuthenticated ? (
        <>
          {!(currentUser && currentUser.emailVerified) ? (
            <ListItem className={classes.noPaddingListItem}>
              <Button
                onClick={() => history.push(routes.verifyEmail.path)}
                color="inherit"
                hidden={useLocation().pathname === "/verifyEmail"}
              >
                Verificar email
              </Button>
            </ListItem>
          ) : (
            <>
              <ListItem className={classes.listItem}>
                <CustomDropdown
                  left
                  caret={false}
                  hoverColor="black"
                  buttonText={
                    <>
                      <CloudUpload className={classes.icons} />
                      <Hidden mdDown>Carga de Datos</Hidden>
                    </>
                  }
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
                <Button
                  href={routes.dataSelection.path}
                  color="inherit"
                  className={classes.navLink}
                >
                  <Storage className={classes.icons} />
                  <Hidden mdDown>Selección de Datos</Hidden>
                </Button>
              </ListItem>
              <ListItem className={classes.listItem}>
                <Button
                  href={routes.similarityAlgorithms.path}
                  color="inherit"
                  className={classes.navLink}
                >
                  <ListAlt className={classes.icons} />
                  <Hidden mdDown>Algoritmos de similitud</Hidden>
                </Button>
              </ListItem>
              <ListItem className={classes.listItem}>
                <CustomDropdown
                  left
                  caret={false}
                  hoverColor="black"
                  buttonText={
                    <>
                      <EmojiEmotions className={classes.icons} />
                      <Hidden mdDown>Análisis de Tweets</Hidden>
                    </>
                  }
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
                      onClick: () =>
                        history.push(routes.sentimentAnalyzer.path),
                    },
                    {
                      name: "Emociones",
                      onClick: () => history.push(routes.emotionAnalyzer.path),
                    },
                  ]}
                />
              </ListItem>
            </>
          )}
          <ListItem className={navbarClasses.listItem + " navbar-dropdown"}>
            <CustomDropdown
              left
              caret={false}
              hoverColor="black"
              dropdownHeader={currentUser ? currentUser.name : null}
              buttonText={
                <img
                  src={
                    currentUser
                      ? currentUser.photoUrl !== ""
                        ? currentUser.photoUrl
                        : anonymousUser
                      : null
                  }
                  className={navbarClasses.img}
                  alt="profile"
                />
              }
              buttonProps={{
                className: navbarClasses.imageDropdownButton,
              }}
              dropdownList={
                currentUser && currentUser.emailVerified
                  ? [
                      {
                        name: "Mis Tweets",
                        onClick: () => history.push(routes.tweets.path),
                      },
                      {
                        name: "Mis Noticias",
                        onClick: () => history.push(routes.reports.path),
                      },
                      {
                        name: "Cerrar sesión",
                        onClick: handleLogout,
                      },
                    ]
                  : [
                      {
                        name: "Cerrar sesión",
                        onClick: handleLogout,
                      },
                    ]
              }
            />
          </ListItem>
        </>
      ) : (
        <ListItem className={classes.listItem}>
          <Button
            onClick={() => history.push(routes.login.path)}
            color="inherit"
            hidden={useLocation().pathname === "/login"}
          >
            Iniciar sesión
          </Button>
        </ListItem>
      )}
    </List>
  );
};
