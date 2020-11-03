import {
  RadioGroup,
  Grid,
  FormControlLabel,
  Radio,
  FormLabel,
  Box,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import "./LanguageButtons.scss";

export const LanguageButtons = ({
  language,
  setLanguage,
  title = "",
  topicsWithLanguage = [],
  ...rest
}) => {
  useEffect(() => {
    if (topicsWithLanguage[title]) {
      setLanguage(topicsWithLanguage[title]);
    }
  }, [title, topicsWithLanguage, setLanguage]);

  return (
    <Box className="language_buttons">
      <FormLabel component="legend">
        <Typography variant="caption" component="p">
          Idioma
        </Typography>
      </FormLabel>
      <RadioGroup
        aria-label="Idioma"
        name="Idioma"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={6} sm={4} md={6} lg={5}>
            <FormControlLabel
              value="en"
              control={<Radio />}
              label={<Typography variant="body1">Inglés</Typography>}
              disabled={
                topicsWithLanguage[title] && topicsWithLanguage[title] !== "en"
              }
            />
          </Grid>
          <Grid item xs={6} sm={5} md={6} lg={5}>
            <FormControlLabel
              value="es"
              control={<Radio />}
              label={<Typography variant="body1">Español</Typography>}
              disabled={
                topicsWithLanguage[title] && topicsWithLanguage[title] !== "es"
              }
            />
          </Grid>
        </Grid>
      </RadioGroup>
    </Box>
  );
};
