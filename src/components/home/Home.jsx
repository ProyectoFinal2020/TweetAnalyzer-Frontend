import { Button, Grid, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { HomeCards } from "./HomeCards";
import { routes } from "../../utils/routes/routes";
import { AuthContext } from "../../contexts/AuthContext";
import "./Home.scss";

export const Home = () => {
  const history = useHistory();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Grid
      container
      justify="center"
      direction="row"
      alignItems="center"
      className="home_container"
    >
      <Grid item xs={12} className="title_box">
        <Typography
          component="h2"
          variant="h2"
          align="center"
          color="textPrimary"
        >
          ¡Bienvenido!
        </Typography>
        <Typography
          component="h5"
          variant="h5"
          align="center"
          color="textSecondary"
        >
          Tweet Analyzer es una plataforma que te permite buscar tweets
          oficiales, analizar su correlación con una noticia en particular y
          realizar un análisis de emociones sobre los tweets.
        </Typography>
        {!isAuthenticated ? (
          <Grid item xs={12} className="home_begin_btn">
            <Grid container justify="center" alignItems="center">
              <Grid item xs="auto">
                <Button
                  onClick={() => history.push(routes.login.path)}
                  variant="contained"
                  color="default"
                >
                  Iniciar sesión
                </Button>
              </Grid>
              <Grid item xs="auto">
                <Button
                  onClick={() => history.push(routes.signUp.path)}
                  variant="contained"
                  color="default"
                >
                  Registrarse
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12} className="home_begin_btn">
            <Button
              onClick={() => history.push(routes.tweetFetcher.path)}
              variant="contained"
              color="default"
            >
              Comenzar
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} className="home_cards_container">
        <HomeCards />
      </Grid>
    </Grid>
  );
};
