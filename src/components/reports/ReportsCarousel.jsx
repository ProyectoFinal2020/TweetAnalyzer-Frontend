import { Box, Button, Chip, Grid, Hidden, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import config from "assets/custom/scss/config.scss";
import { CustomContext } from "contexts/CustomContext";
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";
import { languagesDictionary } from "utils/dictionaries/language";
import { routes } from "utils/routes/routes";
import { ReportCard } from "./ReportCard";
import { SearchReports } from "./SearchReports";

export const ReportsCarousel = ({
  setSelectedReport,
  selectedReport,
  selectedTweetsTopic,
  errors,
  ...props
}) => {
  const [settings, setSettings] = useState({
    dots: true,
    infinite: true,
    speed: 500,
  });
  const [allReports] = useState(props.reports);
  const [reports, setReports] = useState(props.reports);
  const [languages, setLanguages] = useState(Object.keys(languagesDictionary));
  const [searchWords, setSearchWords] = useState(undefined);
  const { windowDimensions } = useContext(CustomContext);
  const history = useHistory();

  useEffect(() => {
    const getSlidesToShow = () => {
      return windowDimensions.width < parseInt(config["sm"])
        ? 1
        : windowDimensions.width < parseInt(config["lg"]) && reports.length >= 2
        ? 2
        : reports.length < 3
        ? reports.length
        : 3;
    };
    if (reports.length === 0) return;
    const newSettings = { dots: true, infinite: true, speed: 500 };
    newSettings.slidesToShow = getSlidesToShow();
    newSettings.slidesToScroll = getSlidesToShow();
    setSettings(newSettings);
  }, [reports, windowDimensions.width]);

  const filterReports = (searchWords, languages) => {
    if (searchWords) {
      const filteredReports = allReports.filter(
        (report) =>
          (report.title.toLowerCase().includes(searchWords.toLowerCase()) ||
            report.content.toLowerCase().includes(searchWords.toLowerCase())) &&
          languages.includes(report.language)
      );
      setReports(filteredReports);
    } else {
      setReports(
        allReports.filter((report) => languages.includes(report.language))
      );
    }
  };

  const handleLanguageChange = (languages) => {
    if (languages.includes("all")) {
      if (
        Object.keys(languagesDictionary).every((language) =>
          languages.find((lang) => lang === language)
        )
      ) {
        languages = [];
      } else {
        languages = Object.keys(languagesDictionary);
      }
    }
    setLanguages(languages);
    filterReports(searchWords, languages);
  };

  const handleSearchChange = (searchWords) => {
    setSearchWords(searchWords);
    filterReports(searchWords, languages);
  };

  const setSelected = (selected) => {
    setSelectedReport(selected);
  };

  return (
    <Box>
      <Grid container alignItems="center" justify="center">
        <Grid item className="reports_carousel_title">
          <Typography component="h5" variant="h5" color="textPrimary">
            Seleccionar noticia
          </Typography>
        </Grid>
        <Grid item className="reports_carousel_add_btn">
          <Button
            edge="end"
            aria-label="Agregar noticias"
            className="success"
            onClick={() => history.push(routes.createReports.path)}
          >
            <Hidden smUp>
              <Add />
            </Hidden>
            <Hidden xsDown>Agregar noticias</Hidden>
          </Button>
        </Grid>
      </Grid>
      <SearchReports
        languages={languages}
        handleLanguageChange={handleLanguageChange}
        handleSearchChange={handleSearchChange}
      />
      {selectedReport && selectedReport.title ? (
        <Box className="reports_carousel_info_box">
          <Box className="reports_carousel_selected_title">
            <Typography
              variant="subtitle2"
              component="span"
              color="textPrimary"
            >
              Seleccionada:
            </Typography>
            <Chip color="secondary" label={selectedReport.title} />
          </Box>
          {errors.language ? (
            <Typography
              component="p"
              variant="caption"
              color="error"
              align="right"
            >
              El idioma del tema debe ser el mismo que el idioma de la noticia
            </Typography>
          ) : null}
        </Box>
      ) : null}
      {reports.length > 0 ? (
        <Slider {...settings}>
          {reports.map((report) => (
            <ReportCard
              className="reports_carousel_report_card"
              key={report.id}
              report={report}
              showActionButtons={false}
              selectedReport={selectedReport.id === report.id}
              setSelected={setSelected}
            />
          ))}
        </Slider>
      ) : (
        <Box className="my_reports_no_content">
          <Typography component="p" variant="subtitle2" color="textPrimary">
            Lo sentimos, no encontramos noticias con esas características.
          </Typography>
          <Typography component="p" variant="subtitle1" color="textPrimary">
            ¡Intentá nuevamente con otro filtro!
          </Typography>
        </Box>
      )}
    </Box>
  );
};
