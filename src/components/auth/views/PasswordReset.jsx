import { Box, Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import { CustomContext } from "contexts/CustomContext";
import React, { useContext, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Link, useHistory } from "react-router-dom";
import { app } from "utils/firebase/firebase";
import { routes } from "utils/routes/routes";
import Card from "../Card/Card.js";
import CardBody from "../Card/CardBody.js";
import CardFooter from "../Card/CardFooter.js";
import CardHeader from "../Card/CardHeader.js";
import CustomTextValidator from "../CustomInput/CustomTextValidator.js";

let errorDictionary = {
  "auth/user-not-found": "No existe un usuario asociado a este mail.",
  "auth/invalid-email": "El formato del mail es incorrecto",
};

export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);
  const history = useHistory();

  const handlePasswordReset = () => {
    app
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        localStorage.setItem("passwordReset", true);
        history.push(routes.login.path);
      })
      .catch((error) => {
        setSnackbarItem({
          severity: "error",
          message: errorDictionary[error.code],
        });
        setShowSnackbar(true);
      });
  };
  return (
    <div className="login_container">
      <Grid container justify="center" className="login_card_container">
        <Grid item xs="auto">
          <Card>
            <ValidatorForm
              onSubmit={handlePasswordReset}
              className="login_form"
            >
              <CardHeader color="primary" className="card_header">
                <Typography variant="h4" component="h4">
                  Restablecer contraseña
                </Typography>
              </CardHeader>
              <CardBody>
                <CustomTextValidator
                  fullWidth={true}
                  label="Email"
                  id="email"
                  name="email"
                  value={email}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    "Este campo es requerido",
                    "El formato de mail no es correcto",
                  ]}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  InputProps={{
                    type: "email",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className="input_icons_color" />
                      </InputAdornment>
                    ),
                  }}
                />
              </CardBody>
              <CardFooter className="card_footer">
                <Button type="submit" color="primary" size="large">
                  Restablecer contraseña
                </Button>
              </CardFooter>
            </ValidatorForm>
            <Box className="login_other">
              <Box>
                <Link to={routes.login.path}>Volver a inicio de sesión</Link>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
