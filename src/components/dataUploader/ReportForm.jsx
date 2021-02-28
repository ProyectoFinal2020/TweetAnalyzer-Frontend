import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { NoContentComponent } from "../shared/noContent/NoContent";
import { CustomContext } from "../../contexts/CustomContext";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { get, post, put } from "../../utils/api/api";
import { routes } from "../../utils/routes/routes";
import { LanguageButtons } from "./LanguageButtons";
import "./ReportForm.scss";

export const ReportForm = (props) => {
  const [allReports, setAllReports] = useState(undefined);
  const [userTitles, setUserTitles] = useState(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReports, setEditingReports] = useState(undefined);
  const [errors, setErrors] = useState([
    {
      content: { required: false },
      title: {
        required: false,
        maxLength: false,
        isDuplicate: false,
      },
    },
  ]);
  const history = useHistory();
  const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);

  useEffect(() => {
    var reportId = parseInt(props.match.params.id);
    setIsEditing(reportId > 0 ? true : false);

    get("/reports").then((response) => {
      if (reportId) {
        const newEditingReport = response.data.find(
          (report) => report.id === reportId
        );
        setEditingReports(newEditingReport ? [newEditingReport] : undefined);
      } else {
        setEditingReports([{ title: "", content: "", language: "en" }]);
      }
      setAllReports(response.data);
    });
  }, [props.match.params.id]);

  useEffect(() => {
    let userTitles = allReports
      ? allReports.map((report) => report.title.toLowerCase())
      : undefined;
    setUserTitles(userTitles);
  }, [allReports]);

  const handleSaveClick = (e) => {
    e.preventDefault();
    let errorsAux = editingReports.map((report, index) => {
      return {
        title: validateTitle(report.title, index),
        content: validateContent(report.content, index),
      };
    });
    setErrors(errorsAux);

    let hasErrors = errorsAux.some(
      (error) =>
        error.title.required ||
        error.title.maxLength ||
        error.title.isDuplicate ||
        error.content.required
    );

    if (!hasErrors) {
      if (isEditing) {
        updateReport();
      } else {
        createReports();
      }
    }
  };

  const updateReport = () => {
    let editedReport = {
      id: editingReports[0].id,
      title: editingReports[0].title.trim(),
      content: editingReports[0].content.trim(),
      language: editingReports[0].language,
    };
    put("/reports", editedReport).then(
      (response) => {
        setSnackbarItem({
          severity: "success",
          message: "La noticia fue actualizada con éxito.",
        });
        setShowSnackbar(true);
        setTimeout(() => {
          props.history.goBack();
        }, 500);
      },
      (error) => {
        setSnackbarItem({
          severity: "error",
          message: "La noticia no pudo ser actualizada.",
        });
        setShowSnackbar(true);
      }
    );
  };

  const createReports = () => {
    let editedReports = editingReports.map((editedReport) => {
      editedReport.content.trim();
      editedReport.title.trim();
      return editedReport;
    });
    post("/reports", editedReports).then((response) => {
      if (response.data.length > 0) {
        let errors = "";
        response.data.forEach((error) => (errors += error + " "));
        setSnackbarItem({ severity: "error", message: errors });
        setShowSnackbar(true);
      } else {
        history.push(routes.dataSelection.path);
      }
    });
  };

  const handleAddNewReport = () => {
    let editingReportsAux = [...editingReports];
    editingReportsAux.push({
      title: "",
      content: "",
      language: "en",
    });
    let errorsAux = [...errors];
    errorsAux.push({
      content: { required: false },
      title: {
        required: false,
        maxLength: false,
        isDuplicate: false,
      },
    });
    setEditingReports(editingReportsAux);
    setErrors(errorsAux);
  };

  const handleDeleteReport = async (index) => {
    let editingReportsAux = [...editingReports];
    let errorsAux = [...errors];
    editingReportsAux.splice(index, 1);
    errorsAux.splice(index, 1);
    setEditingReports(editingReportsAux);
    setErrors(errorsAux);
  };

  const validateContent = (content, index) => {
    const required = content === null || content.trim().length === 0;
    setErrorsByVariable("content", { required: required }, index);
    return { required: required };
  };

  const resetContentValidator = (index) => {
    setErrorsByVariable("content", { required: false }, index);
  };

  const validateTitle = (title, index) => {
    const required = title === null || title.trim().length === 0;
    const maxLength = title && title.trim().length > 30;
    const duplicateTitle = userTitles
      .filter((report) => report.id !== editingReports[index].id)
      .includes(title.toLowerCase());

    const titleErrors = {
      required: required,
      maxLength: maxLength,
      isDuplicate: duplicateTitle,
    };
    setErrorsByVariable("title", titleErrors, index);
    return titleErrors;
  };

  const resetTitleValidator = (index) => {
    setErrorsByVariable(
      "title",
      { required: false, maxLength: false, isDuplicate: false },
      index
    );
  };

  const setErrorsByVariable = (variable, value, index) => {
    let errorsAux = [...errors];
    let error = { ...errors[index] };
    error[variable] = value;
    errorsAux[index] = error;
    setErrors(errorsAux);
  };

  const handleEditReportTitleChange = (value, index) => {
    handleEditReportChange("title", value, index);
  };

  const handleEditReportContentChange = (value, index) => {
    handleEditReportChange("content", value, index);
  };

  const handleEditReportLanguageChange = (value, index) => {
    handleEditReportChange("language", value, index);
  };

  const handleEditReportChange = (variable, value, index) => {
    let editingReportsAux = [...editingReports];
    let report = { ...editingReports[index] };
    report[variable] = value;
    editingReportsAux[index] = report;
    setEditingReports(editingReportsAux);
  };

  return (
    <>
      {editingReports && allReports ? (
        <>
          <Typography
            component="h1"
            variant="h1"
            align="center"
            className="title"
          >
            {isEditing ? "Editar noticia" : "Crear noticias"}
          </Typography>

          <form autoComplete="off" onSubmit={handleSaveClick}>
            <Card className="card-row" classes={{ root: "reports-card" }}>
              {editingReports.map((editingReport, index) => (
                <span key={index}>
                  <Card className="card-row report_panel">
                    <CardHeader
                      action={
                        editingReports.length > 1 ? (
                          <Tooltip title="Eliminar">
                            <span>
                              <IconButton
                                aria-label="eliminar"
                                onClick={() => handleDeleteReport(index)}
                                className="danger-outlined"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : null
                      }
                      classes={{ action: "action-btn" }}
                      className="pdg-btm-0"
                    />
                    <CardContent style={{ paddingBottom: 5 }}>
                      <Grid container className="report_box_form" spacing={2}>
                        <Grid
                          item
                          xs={12}
                          md={8}
                          lg={9}
                          style={{ paddingRight: 10 }}
                        >
                          <TextField
                            fullWidth
                            value={editingReport.title}
                            onChange={(e) => {
                              resetTitleValidator(index);
                              validateTitle(e.target.value, index);
                              handleEditReportTitleChange(
                                e.target.value,
                                index
                              );
                            }}
                            label="Titulo"
                            type="text"
                            variant="outlined"
                            aria-invalid={
                              errors[index].title.required ||
                              errors[index].title.maxLength ||
                              errors[index].title.isDuplicate
                            }
                          />
                          {errors[index].title.required ||
                          errors[index].title.maxLength ||
                          errors[index].title.isDuplicate ? (
                            <Typography color="error" variant="caption">
                              {errors[index].title.required
                                ? "El título de la noticia es requerido"
                                : errors[index].title.maxLength
                                ? "El título no puede superar los 30 caracteres"
                                : "Ya existe una noticia con ese título"}
                            </Typography>
                          ) : null}
                        </Grid>
                        <Grid item xs={9} md={4} lg={3}>
                          <LanguageButtons
                            language={editingReport.language}
                            setLanguage={(value) =>
                              handleEditReportLanguageChange(value, index)
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            className="edit_content"
                            aria-invalid={errors[index].content.required}
                          >
                            <label className="edit_label">Contenido</label>
                            <TextareaAutosize
                              value={editingReport.content}
                              onChange={(e) => {
                                resetContentValidator(index);
                                validateContent(e.target.value, index);
                                handleEditReportContentChange(
                                  e.target.value,
                                  index
                                );
                              }}
                              label="Contenido"
                              type="text"
                              variant="outlined"
                            />
                          </Box>
                          {errors[index].content.required ? (
                            <Typography
                              className="error"
                              color="error"
                              variant="caption"
                            >
                              El contenido de la noticia es requerido
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  {index !== editingReports.length - 1 ? (
                    <Divider variant="middle" />
                  ) : null}
                </span>
              ))}
              <CardActions
                style={{ float: "right", paddingRight: 16, paddingLeft: 16 }}
              >
                {!isEditing ? (
                  <Button
                    onClick={handleAddNewReport}
                    className="success"
                    aria-label={"Nueva noticia"}
                    variant="contained"
                  >
                    Nueva noticia
                  </Button>
                ) : null}
                <Button
                  onClick={handleSaveClick}
                  type="submit"
                  className="secondary"
                  aria-label={isEditing ? "Guardar cambios" : "Crear noticias"}
                  variant="contained"
                >
                  {isEditing ? "Guardar noticia" : "Crear noticias"}
                </Button>
              </CardActions>
            </Card>
          </form>
        </>
      ) : allReports ? (
        <Box className="no_content_box">
          {NoContentComponent(
            "Lo sentimos",
            "No encontramos una noticia con estas características",
            "#Error",
            [
              {
                handleClick: () => props.history.goBack(),
                buttonText: "Volver",
              },
            ]
          )}
        </Box>
      ) : null}
    </>
  );
};
