import {
  Checkbox,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { languagesDictionary } from "utils/dictionaries/language";

export const SearchReports = ({
  languages,
  handleLanguageChange,
  handleSearchChange,
  ...props
}) => {
  return (
    <Grid container direction="row" alignItems="center" justify="flex-end">
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
        />
      </Grid>
      <Grid item xs={12} sm={4} md={3} xl={2} className="multiple_selector">
        <FormControl>
          <Select
            multiple
            displayEmpty
            input={<Input />}
            renderValue={(selected) =>
              selected.length > 0
                ? selected.map((value) => languagesDictionary[value]).join(", ")
                : "Idioma"
            }
            MenuProps={{
              /* hace que el dropdown no haga saltitos al seleccionar */
              getContentAnchorEl: null,
            }}
            value={languages}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <MenuItem disabled>
              <ListItemText primary="Idioma" />
            </MenuItem>
            <MenuItem value="all">
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
            </MenuItem>
            {Object.keys(languagesDictionary).map((key) => (
              <MenuItem
                key={key}
                value={key}
                classes={{ selected: "multiple_selector_selected" }}
              >
                <Checkbox checked={languages.includes(key)} />
                <ListItemText primary={languagesDictionary[key]} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
