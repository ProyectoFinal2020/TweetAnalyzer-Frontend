import { Button, Divider, Grid, Tooltip, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { Delete } from "@material-ui/icons";
import { AuthContext } from "contexts/AuthContext";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { deleteBatch, get } from "utils/api/api";
import { CustomContext } from "contexts/CustomContext";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { languagesDictionary } from "utils/dictionaries/language";
import { routes } from "utils/routes/routes";
import { showMsgConfirmation, updateSelectedData } from "./deleteReports";
import { ReportCard } from "./ReportCard";
import { SearchReports } from "./SearchReports";

export const ReportsCard = () => {
  const [allReports, setAllReports] = useState(undefined);
  const [reports, setReports] = useState(undefined);
  const [searchWords, setSearchWords] = useState(undefined);
  const [language, setLanguage] = useState(Object.keys(languagesDictionary));
  const history = useHistory();
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);

  useEffect(() => {
    get("/reports").then((response) => {
      const allReports = response.data.map((report) => {
        return {
          id: report.id,
          title: report.title,
          language: report.language,
          content: report.content,
          checked: false,
        };
      });
      setReports(allReports);
      setAllReports(allReports);
    });
  }, []);

  const handleDelete = (e) => {
    e.preventDefault();
    const reportsToDelete = reports
      .filter((report) => report.checked === true)
      .map((report) => report.id);

    if (reportsToDelete.length > 0) {
      showMsgConfirmation().then((willDelete) => {
        if (willDelete) {
          deleteBatch("/reports", {
            reports: JSON.parse(JSON.stringify(reportsToDelete)),
          })
            .then(() => {
              updateSelectedData(
                reportsToDelete,
                selectedData,
                setSelectedData
              );
              setSnackbarItem({
                severity: "success",
                message: "Las noticias se eliminaron con éxito",
              });
              setShowSnackbar(true);
              setReports(
                reports.filter((report) => !reportsToDelete.includes(report.id))
              );
              setAllReports(
                allReports.filter(
                  (report) => !reportsToDelete.includes(report.id)
                )
              );
            })
            .catch((_) => {
              setSnackbarItem({
                severity: "error",
                message: "Hubo un error al intentar eliminar las noticias",
              });
              setShowSnackbar(true);
            });
        }
      });
    }
  };

  const handleSingleDelete = (id) => {
    setAllReports(allReports.filter((reports) => reports.id !== id));
    setReports(reports.filter((reports) => reports.id !== id));
  };

  const handleReportsCheck = (id) => {
    const reportUpdatedIndex = reports.findIndex((report) => report.id === id);
    const currentReports = [...reports];
    currentReports[reportUpdatedIndex].checked = !currentReports[
      reportUpdatedIndex
    ].checked;
    setReports(currentReports);
  };

  const filterReports = (searchWords, languages) => {
    if (searchWords) {
      setReports(
        allReports.filter(
          (report) =>
            (report.title.toLowerCase().includes(searchWords.toLowerCase()) ||
              report.content
                .toLowerCase()
                .includes(searchWords.toLowerCase())) &&
            languages.includes(report.language)
        )
      );
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
    setLanguage(languages);
    filterReports(searchWords, languages);
  };

  const handleSearchChange = (searchWords) => {
    setSearchWords(searchWords);
    filterReports(searchWords, language);
  };

  const handleAdd = () => {
    history.push(routes.createReports.path);
  };

  const handleChangeCheckedAll = (checked) => {
    let currentReports = [...reports];
    currentReports = currentReports.map((report) => {
      const checkedReport = { ...report };
      checkedReport.checked = checked;
      allReports.find(
        (reportAux) => reportAux.id === report.id
      ).checked = checked;
      return checkedReport;
    });
    setReports(currentReports);
  };

  return allReports && allReports.length > 0 ? (
    <Grid container direction="row" alignItems="center" justify="center">
      <Grid item className="my_reports_title">
        <Typography component="h1" variant="h1">
          Noticias
        </Typography>
      </Grid>
      <Grid item>
        <Button
          edge="end"
          aria-label="Agregar noticias"
          className="success my_reports_add_button"
          onClick={handleAdd}
        >
          Agregar noticias
        </Button>
      </Grid>
      <SearchReports
        languages={language}
        handleLanguageChange={handleLanguageChange}
        handleSearchChange={handleSearchChange}
      />
      <Grid item xs={12} className="my_reports_divider">
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <Grid item className="my_reports_select_all">
            {reports.length > 0 && reports.every((report) => report.checked) ? (
              <Button
                aria-label="Deseleccionar todas"
                onClick={() => handleChangeCheckedAll(false)}
              >
                <Typography variant="caption" component="span">
                  Deseleccionar todas
                </Typography>
              </Button>
            ) : (
              <Button
                aria-label="Seleccionar todas"
                onClick={() => handleChangeCheckedAll(true)}
                disabled={reports.length === 0}
              >
                <Typography variant="caption" component="span">
                  Seleccionar todas
                </Typography>
              </Button>
            )}
          </Grid>
          <Grid item>
            <Tooltip title="Eliminar noticias seleccionadas">
              <Button
                aria-label="Eliminar noticias"
                className="danger my_reports_delete_button"
                onClick={handleDelete}
                disabled={reports.length === 0}
              >
                <Delete />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {reports.length > 0 ? (
          <Grid container direction="row">
            {reports.map((report, index) => (
              <Grid item xs={12} sm={6} xl={4} key={index}>
                <ReportCard
                  report={report}
                  deleteCurrentReport={handleSingleDelete}
                  setCheckedReports={handleReportsCheck}
                  searchWords={searchWords}
                  showActionButtons={true}
                />
              </Grid>
            ))}
          </Grid>
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
      </Grid>
    </Grid>
  ) : allReports && allReports.length === 0 ? (
    <Box className="no_content_box">
      {NoContentComponent(
        "No tenés noticias",
        "¡Agregá nuevas noticias para comenzar!",
        "#NoDocuments",
        [
          {
            handleClick: handleAdd,
            buttonText: "Agregar noticias",
          },
        ]
      )}
    </Box>
  ) : null;
};
