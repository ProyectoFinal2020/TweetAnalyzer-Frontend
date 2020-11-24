import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Hidden,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import Skeleton from "@material-ui/lab/Skeleton";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import { FilterFields } from "components/shared/chips/FilterFields";
import { SimilarityAlgorithmsKeys } from "components/similarityAlgorithms/SimilarityAlgorithmsNames";
import { AuthContext } from "contexts/AuthContext";
import * as d3 from "d3";
import React, { useContext, useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import { get } from "utils/api/api";
import { CardSubheader } from "../common/CardSubheader";
import { FrequencyDialog } from "./dialogs/FrequencyDialog";
import "./FrequencyBubbleChart.scss";

const colors = d3.scaleOrdinal(d3["schemeCategory20c"]);

export const FrequencyBubbleChart = ({ className, ...props }) => {
  const { selectedData } = useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [minimumFrequency, setMinimumFrequency] = useState(1);
  const [maxAmountWords, setMaxAmountWords] = useState(200);
  const [filteredWordsCount, setFilteredWordsCount] = useState(undefined);
  const [wordsCount, setWordsCount] = useState(undefined);

  useEffect(() => {
    setFilteredWordsCount(undefined);
    get(
      "/frequencyAnalyzer?topicTitle=" +
        selectedData.frequencyAnalysis.topicTitle +
        "&reportId=" +
        selectedData.report?.id +
        "&algorithm=" +
        selectedData.frequencyAnalysis.algorithm +
        "&threshold=" +
        selectedData.frequencyAnalysis.threshold
    ).then((response) => {
      setWordsCount(response.data);
      setFilteredWordsCount(response.data);
    });
  }, [selectedData]);

  const save = (maxWords, minFrequency) => {
    setMaxAmountWords(maxWords);
    setMinimumFrequency(minFrequency);
    setFilteredWordsCount(
      wordsCount.filter((word) => word.value > minFrequency)
    );
  };

  const TopRow = ({ value, label, color, className }) => {
    return (
      <Box className={"top-legend " + className}>
        <Box className="chip-chart">
          <Chip label={value} style={{ backgroundColor: color }} size="small" />
        </Box>
        <Typography variant="subtitle2" component="span">
          {label}
        </Typography>
      </Box>
    );
  };

  return selectedData && selectedData.frequencyAnalysis ? (
    <>
      <Card className={className} variant="outlined">
        <CardHeader
          title="Frecuencia de palabras"
          subheader={
            <CardSubheader
              labels={
                selectedData.frequencyAnalysis.algorithm
                  ? [
                      {
                        title: "Tweets",
                        value: selectedData.frequencyAnalysis.topicTitle,
                      },
                      {
                        title: "Algoritmo",
                        value:
                          SimilarityAlgorithmsKeys[
                            selectedData.frequencyAnalysis.algorithm
                          ].name,
                      },
                      {
                        title: "Umbral",
                        value: selectedData.frequencyAnalysis.threshold,
                      },
                    ]
                  : [
                      {
                        title: "Tweets",
                        value: selectedData.frequencyAnalysis.topicTitle,
                      },
                    ]
              }
            />
          }
          action={
            <Tooltip title="Filtrar">
              <span>
                <IconButton
                  aria-label="filtrar"
                  disabled={!filteredWordsCount}
                  onClick={() => setDialogOpen(true)}
                >
                  <FilterListIcon />
                </IconButton>
              </span>
            </Tooltip>
          }
          className="pdg-btm-0"
        />
        <CardContent className="graph-card-container">
          {filteredWordsCount ? (
            <>
              <FilterFields
                values={[
                  "Max. cantidad de palabras en el gráfico: " + maxAmountWords,
                  "Total de palabras: " + wordsCount.length,
                ]}
              />
              <Hidden mdDown>
                <Grid
                  container
                  direction="row-reverse"
                  justify="center"
                  spacing={4}
                >
                  <Grid item lg={3}>
                    <Card variant="outlined">
                      <CardHeader title="Top 10" style={{ paddingBottom: 0 }} />
                      <CardContent>
                        {filteredWordsCount
                          .slice(0, 10)
                          .map((wordCount, index) => (
                            <TopRow
                              key={index}
                              label={wordCount.label}
                              value={wordCount.value}
                              color={colors(index)}
                              className="top-legend-width"
                            />
                          ))}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs="auto">
                    <BubbleChart
                      graph={{
                        zoom: 1,
                        offsetX: 0,
                        offsetY: 0,
                      }}
                      width={680}
                      height={680}
                      showLegend={false}
                      valueFont={{
                        size: 12,
                        color: "white",
                        weight: "600",
                      }}
                      labelFont={{
                        size: 13,
                        color: "white",
                        weight: "700",
                      }}
                      data={filteredWordsCount.slice(0, maxAmountWords)}
                    />
                  </Grid>
                </Grid>
              </Hidden>
              <Hidden lgUp>
                <ReactWordcloud
                  maxWords={maxAmountWords}
                  words={filteredWordsCount
                    .slice(0, maxAmountWords)
                    .map((word) => ({
                      text: word.label,
                      value: word.value,
                    }))}
                  options={{
                    rotations: 0,
                    fontSizes: [15, 60],
                    fontFamily: "Roboto",
                    deterministic: true,
                  }}
                />
              </Hidden>
            </>
          ) : (
            <Skeleton height={600} variant="rect" />
          )}
        </CardContent>
      </Card>
      <FrequencyDialog
        dialogTitle="Frecuencia de palabras"
        open={dialogOpen}
        setOpen={setDialogOpen}
        maxAmountWords={maxAmountWords}
        minimumFrequency={minimumFrequency}
        save={save}
      />
    </>
  ) : null;
};
