import React from "react";
import { Grid, TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Pagination from "@material-ui/lab/Pagination";
import config from "assets/custom/scss/config.scss";

export const Paginator = (props) => {
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
            onChange={props.handlePageChange}
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
              onChange={props.handleItemsPerPageChange}
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
