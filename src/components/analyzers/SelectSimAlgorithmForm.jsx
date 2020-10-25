import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { DownloadButton } from "components/shared/downloadButton/DownloadButton";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

export const SelectSimAlgorithmForm = ({
  disableDownload,
  handleSubmit,
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
    <ValidatorForm onSubmit={submit}>
      <Grid container alignItems="center" justify="flex-end">
        <Grid item xs={12} className="select_algorithm_emotion_analyzer">
          <Grid container alignItems="center" justify="center">
            <Grid item xs="auto" className="select_executed_algorithms">
              <FormControl>
                <InputLabel shrink id="report-label">
                  Seleccione un algoritmo
                </InputLabel>
                <Select
                  labelid="report-label"
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                >
                  {selectedData.algorithms.map((algorithm, key) => (
                    <MenuItem key={key} value={algorithm}>
                      {algorithm}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Seleccione un conjunto de tweets
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs="auto">
              <TextValidator
                label="Umbral"
                className="emotion_analyzer_umbral"
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
        </Grid>
        <Grid item xs="auto">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit"
          >
            Ejecutar
          </Button>
        </Grid>
        <DownloadButton
          url={
            "/emotionAnalyzer/download?topicTitle=" + selectedData.topic.title
          }
          filename={selectedData.topic.title + "-emotion-analysis"}
          disabled={disableDownload}
        />
      </Grid>
    </ValidatorForm>
  );
};
