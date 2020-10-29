import React, { useContext, useEffect, useState } from "react";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import { get } from "utils/api/api";
import { AuthContext } from "contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { routes } from "utils/routes/routes";
import { NoContentComponent } from "components/shared/noContent/NoContent";
import { Box, TextField } from "@material-ui/core";

export const FrequencyAnalyzer = () => {
  const [wordsCount, setWordsCount] = useState(undefined);
  const [rawWords, setRawWords] = useState(undefined);
  const { selectedData } = useContext(AuthContext);
  const [threshold, setThreshold] = useState(0);
  const history = useHistory();

  //todo: mejorar visualizacion
  const buildGraph = (words, newThreshold) => {
    let aux = [];
    for (var word in words) {
      if (words[word] > newThreshold) {
        aux.push({ label: word, value: words[word] });
      }
    }
    setWordsCount(aux);
  };

  const handleChange = (e) => {
    setThreshold(e.target.value);
    buildGraph(rawWords, e.target.value);
  };

  const bubbleClick = (label) => {
    console.log("Custom bubble click func");
  };
  const legendClick = (label) => {
    console.log("Customer legend click func");
  };
  useEffect(() => {
    if (selectedData && selectedData.topic) {
      get("/bubbleChart?topicTitle=" + selectedData.topic.title).then(
        (response) => {
          setRawWords(response.data);
          buildGraph(response.data, 0);
        }
      );
    }
    // eslint-disable-next-line
  }, [selectedData]);

  return selectedData ? (
    <>
      {wordsCount ? (
        <>
          <TextField
            type="number"
            label="Frecuencia mínima"
            variant="outlined"
            value={threshold}
            onChange={handleChange}
          />
          <BubbleChart
            graph={{
              zoom: 1,
              offsetX: 0,
              offsetY: 0,
            }}
            width={1000}
            height={800}
            padding={0} // optional value, number that set the padding between bubbles
            showLegend={true} // optional value, pass false to disable the legend.
            legendPercentage={20} // number that represent the % of with that legend going to use.
            legendFont={{
              family: "Arial",
              size: 12,
              color: "#000",
              weight: "bold",
            }}
            valueFont={{
              family: "Arial",
              size: 12,
              color: "#fff",
              weight: "bold",
            }}
            labelFont={{
              family: "Arial",
              size: 16,
              color: "#fff",
              weight: "bold",
            }}
            //Custom bubble/legend click functions such as searching using the label, redirecting to other page
            bubbleClickFunc={bubbleClick}
            legendClickFun={legendClick}
            data={wordsCount}
          />
        </>
      ) : null}
    </>
  ) : (
    <Box className="no_content_box">
      {NoContentComponent(
        "No elegiste los datos",
        "¡Seleccioná una noticia y un conjunto de tweets antes de comenzar!",
        "#NoSearchResult",
        [
          {
            handleClick: () => history.push(routes.dataSelection.path),
            buttonText: "Seleccionar datos",
          },
        ]
      )}
    </Box>
  );
};
