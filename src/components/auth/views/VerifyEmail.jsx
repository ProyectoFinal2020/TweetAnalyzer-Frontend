import React, { useContext } from "react";
import { NoContentComponent } from "../../shared/noContent/NoContent";
import { Box } from "@material-ui/core";
import { app } from "../../../utils/firebase/firebase";
import { useHistory } from "react-router-dom";
import { routes } from "../../../utils/routes/routes";
import { CustomContext } from "../../../contexts/CustomContext";

export const VerifyEmail = () => {
  const history = useHistory();
  const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);

  const handleMailSend = () => {
    app
      .auth()
      .currentUser.sendEmailVerification({
        url: process.env.CURRENT_APP + routes.emailWasVerified.path,
      })
      .then(() => {
        setSnackbarItem({
          severity: "success",
          message:
            "Se ha enviado el mail de verificación a tu casilla de correo.",
        });
        setShowSnackbar(true);
      })
      .catch((error) => {
        setSnackbarItem({
          severity: "error",
          message: error.message,
        });
        setShowSnackbar(true);
      });
  };

  return (
    <>
      <Box className="no_content_box">
        {NoContentComponent(
          "Aún no has verificado tu mail",
          "¡No te olvides de comprobar que no haya llegado a la sección de spam!",
          "#Error",
          [
            {
              handleClick: () => handleMailSend(),
              buttonText: "Volver a envíar email de verificación",
            },
            {
              handleClick: () => history.push(routes.home.path),
              buttonText: "Volver al inicio",
            },
          ]
        )}
      </Box>
    </>
  );
};
