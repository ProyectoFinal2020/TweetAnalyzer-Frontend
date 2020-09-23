import { Divider, Grid, Tooltip, Typography } from "@material-ui/core";
import { MDBFooter } from "mdbreact";
import React from "react";
import { footerLinks } from "./FooterLinks";

export const Footer = () => {
  return (
    <MDBFooter color="dark" className="custom_footer">
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs={12} md={6} lg={4} className="footer_description">
          <Typography variant="subtitle1" component="h5">
            Tweet Analyzer
          </Typography>
          <Typography variant="subtitle2" component="p">
            Trabajo realizado como parte del proyecto final de carrera de los
            autores
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            {footerLinks.map((footerLink) => (
              <Grid
                item
                xs="auto"
                className="footer_col"
                key={footerLink.title}
              >
                <Typography variant="subtitle1" component="h5" align="center">
                  {footerLink.title}
                </Typography>
                <Divider variant="middle" />
                {footerLink.values.map((value) => {
                  return value.tooltip ? (
                    <Tooltip title={value.tooltip} key={value.name}>
                      <Typography
                        variant="subtitle2"
                        component="p"
                        align="center"
                      >
                        <a href={value.link}>{value.name}</a>
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography
                      variant="subtitle2"
                      component="p"
                      align="center"
                      key={value.name}
                    >
                      <a href={value.link}>{value.name}</a>
                    </Typography>
                  );
                })}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} className="footer-copyright text-center py-3">
          &copy; {new Date().getFullYear()} Tweet Analyzer
        </Grid>
      </Grid>
    </MDBFooter>
  );
};
