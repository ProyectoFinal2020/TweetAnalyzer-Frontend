import { TablePagination } from "@material-ui/core";
import React from "react";
import "./TablePaginator.scss";

export const TablePaginator = (props) => {
  const handlePageChange = (e, value) => {
    props.getItems(value + 1, props.itemsPerPage);
    props.setPage(value + 1);
  };

  const handleItemsPerPageChange = (e) => {
    props.getItems(1, e.target.value);
    props.setPage(1);
    props.setItemsPerPage(e.target.value);
  };

  return (
    <TablePagination
      component="div"
      count={props.total}
      page={props.page - 1}
      onChangePage={handlePageChange}
      rowsPerPage={props.itemsPerPage}
      rowsPerPageOptions={props.listItemsPerPage}
      onChangeRowsPerPage={handleItemsPerPageChange}
      labelRowsPerPage="Items por página"
      labelDisplayedRows={({ from, to, count }) =>
        from + "-" + to + " de " + count
      }
      backIconButtonText="Página anterior"
      nextIconButtonText="Página siguiente"
    />
  );
};
