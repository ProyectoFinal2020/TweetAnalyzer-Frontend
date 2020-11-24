import {
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Dropdown } from "components/shared/dropdown/Dropdown";
import React from "react";
import { languagesDictionary } from "utils/dictionaries/language";

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
        <FormControl fullWidth>
          <Dropdown
            multiple={true}
            displayEmpty={true}
            renderValue={(selected) =>
              selected.length > 0
                ? selected.map((value) => languagesDictionary[value]).join(", ")
                : "Idioma"
            }
            value={languages}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={disabled}
            menuItems={[
              <MenuItem disabled key={0}>
                <ListItemText primary="Idioma" />
              </MenuItem>,
              <MenuItem value="all" key={1}>
                <ListItemText
                  primary={
                    <Typography
                      align="center"
                      color="textPrimary"
                      style={{ fontWeight: 500 }}
                    >
                      {languages.length ===
                      Object.keys(languagesDictionary).length
                        ? "Deseleccionar todos"
                        : "Seleccionar todos"}
                    </Typography>
                  }
                />
              </MenuItem>,
            ].concat(
              Object.keys(languagesDictionary).map((key) => (
                <MenuItem
                  key={key}
                  value={key}
                  classes={{ selected: "multiple_selector_selected" }}
                >
                  <Checkbox checked={languages.includes(key)} />
                  <ListItemText primary={languagesDictionary[key]} />
                </MenuItem>
              ))
            )}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};
