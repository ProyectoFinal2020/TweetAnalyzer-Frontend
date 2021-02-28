import { Box, Chip, Typography } from "@material-ui/core";
import config from "../../assets/custom/scss/config.module.scss";
import { EmptyMessageResult } from "../shared/emptyMessageResult/EmptyMessageResult";
import { CustomContext } from "../../contexts/CustomContext";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { languagesDictionary } from "../../utils/dictionaries/language";
import { ReportCard } from "./ReportCard";
import { SearchReports } from "./SearchReports";
import "./MyReportsCard.scss";

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
    <>
      <SearchReports
        languages={languages}
        handleLanguageChange={handleLanguageChange}
        handleSearchChange={handleSearchChange}
      />
      {selectedReport && selectedReport.title ? (
        <Box>
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
        <EmptyMessageResult
          title="Lo sentimos, no encontramos noticias con esas características."
          subtitle="¡Intentá nuevamente con otro filtro!"
          style={{ margin: "20px 10px" }}
        />
      )}
    </>
  );
};
