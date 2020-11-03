import { Box, Card, Grid, Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/icons/Menu";
import tweetLogo from "assets/custom/img/tweetLogo.svg";
import styles from "assets/custom/jss/material-kit/headerStyle.js";
import config from "assets/custom/scss/config.scss";
import classNames from "classnames";
import { Sidebar } from "components/shared/sidebar/Sidebar";
import { AuthContext } from "contexts/AuthContext";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import useWindowDimensions from "../dimensions/WindowDimension";
import "./Header.scss";

const useStyles = makeStyles(styles);
export const Header = (props) => {
  const classes = useStyles();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { width } = useWindowDimensions();

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const { color, centeredLinks, rightLinks, brand, href } = props;
  const appBarClasses = classNames({
    [classes[color]]: color,
  });

  const getLogoClassName = () => {
    return width < parseInt(config["md"]) ? classes.flex : "";
  };

  const getSidebarDrawer = (anchor) => {
    return (
      <>
        <IconButton
          edge="end"
          color="inherit"
          style={{ padding: "0px 10px", margin: "0px 10px" }}
          onClick={handleDrawerToggle}
        >
          <Menu />
        </IconButton>
        <Drawer
          variant="temporary"
          anchor={anchor}
          open={sidebarOpen}
          classes={{
            root: "transparent",
            paper: "drawer-paper",
          }}
          onClose={handleDrawerToggle}
        >
          <Card className="sidebar" square={true}>
            <CardHeader
              title="Tweet analyzer"
              classes={{
                title: "sidebar-title",
                root: "sidebar-header",
              }}
            />
            <CardContent>
              <Sidebar handleClick={() => setSidebarOpen(false)} />
            </CardContent>
          </Card>
        </Drawer>
      </>
    );
  };

  return (
    <AppBar position="fixed" className={appBarClasses}>
      <Toolbar className={classes.container}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Hidden smDown>
            <Grid item hidden={useLocation().pathname === "/home"}>
              {getSidebarDrawer("left")}
            </Grid>
          </Hidden>
          <Grid item className={getLogoClassName()}>
            <Button href={href}>
              <img alt="logo" src={tweetLogo} height={25} />
              <Typography
                hidden={useLocation().pathname !== "/home"}
                className="logo-label"
              >
                {brand}
              </Typography>
            </Button>
          </Grid>
          <Hidden smDown>
            <Grid item className={classes.flex}>
              <Box style={{ width: "fit-content", margin: "auto" }}>
                {centeredLinks}
              </Box>
            </Grid>
            <Grid item>{rightLinks}</Grid>
          </Hidden>
          {isAuthenticated ? (
            <Hidden mdUp>{getSidebarDrawer("right")}</Hidden>
          ) : null}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  centeredLinks: PropTypes.node,
  rightLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark",
  ]),
};
