import config from "../scss/config.scss";

const theme = {
  typography: {
    "@media (max-width:425px)": {
      htmlFontSize: 10,
    },
  },
  palette: {
    primary: {
      main: config.primaryColor,
    },
    secondary: {
      main: config.roseColor,
    },
    error: {
      main: config.dangerColor,
    },
    warning: {
      main: config.warningColor,
    },
    info: {
      main: config.infoColor,
    },
    success: {
      main: config.successColor,
    },
  },
  spacing: parseInt(config.spacing),
  overrides: {
    MuiChip: {
      root: {
        backgroundColor: "transparent",
        margin: 2,
        color: config.darkGrayColor,
        fontWeight: 400,
      },
    },
    MuiMenu: {
      paper: {
        maxHeight: "250px",
      },
    },
  },
};

export { theme };
