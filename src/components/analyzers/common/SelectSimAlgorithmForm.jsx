import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
} from "@material-ui/core";
import { Dropdown } from "../../shared/dropdown/Dropdown";
import { SimilarityAlgorithmsKeys } from "../..//similarityAlgorithms/SimilarityAlgorithmsNames";
import { AuthContext } from "../../../contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import "./TweetsSelectionForms.scss";

export const SelectSimAlgorithmForm = ({
  disableDownload,
  handleSubmit,
  downloadUrl,
  downloadFilename,
  ...rest
}) => {
  const { selectedData } = useContext(AuthContext);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    selectedData ? selectedData.algorithms[0] : undefined
  );
  const [threshold, setThreshold] = useState("0");

  const parseThreshold = () => {
    let aux = threshold;
    if (aux.includes(",")) {
      aux = aux.replace(",", ".");
    }
    return parseFloat(aux);
  };

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(
      selectedData.report.id,
      selectedData.topic.title,
      selectedAlgorithm,
      parseThreshold()
    );
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("minNumberEquals0", (value) => {
      return value === "" || parseFloat(value) >= 0;
    });

    ValidatorForm.addValidationRule("maxNumberEquals1", (value) => {
      return value === "" || parseFloat(value) <= 1;
    });

    ValidatorForm.addValidationRule("notValidCharacter", (value) => {
      if (value !== "") {
        var regexp1 = /^\d+\.\d*$/;
        var regexp2 = /^\d+,\d*$/;
        return (
          value === "1" ||
          value === "0" ||
          value.match(regexp1) ||
          value.match(regexp2)
        );
      }
      return true;
    });

    return () => {
      ValidatorForm.removeValidationRule("minNumberEquals0");
      ValidatorForm.removeValidationRule("maxNumberEquals1");
      ValidatorForm.removeValidationRule("notValidCharacter");
    };
  }, []);

  return (
    <ValidatorForm onSubmit={submit} className="select-form">
      <Grid container justify="center">
        <Grid item xs={9} sm={10} lg={11} style={{ paddingRight: "8px" }}>
          <FormControl fullWidth margin="normal">
            <Dropdown
              label="Seleccione un algoritmo"
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              menuItems={selectedData.algorithms.map((algorithm, key) => (
                <MenuItem key={key} value={algorithm}>
                  {SimilarityAlgorithmsKeys[algorithm].name}
                </MenuItem>
              ))}
            />
            <FormHelperText>
              Noticia seleccionada: <strong>{selectedData.report.title}</strong>
              . Conjunto de tweets seleccionado:{" "}
              <strong>{selectedData.topic.title}</strong>.
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          lg={1}
          style={{ paddingLeft: "8px", marginTop: 16 }}
        >
          <TextValidator
            fullWidth
            margin="dense"
            label="Umbral"
            className="threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            type="float"
            variant="outlined"
            validators={[
              "required",
              "notValidCharacter",
              "minNumberEquals0",
              "maxNumberEquals1",
            ]}
            errorMessages={[
              "El umbral es requerido",
              "Formato incorrecto",
              "El umbral debe ser mayor a 0",
              "El umbral debe ser menor a 1",
            ]}
          />
        </Grid>
      </Grid>
      <Box classes={{ root: "submit" }}>
        <Button type="submit" variant="contained" color="primary">
          Ejecutar
        </Button>
      </Box>
    </ValidatorForm>
  );
};
