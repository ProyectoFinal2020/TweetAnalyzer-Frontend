import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { Delete } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import { EmptyMessageResult } from "../shared/emptyMessageResult/EmptyMessageResult";
import { NoContentComponent } from "../shared/noContent/NoContent";
import { AuthContext } from "../../contexts/AuthContext";
import { CustomContext } from "../../contexts/CustomContext";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { deleteBatch, get } from "../../utils/api/api";
import { languagesDictionary } from "../../utils/dictionaries/language";
import { routes } from "../../utils/routes/routes";
import { showMsgConfirmation, updateSelectedData } from "./deleteReports";
import "./MyReportsCard.scss";
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

  const handleLanguageChange = (language) => {
    setLanguage(language);
    filterReports(searchWords, language);
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

  return (
    <>
      <Typography component="h1" variant="h1" align="center" className="title">
        Mis noticias
      </Typography>
      {allReports && allReports.length > 0 ? (
        <Card style={{ padding: 15, marginBottom: 20 }}>
          <CardHeader
            action={
              <Tooltip title="Agregar noticias">
                <Button
                  aria-label="Agregar noticias"
                  className="success squared-icon-btn"
                  variant="contained"
                  onClick={handleAdd}
                >
                  <AddIcon />
                </Button>
              </Tooltip>
            }
            style={{ padding: "16px 24px" }}
          />
          <CardContent
            className="pdg-top-0"
            classes={{ root: "my-reports-card-content" }}
          >
            <SearchReports
              languages={language}
              handleLanguageChange={handleLanguageChange}
              handleSearchChange={handleSearchChange}
            />
            <Divider light className="mgn-top-10 mgn-btm-20" />
            <>
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <Grid item className="my_reports_select_all">
                  {reports.length > 0 &&
                  reports.every((report) => report.checked) ? (
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
                    <span>
                      <IconButton
                        aria-label="Eliminar noticias"
                        onClick={handleDelete}
                        disabled={
                          reports.length === 0 ||
                          !reports.find((r) => r.checked)
                        }
                        style={{ margin: "0 10px" }}
                      >
                        <Delete />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>

              {reports.length > 0 ? (
                <Grid container direction="row">
                  {reports.map((report, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
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
                <EmptyMessageResult
                  title="Lo sentimos, no encontramos noticias con esas características."
                  subtitle="¡Intentá nuevamente con otro filtro!"
                  style={{ margin: "20px 10px" }}
                />
              )}
            </>
          </CardContent>
        </Card>
      ) : allReports && allReports.length === 0 ? (
        <Paper className="no-content-paper">
          <Box className="no_content_box">
            {NoContentComponent(
              "No tenés noticias",
              "¡Agregá nuevas noticias para comenzar!",
              "#NoDocuments",
              [
                {
                  handleClick: () => history.push(routes.createReports.path),
                  buttonText: "Agregar noticias",
                },
              ]
            )}
          </Box>
        </Paper>
      ) : null}
    </>
  );
};
