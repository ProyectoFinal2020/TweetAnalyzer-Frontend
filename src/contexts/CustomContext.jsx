import {
  Box,
  Fab,
  Hidden,
  LinearProgress,
  Snackbar,
  Tooltip,
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import MuiAlert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { initializeInterceptors } from "../utils/api/axios-interceptors";

export const CustomContext = React.createContext();

export const CustomProvider = ({ children }) => {
  const [snackbarItem, setSnackbarItem] = useState({
    severity: null,
    message: null,
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const newDimensions = { ...windowDimensions };
      newDimensions.height = window.innerHeight;
      newDimensions.width = window.innerWidth;
      setWindowDimensions(newDimensions);
    };

    const scrollFunction = () => {
      if (document.getElementById("toTop")) {
        if (document.scrollingElement.scrollTop > windowDimensions.height * 3) {
          document.getElementById("toTop").style.display = "block";
        } else {
          document.getElementById("toTop").style.display = "none";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", scrollFunction);
    return () => {
      window.removeEventListener("scroll", scrollFunction);
      window.removeEventListener("resize", handleResize);
    };
  }, [windowDimensions]);

  const goToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.scrollingElement.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  const setLoading = (isLoading) => {
    if (isLoading) {
      document.getElementById("loading-progress-bar").hidden = false;
    } else {
      document.getElementById("loading-progress-bar").hidden = true;
    }
  };

  initializeInterceptors(setLoading, setSnackbarItem, setShowSnackbar);

  const renderSnackbar = () => {
    return (
      <>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={snackbarItem.severity}
          >
            {snackbarItem.severity === "error" ? <b>Error: </b> : null}
            {snackbarItem.message}
          </MuiAlert>
        </Snackbar>
      </>
    );
  };

  return (
    <CustomContext.Provider
      value={{
        setSnackbarItem,
        setShowSnackbar,
        windowDimensions,
      }}
    >
      <LinearProgress
        id="loading-progress-bar"
        color="primary"
        hidden={true}
        className="progress_bar"
      />
      {renderSnackbar()}
      {children}
      <Hidden mdUp>
        <Tooltip title="Ir arriba">
          <Box>
            <Fab
              id="toTop"
              onClick={goToTop}
              className="back_to_top_button"
              aria-label="Ir arriba"
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Box>
        </Tooltip>
      </Hidden>
    </CustomContext.Provider>
  );
};
