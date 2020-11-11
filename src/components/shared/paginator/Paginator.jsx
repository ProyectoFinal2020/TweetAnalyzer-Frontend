import { Grid, TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Pagination from "@material-ui/lab/Pagination";
import config from "assets/custom/scss/config.scss";
import React from "react";
import "./Paginator.scss";

export const Paginator = (props) => {
  const handlePageChange = (e, value) => {
    props.getItems(value, props.itemsPerPage);
    props.setPage(value);
  };

  const handleItemsPerPageChange = (e) => {
    props.getItems(1, e.target.value);
    props.setPage(1);
    props.setItemsPerPage(e.target.value);
  };

  return (
    <>
      <Grid container direction="row" className="paginator_container">
        <Grid item xs={12} sm={9} md={7} lg={6} className="pagination_numbers">
          <Pagination
            count={props.count}
            page={props.page}
            color="secondary"
            siblingCount={window.innerWidth > config["xs"] ? 1 : 0}
            size="medium"
            onChange={handlePageChange}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={5} lg={6}>
          <FormControl variant="filled" className="paginator_form_control">
            <TextField
              id="items-per-page"
              select
              variant="outlined"
              label="Items por página"
              value={props.itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              {props.listItemsPerPage.map((itemsPerPage, key) => (
                <MenuItem value={itemsPerPage} key={key}>
                  {itemsPerPage}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};
