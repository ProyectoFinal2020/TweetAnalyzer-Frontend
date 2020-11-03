import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import { getPageSections } from "./PageSections";
import { routes } from "utils/routes/routes";
import { useHistory } from "react-router-dom";

export const HomeCards = () => {
  const pageSections = getPageSections(routes);
  const history = useHistory();

  return pageSections ? (
    <Grid container justify="center" alignItems="stretch">
      {pageSections.map((section) => {
        return section.subsections.map((subsection) => (
          <Grid item xs={12} sm={6} lg={4} xl="auto" key={subsection.name}>
            <Card variant="outlined">
              <CardContent align="center">
                <Typography
                  align="center"
                  className="section"
                  component="span"
                  style={{ color: section.color }}
                >
                  {section.name}
                </Typography>
                <Typography variant="h4" component="h2" align="center">
                  {subsection.name}
                </Typography>
                <Typography variant="body2" component="p" align="center">
                  {subsection.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: section.color,
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => history.push(subsection.link)}
                >
                  Ver más
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ));
      })}
    </Grid>
  ) : null;
};
