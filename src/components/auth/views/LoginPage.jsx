import { Grid, Typography, Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import { AuthContext } from "../../../contexts/AuthContext";
import { CustomContext } from "../../../contexts/CustomContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { get } from "../../../utils/api/api";
import { app } from "../../../utils/firebase/firebase";
import { routes } from "../../../utils/routes/routes";
import Card from "../Card/Card.js";
import CardBody from "../Card/CardBody.js";
import CardFooter from "../Card/CardFooter.js";
import CardHeader from "../Card/CardHeader.js";
import CustomInput from "../CustomInput/CustomInput.js";
import "./Login.scss";

const LoginPage = () => {
  const history = useHistory();
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);

  useEffect(() => {
    if (localStorage.getItem("passwordReset")) {
      setSnackbarItem({
        severity: "success",
        message: "La contraseña ha sido restablecida con éxito",
      });
      setShowSnackbar(true);
      localStorage.removeItem("passwordReset");
    }
  }, [setShowSnackbar, setSnackbarItem]);

  const handleFirebaseLogin = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await app.auth().signInWithEmailAndPassword(email, password);
        app
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            get("/account/verifyIdToken/" + idToken).then((response) => {
              if (response.data && response.data.Id !== null) {
                setIsAuthenticated(true);
                setCurrentUser(response.data);
              } else {
                setSnackbarItem({
                  severity: "error",
                  message: "Hubo un error en el servidor.",
                });
                setShowSnackbar(true);
              }
            });
          })
          .catch((error) => {
            setSnackbarItem({
              severity: "error",
              message: "El usuario y/o la contraseña son incorrectos.",
            });
            setShowSnackbar(true);
          });
        history.push(routes.home.path);
      } catch (error) {
        setSnackbarItem({
          severity: "error",
          message: "El usuario y/o la contraseña son incorrectos.",
        });
        setShowSnackbar(true);
      }
    },
    [
      history,
      setCurrentUser,
      setIsAuthenticated,
      email,
      password,
      setSnackbarItem,
      setShowSnackbar,
    ]
  );

  const handleProviderLogin = (e, provider) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    searchParams.set("url", window.location.href);
    window.location.href =
      process.env.REACT_APP_ENDPOINT +
      "/account/login/" +
      provider +
      "?" +
      searchParams.toString();
  };

  return (
    <div className="login_container">
      <Grid container justify="center" className="login_card_container">
        <Grid item xs="auto">
          <Card>
            <CardHeader color="primary" className="card_header">
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h4" component="h4" align="center">
                    Iniciar sesión
                  </Typography>
                </Grid>
                <Grid item xs={12} className="social_line">
                  <Button
                    color="inherit"
                    onClick={(e) => handleProviderLogin(e, "twitter")}
                  >
                    <i className={"fab fa-twitter"} />
                  </Button>
                  <Button
                    color="inherit"
                    onClick={(e) => handleProviderLogin(e, "github")}
                  >
                    <i className={"fab fa-github"} />
                  </Button>
                  <Button
                    color="inherit"
                    onClick={(e) => handleProviderLogin(e, "facebook")}
                  >
                    <i className={"fab fa-facebook"} />
                  </Button>
                  <Button
                    color="inherit"
                    onClick={(e) => handleProviderLogin(e, "google")}
                  >
                    <i className={"fab fa-google"} />
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>
            <Typography
              variant="body2"
              component="p"
              align="center"
              color="textSecondary"
            >
              O sé más clásico...
            </Typography>
            <form className="login_form">
              <CardBody>
                <CustomInput
                  labelText="Email"
                  id="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                  inputProps={{
                    type: "email",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className="input_icons_color" />
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomInput
                  labelText="Contraseña"
                  id="pass"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                  inputProps={{
                    type: "password",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className="input_icons_color">lock_outline</Icon>
                      </InputAdornment>
                    ),
                    autoComplete: "off",
                  }}
                />
              </CardBody>
              <CardFooter className="card_footer">
                <Button
                  onClick={handleFirebaseLogin}
                  color="primary"
                  size="large"
                  disabled={email === "" || password === ""}
                >
                  Iniciar Sesión
                </Button>
              </CardFooter>
            </form>
            <Box className="login_other">
              <Box>
                <Link to={routes.passwordReset.path}>
                  ¿Olvidaste tu contraseña?
                </Link>
                &nbsp;&bull;&nbsp;
              </Box>
              <Box>
                ¿No tienes una cuenta?&nbsp;
                <Link to={routes.signUp.path}>Regístrate</Link>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
