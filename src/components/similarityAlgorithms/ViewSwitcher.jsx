import { Button, ButtonGroup, Grid, Tooltip } from "@material-ui/core";
import React from "react";

export const ViewSwitcher = ({ view, setView, ...rest }) => {
  return (
    <>
      <Grid item className="emotion_group_btn">
        <ButtonGroup
          disableElevation
          variant="outlined"
          color="primary"
          size="small"
        >
          <Tooltip title="Visualizar los tweets con chips que muestran los resultados de los algoritmos">
            <Button
              className={view === "chips" ? "button_selected" : ""}
              onClick={() => setView("chips")}
            >
              Chips
            </Button>
          </Tooltip>
          <Tooltip title="Visualizar los tweets y resultados en forma de tabla, donde se puede ordenar por columna de forma ascendente o descendente">
            <Button
              className={view === "table" ? "button_selected" : ""}
              onClick={() => setView("table")}
            >
              Tabla
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Grid>
    </>
  );
};
