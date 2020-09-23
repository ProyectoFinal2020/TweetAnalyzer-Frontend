import {
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  ListItemSecondaryAction,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Add, Delete, Edit, Search } from "@material-ui/icons";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
// import { DetailedReport } from "components/dataSelection/DetailedReport";
import { get } from "utils/api/api.js";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "utils/routes/routes";

export const ReportsList = () => {
  const [open, setOpen] = React.useState([]);
  // const [value, setValue] = useState(0);
  const [reports, setReports] = useState(undefined);
  const history = useHistory();
  // const { selectedData, setSelectedData } = useContext(AuthContext);
  // const { setSnackbarItem, setShowSnackbar } = useContext(CustomContext);

  useEffect(() => {
    get("/reports").then((response) => {
      setReports(response.data);
      const reportsOpen = response.data.map((_) => false);
      if (reportsOpen.length > 0) reportsOpen[0] = true;
      setOpen(reportsOpen);
    });
  }, []);

  const handleOpenNestedList = (index) => {
    const reportsOpen = [...open];
    reportsOpen[index] = !reportsOpen[index];
    setOpen(reportsOpen);
  };

  return reports ? (
    <Grid container direction="row" alignItems="center" justify="center">
      <Grid item xs={12} className="title">
        <Typography component="h1" variant="h1" align="center">
          Noticias
        </Typography>
      </Grid>
      <Grid item xs={12} sm={11}>
        <TextField
          type="search"
          variant="outlined"
          placeholder="Buscar"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="disabled" />
              </InputAdornment>
            ),
          }}
          style={{
            width: "100%",
            margin: "10px 0px",
            float: "left",
            paddingRight: 10,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={1}>
        <Tooltip title="Agregar nuevas noticias">
          <IconButton
            edge="end"
            aria-label="Agregar noticias"
            className="success"
            onClick={() => history.push(routes.createReports.path)}
          >
            <Add />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar las noticias seleccionadas">
          <IconButton
            edge="end"
            aria-label="Eliminar noticias"
            className="danger"
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={12} md={11} xl={10}>
        <List component="nav" aria-labelledby="nested-list-subheader">
          <ListItem>
            <ListItemIcon>
              <Tooltip title="Seleccionar todas">
                <Checkbox
                  id={"reportId:0"}
                  value={0}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={
                <Button>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    align="center"
                    color="textPrimary"
                    style={{ textTransform: "none" }}
                  >
                    Título
                  </Typography>
                  <ExpandMore />
                </Button>
              }
            />
            <ListItemSecondaryAction style={{ width: "20%" }}>
              <Typography
                variant="subtitle1"
                component="p"
                align="center"
                color="textPrimary"
              >
                Acciones
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          {reports.map((report, index) => (
            <Box key={index}>
              <Divider light />
              <ListItem button onClick={() => handleOpenNestedList(index)}>
                <ListItemIcon>
                  <Checkbox
                    id={"reportId:" + report.id}
                    value={report.id}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={report.title}
                  secondary={report.language}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <Delete />
                  </IconButton>
                  <IconButton>
                    {open[index] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse in={open[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {/* <DetailedReport
                    className="my_reports_content_box"
                    title={report.title}
                    content={report.content}
                  /> */}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Grid>
    </Grid>
  ) : null;
};
