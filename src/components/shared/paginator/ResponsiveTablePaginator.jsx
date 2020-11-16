import { Hidden } from "@material-ui/core";
import React from "react";
import { Paginator } from "./Paginator";
import { TablePaginator } from "./TablePaginator";
import "./TablePaginator.scss";

export const ResponsiveTablePaginator = ({
  count,
  total,
  listItemsPerPage,
  page,
  setPage,
  itemsPerPage,
  setItemsPerPage,
  getItems,
  ...props
}) => {
  return (
    <>
      <Hidden xsDown>
        <TablePaginator
          total={total}
          listItemsPerPage={listItemsPerPage}
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          getItems={getItems}
        />
      </Hidden>
      <Hidden smUp>
        <Paginator
          count={count}
          listItemsPerPage={listItemsPerPage}
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          getItems={getItems}
        />
      </Hidden>
    </>
  );
};
