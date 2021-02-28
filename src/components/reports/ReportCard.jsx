import {
  Checkbox,
  Chip,
  Grid,
  Tooltip,
  CardHeader,
  CardActionArea,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../../contexts/AuthContext";
import { deleteBatch } from "../../utils/api/api";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "../../utils/routes/routes";
import { showMsgConfirmation, updateSelectedData } from "./deleteReports";
import { CustomContext } from "../../contexts/CustomContext";
import Highlighter from "react-highlight-words";
import { languagesDictionary } from "../../utils/dictionaries/language";
import { ReportDialog } from "./ReportDialog";
import "./MyReportsCard.scss";

export const ReportCard = ({
  report,
  deleteCurrentReport,
  setCheckedReports,
  searchWords,
  showActionButtons,
  selectedReport,
  setSelected,
  className,
  ...props
}) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const { selectedData, setSelectedData } = useContext(AuthContext);
  const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);

  const handleDelete = (e) => {
    e.preventDefault();
    showMsgConfirmation().then((willDelete) => {
      if (willDelete) {
        deleteBatch("/reports", {
          reports: JSON.parse(JSON.stringify([report.id])),
        })
          .then(() => {
            updateSelectedData([report.id], selectedData, setSelectedData);
            deleteCurrentReport(report.id);
            setSnackbarItem({
              severity: "success",
              message: "La noticia se eliminó con éxito",
            });
            setShowSnackbar(true);
          })
          .catch((_) => {
            setSnackbarItem({
              severity: "error",
              message: "Hubo un error al intentar eliminar la noticia",
            });
            setShowSnackbar(true);
          });
      }
    });
  };

  const getCardHeaderAndCardContent = () => {
    return (
      <>
        <CardHeader
          title={
            <Grid container alignItems="center" justify="center">
              <Grid item xs={12}>
                <Chip
                  color="default"
                  variant="outlined"
                  label={
                    <Typography variant="caption" component="span">
                      {languagesDictionary[report.language]}
                    </Typography>
                  }
                />
                {report.checked !== undefined ? (
                  <Tooltip title="Seleccionar">
                    <Checkbox
                      checked={report.checked}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCheckedReports(report.id);
                      }}
                      onFocus={(e) => e.stopPropagation()}
                    />
                  </Tooltip>
                ) : null}
              </Grid>
              <Grid item style={{ marginTop: 10 }}>
                <Typography variant="h5" component="h2">
                  <Highlighter
                    highlightClassName="highlighted_text"
                    searchWords={[searchWords]}
                    textToHighlight={report.title}
                  />
                </Typography>
              </Grid>
            </Grid>
          }
        />
        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            align="justify"
          >
            <Highlighter
              highlightClassName="highlighted_text"
              searchWords={[searchWords]}
              textToHighlight={report.content}
            />
          </Typography>
        </CardContent>
      </>
    );
  };

  return (
    <Card
      className={
        "report_card " + className + (selectedReport ? " focus_highlight" : "")
      }
      variant="outlined"
    >
      {setSelected ? (
        <CardActionArea onClick={() => setSelected(report)}>
          {getCardHeaderAndCardContent()}
        </CardActionArea>
      ) : (
        getCardHeaderAndCardContent()
      )}
      <CardActions>
        <Grid container direction="row" alignItems="center" justify="flex-end">
          <Button
            size="small"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Detalle
          </Button>
          {showModal ? (
            <ReportDialog report={report} onClose={() => setShowModal(false)} />
          ) : null}
          {showActionButtons ? (
            <>
              <Button
                size="small"
                color="primary"
                onClick={() =>
                  history.push({
                    pathname: routes.editReport.path.replace(":id", report.id),
                  })
                }
              >
                Editar
              </Button>
              <Button size="small" color="primary" onClick={handleDelete}>
                Eliminar
              </Button>
            </>
          ) : null}
        </Grid>
      </CardActions>
    </Card>
  );
};
