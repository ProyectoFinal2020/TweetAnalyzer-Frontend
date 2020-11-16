import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useContext, useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { SimilarityAlgorithmsNames } from "./SimilarityAlgorithmsNames";
import "./SelectSimilarityAlgorithmsForm.scss";
import { AuthContext } from "contexts/AuthContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  const [error, setError] = useState("");
  const [wasExecuted, setWasExecuted] = useState(false);

  useEffect(() => {
    if (!wasExecuted && selectedData && selectedData.algorithms) {
      initializeData(selectedData.algorithms);
    }
    // eslint-disable-next-line
  }, [selectedData, wasExecuted]);

  const handleChange = (event) => {
    setSimilarityAlgorithms(event.target.value);
  };

  const getAlgorithms = () => {
    let algorithms = [];
    similarityAlgorithms.forEach((name) => {
      algorithms.push(SimilarityAlgorithmsNames[name].name);
    });
    return algorithms;
  };

  const submit = () => {
    setWasExecuted(true);
    let algorithms = getAlgorithms();
    if (algorithms && algorithms.length > 0) {
      setError("");
      handleSubmit(algorithms);
    } else {
      setError("Debes seleccionar al menos un algoritmo");
    }
  };

  return (
    <ValidatorForm onSubmit={submit} className="select-form">
      <FormControl fullWidth>
        <InputLabel id="similarity-algorithms-label">
          Algoritmos de similitud
        </InputLabel>
        <Select
          labelId="similarity-algorithms-label"
          multiple
          value={similarityAlgorithms}
          onChange={handleChange}
          input={<Input />}
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
          MenuProps={MenuProps}
        >
          {Object.keys(SimilarityAlgorithmsNames).map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={similarityAlgorithms.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
        {error !== "" ? (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        ) : null}
        <FormHelperText>Seleccione los algoritmos a analizar</FormHelperText>
      </FormControl>
      <Box classes={{ root: "submit" }}>
        <Button type="submit" variant="contained" color="primary">
          Ejecutar
        </Button>
      </Box>
    </ValidatorForm>
  );
};
