import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { Dropdown } from "../../shared/dropdown/Dropdown";
import React from "react";
import { languagesDictionary } from "../../../utils/dictionaries/language";
import "./LanguageDropdown.scss";

export const LanguageDropdown = ({
  languages,
  handleLanguageChange,
  disabled = false,
  ...props
}) => {
  const handleChange = (languages) => {
    if (languages.includes("all")) {
      if (
        Object.keys(languagesDictionary).every((language) =>
          languages.find((lang) => lang === language)
        )
      ) {
        languages = [];
      } else {
        languages = Object.keys(languagesDictionary);
      }
    }
    handleLanguageChange(languages);
  };

  return (
    <FormControl fullWidth>
      <Dropdown
        multiple={true}
        displayEmpty={true}
        renderValue={(selected) =>
          selected.length > 0 ? (
            <Typography>
              {selected.map((value) => languagesDictionary[value]).join(", ")}
            </Typography>
          ) : (
            <Typography color="textSecondary">Idioma</Typography>
          )
        }
        value={languages}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        defaultValue="Idioma"
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
                  {languages.length === Object.keys(languagesDictionary).length
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
  );
};
