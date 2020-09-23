import {
  container,
  title,
} from "../material-kit-react.js";
import headerLinksStyle from "./headerLinksStyle.js";

const navbarsStyle = (theme) => ({
  section: {
    padding: "70px 0",
    paddingTop: "0",
  },
  container,
  title: {
    ...title,
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
  },
  navbar: {
    marginBottom: "-20px",
    zIndex: "100",
    position: "relative",
    overflow: "hidden",
    "& header": {
      borderRadius: "0",
    },
  },
  navigation: {
    backgroundPosition: "center center",
    backgroundSize: "cover",
    marginTop: "0",
    minHeight: "740px",
  },
  formControl: {
    margin: "0 !important",
    paddingTop: "0",
  },
  inputRootCustomClasses: {
    margin: "0!important",
  },
  searchIcon: {
    width: "20px",
    height: "20px",
    color: "inherit",
  },
  ...headerLinksStyle(theme),
  img: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
  },
  imageDropdownButton: {
    minWidth: "50px",
    minHeight: "50px",
    borderRadius: "50%",
  },
});

export default navbarsStyle;
