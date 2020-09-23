import { Box, Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/icons/Menu";
import tweetLogo from "assets/custom/img/tweetLogo.svg";
import styles from "assets/custom/jss/material-kit/headerStyle.js";
import classNames from "classnames";
import { Sidebar } from "components/shared/sidebar/Sidebar";
import { AuthContext } from "contexts/AuthContext";
import PropTypes from "prop-types";
import React, { useContext } from "react";

const useStyles = makeStyles(styles);
export const Header = (props) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { color, rightLinks, brand, href } = props;
  const appBarClasses = classNames({
    [classes[color]]: color,
  });

  return (
    <AppBar position="fixed" className={appBarClasses}>
      <Toolbar className={classes.container}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item className={classes.flex}>
            <Button className="navbar_logo" href={href}>
              <img alt="logo" src={tweetLogo} height={25} />
              <Typography component="p" variant="body1">
                {brand}
              </Typography>
            </Button>
          </Grid>
          <Hidden smDown>
            <Grid item>{rightLinks}</Grid>
          </Hidden>
          {isAuthenticated ? (
            <Hidden mdUp>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
              >
                <Menu />
              </IconButton>
              <Drawer
                variant="temporary"
                anchor={"right"}
                open={mobileOpen}
                classes={{
                  paper: classes.drawerPaper,
                }}
                onClose={handleDrawerToggle}
              >
                <Box className="mobile_sidebar">
                  <Sidebar handleClick={() => setMobileOpen(false)} />
                </Box>
              </Drawer>
            </Hidden>
          ) : null}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
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
