import { Grid, InputAdornment, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { LanguageDropdown } from "components/shared/languageDropdown/LanguageDropdown";
import React from "react";

export const SearchReports = ({
  languages,
  handleLanguageChange,
  handleSearchChange,
  disabled = false,
  ...props
}) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justify="flex-end"
      spacing={1}
    >
      <Grid item xs={12} sm={8} md={9} xl={10} className="search_bar">
        <TextField
          type="search"
          variant="filled"
          placeholder="Buscar"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="disabled" />
              </InputAdornment>
            ),
          }}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={disabled}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4} md={3} xl={2} className="multiple_selector">
        <LanguageDropdown
          disabled={disabled}
          languages={languages}
          handleLanguageChange={handleLanguageChange}
        />
      </Grid>
    </Grid>
  );
};
