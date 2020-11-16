import { TablePagination } from "@material-ui/core";
import React from "react";
import "./TablePaginator.scss";

export const TablePaginator = ({
  total,
  listItemsPerPage,
  page,
  setPage,
  itemsPerPage,
  setItemsPerPage,
  getItems,
  ...props
}) => {
  const handlePageChange = (e, value) => {
    getItems(value + 1, itemsPerPage);
    setPage(value + 1);
  };

  const handleItemsPerPageChange = (e) => {
    getItems(1, e.target.value);
    setPage(1);
    setItemsPerPage(e.target.value);
  };

  return (
    <TablePagination
      component="div"
      count={total}
      page={page - 1}
      onChangePage={handlePageChange}
      rowsPerPage={itemsPerPage}
      rowsPerPageOptions={listItemsPerPage}
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
