import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Typography,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import { Dropdown } from "components/shared/dropdown/Dropdown";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import "./SelectSimilarityAlgorithmsForm.scss";
import { SimilarityAlgorithmsNames } from "./SimilarityAlgorithmsNames";

export const SelectSimilarityAlgorithmsForm = ({
  handleSubmit,
  initializeData,
  ...rest
}) => {
  const { selectedData } = useContext(AuthContext);
  const [similarityAlgorithms, setSimilarityAlgorithms] = useState([
    "Word2Vec",
    "Doc2Vec",
  ]);
  const [error, setError] = useState(undefined);
  const [wasExecuted, setWasExecuted] = useState(false);

  useEffect(() => {
    if (!wasExecuted && selectedData && selectedData.algorithms) {
      initializeData(selectedData.algorithms);
    }
    // eslint-disable-next-line
  }, [selectedData, wasExecuted]);

  const handleChange = (event) => {
    setSimilarityAlgorithms(event.target.value);
    validateSelectedAlgorithms(event.target.value);
  };

  const validateSelectedAlgorithms = (selectedAlgorithms) => {
    if (selectedAlgorithms && selectedAlgorithms.length > 0) {
      setError(undefined);
    } else {
      setError("Debes seleccionar al menos un algoritmo");
    }
  };

  const getAlgorithms = () => {
    let algorithms = [];
    similarityAlgorithms.forEach((name) => {
      algorithms.push(SimilarityAlgorithmsNames[name].name);
    });
    return algorithms;
  };

  const submit = () => {
    if (!error) {
      setWasExecuted(true);
      let selectedAlgorithms = getAlgorithms();
      handleSubmit(selectedAlgorithms);
    }
  };

  return (
    <ValidatorForm onSubmit={submit} className="select-form">
      <FormControl fullWidth aria-invalid={error ? true : false}>
        <Dropdown
          label="Algoritmos de similitud"
          multiple={true}
          value={similarityAlgorithms}
          onChange={handleChange}
          error={error}
          renderValue={(selected) => (
            <Box className="chips">
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  variant="default"
                  classes={{ root: "sim-chip" }}
                />
              ))}
            </Box>
          )}
          menuItems={Object.keys(SimilarityAlgorithmsNames).map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={similarityAlgorithms.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        />
        <Typography color="error" variant="caption" style={{ minHeight: 20 }}>
          {error}
        </Typography>
      </FormControl>
      <Box classes={{ root: "submit" }}>
        <Button type="submit" variant="contained" color="primary">
          Ejecutar
        </Button>
      </Box>
    </ValidatorForm>
  );
};
