import {
  Box,
  FormControl,
  Grid,
  Input,
  InputLabel,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Email from "@material-ui/icons/Email";
import Person from "@material-ui/icons/Person";
import { AuthContext } from "../../../contexts/AuthContext";
import { CustomContext } from "../../../contexts/CustomContext";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { post } from "../../../utils/api/api";
import { app, storage } from "../../../utils/firebase/firebase";
import { routes } from "../../../utils/routes/routes";
import Card from "../Card/Card.js";
import CardBody from "../Card/CardBody.js";
import CardFooter from "../Card/CardFooter.js";
import CardHeader from "../Card/CardHeader.js";
import CustomInput from "../CustomInput/CustomInput.js";
import "./Login.scss";

let errorDictionary = {
  "auth/email-already-in-use": "Ya existe un usuario asociado a este mail.",
};

const SignUpPage = () => {
  const history = useHistory();
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);
  const [email, setEmail] = useState("");
  const [emailErrors, setEmailErrors] = useState({
    required: false,
    badFormatted: false,
  });
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    required: false,
    minLength: false,
  });
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [repeatedPasswordErrors, setRepeatedPasswordErrors] = useState({
    required: false,
    notPasswordMatch: false,
  });
  const [name, setName] = useState("");
  const [nameErrors, setNameErrors] = useState({ required: false });
  const [imageAsFile, setImageAsFile] = useState("");

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const isImage = () => {
    let name = document.getElementById("foto_perfil").value;
    return name && name.match(/.(jpg|jpeg|png|gif)$/i);
  };

  const validateRepeatedPassword = (value) => {
    const required = value.length === 0;
    const notPasswordMatch = value !== password;
    setRepeatedPasswordErrors({
      required: required,
      notPasswordMatch: notPasswordMatch,
    });
    return required || notPasswordMatch;
  };

  const validatePassword = (value) => {
    const required = value.length === 0;
    const minLength = value.length < 6;
    setPasswordErrors({ required: required, minLength: minLength });

    if (value.length > 0 && repeatedPassword.length > 0) {
      setRepeatedPasswordErrors({
        required: repeatedPassword.required,
        notPasswordMatch: value !== repeatedPassword,
      });
    }
    return required || minLength;
  };

  const validateEmail = (value) => {
    const required = value.length === 0;
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const badFormatted = !re.test(value);
    setEmailErrors({ required: required, badFormatted: badFormatted });
    return required || badFormatted;
  };

  const validateName = (value) => {
    const required = value.length === 0;
    setNameErrors({ required: required });
    return required;
  };

  const signUp = (url = "") => {
    app
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then((idToken) => {
        post("/account/verifyIdToken/" + idToken, {
          name: name,
          photoUrl: url,
        }).then((response) => {
          document.getElementById("sign-up-progress-bar").hidden = true;
          if (response.data) {
            setIsAuthenticated(true);
            setCurrentUser(response.data);
            history.push(routes.home.path);
          } else {
            setSnackbarItem({
              severity: "error",
              message: "Se produjo un error al intentar validar el token",
            });
            setShowSnackbar(true);
          }
        });
      });
  };

  const loadPhotoUrl = () => {
    const uploadTask = storage.ref(`/images/${email}`).put(imageAsFile);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
      },
      (err) => {
        //catches the errors
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        return storage
          .ref("images")
          .child(email)
          .getDownloadURL()
          .then((url) => {
            signUp(url);
          });
      }
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const passHasErrors = validatePassword(password);
    const repeatedPassHasErrors = validateRepeatedPassword(repeatedPassword);
    const emailHasErrors = validateEmail(email);
    const nameHasErrors = validateName(name);

    const hasErrors =
      (imageAsFile && !isImage()) ||
      passHasErrors ||
      repeatedPassHasErrors ||
      emailHasErrors ||
      nameHasErrors;

    if (!hasErrors) {
      document.getElementById("sign-up-progress-bar").hidden = false;

      await app
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          if (imageAsFile !== "") {
            loadPhotoUrl();
          } else {
            signUp();
          }
          app.auth().currentUser.sendEmailVerification({
            url: process.env.CURRENT_APP + routes.emailWasVerified.path,
          });
        })
        .catch((error) => {
          setSnackbarItem({
            severity: "error",
            message: errorDictionary[error.code] ?? error.message,
          });
          setShowSnackbar(true);
          document.getElementById("sign-up-progress-bar").hidden = true;
        });
    }
  };

  return (
    <div className="login_container">
      <LinearProgress
        id="sign-up-progress-bar"
        color="primary"
        hidden={true}
        className="progress_bar"
      />
      <Grid container justify="center" className="login_card_container">
        <Grid item xs="auto">
          <Card>
            <CardHeader color="primary" className="card_header">
              <Typography variant="h4" component="h4">
                Registrarse
              </Typography>
            </CardHeader>
            <Typography
              variant="body2"
              component="p"
              align="center"
              color="textSecondary"
            >
              No compartiremos ningún dato personal
            </Typography>
            <form className="login_form">
              <CardBody>
                <CustomInput
                  labelText="Nombre"
                  name="name"
                  id="name"
                  onChange={(e) => {
                    validateName(e.target.value);
                    setName(e.target.value);
                  }}
                  inputProps={{
                    type: "text",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Person className="input_icons_color" />
                      </InputAdornment>
                    ),
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  errorMessage={
                    nameErrors.required ? "Este campo es requerido" : null
                  }
                />
                <CustomInput
                  labelText="Email"
                  id="email"
                  name="email"
                  onChange={(e) => {
                    validateEmail(e.target.value);
                    setEmail(e.target.value);
                  }}
                  inputProps={{
                    type: "email",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className="input_icons_color" />
                      </InputAdornment>
                    ),
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  errorMessage={
                    emailErrors.required
                      ? "Este campo es requerido"
                      : emailErrors.badFormatted
                      ? "El formato de mail no es correcto"
                      : null
                  }
                />
                <CustomInput
                  id="pass"
                  labelText="Contraseña"
                  onChange={(e) => {
                    validatePassword(e.target.value);
                    setPassword(e.target.value);
                  }}
                  inputProps={{
                    type: "password",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className="input_icons_color">lock_outline</Icon>
                      </InputAdornment>
                    ),
                    autoComplete: "off",
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  errorMessage={
                    passwordErrors.required
                      ? "Este campo es requerido"
                      : passwordErrors.minLength
                      ? "La contraseña debe tener al menos 6 caracteres"
                      : null
                  }
                />
                <CustomInput
                  labelText="Repetir Contraseña"
                  id="repeatedPassword"
                  onChange={(e) => {
                    validateRepeatedPassword(e.target.value);
                    setRepeatedPassword(e.target.value);
                  }}
                  inputProps={{
                    type: "password",
                    endAdornment: (
                      <InputAdornment position="end">
                        <CheckCircle className="input_icons_color" />
                      </InputAdornment>
                    ),
                    autoComplete: "off",
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  errorMessage={
                    repeatedPasswordErrors.required
                      ? "Este campo es requerido"
                      : repeatedPasswordErrors.notPasswordMatch
                      ? "Las contraseñas no coinciden"
                      : null
                  }
                />
                <FormControl
                  className="form_control_file"
                  aria-invalid={imageAsFile && !isImage()}
                  margin="normal"
                  fullWidth
                >
                  <InputLabel
                    htmlFor="foto_perfil"
                    shrink
                    className="file_input_label"
                  >
                    Foto de perfil
                  </InputLabel>
                  <Input
                    id="foto_perfil"
                    type="file"
                    name="Foto de perfil"
                    onChange={handleImageAsFile}
                  />
                  {imageAsFile && !isImage() ? (
                    <Typography
                      component="p"
                      variant="caption"
                      color="error"
                      align="right"
                    >
                      El archivo no es de una extensión permitida (jpg, png,
                      jpeg, gif)
                    </Typography>
                  ) : null}
                </FormControl>
              </CardBody>
              <CardFooter className="card_footer">
                <Button
                  type="submit"
                  color="primary"
                  size="large"
                  onClick={handleSignUp}
                >
                  Registrarse
                </Button>
              </CardFooter>
            </form>
            <Box className="login_other">
              <Box>
                ¿Ya tienes una cuenta?&nbsp;
                <Link to={routes.login.path}>Iniciá sesión</Link>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignUpPage;
