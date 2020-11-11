import { Box, Grid, TextField, Typography } from "@material-ui/core";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { get } from "utils/api/api";
import { TweetsSelection } from "../common/TweetsSelection";
import { HashtagCloud } from "./HashtagCloud";

export const FrequencyAnalyzer = () => {
  const [wordsCount, setWordsCount] = useState(undefined);
  const [rawWords, setRawWords] = useState(undefined);
  const { selectedData } = useContext(AuthContext);
  const [threshold, setThreshold] = useState(0);
  const [hasTweets, setHasTweets] = useState(undefined); //hasTweets

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
      get("/frequencyAnalyzer?topicTitle=" + selectedData.topic.title).then(
        (response) => {
          setRawWords(response.data);
          buildGraph(response.data, 0);
        }
      );
    }
    // eslint-disable-next-line
  }, [selectedData]);

  const handleSubmit = (reportId, topicTitle, algorithm, threshold) => {
    //To-Do
    // setWasExecuted(true);
    // setTweetAndEmotions(undefined);
    // saveSelectedData({
    //   ...selectedData,
    //   emotionAnalysis: topicTitle,
    // });
    // setSelectedData({
    //   ...selectedData,
    //   emotionAnalysis: topicTitle,
    // });
    // post("/emotionAnalyzer", {
    //   reportId: reportId,
    //   topicTitle: topicTitle,
    //   algorithm: algorithm,
    //   threshold: threshold,
    // }).then(() => {
    //   get(
    //     "/emotionAnalyzer?page=1&per_page=" +
    //       tweetsPerPage +
    //       "&topicTitle=" +
    //       topicTitle
    //   ).then((response) => {
    //     setResults(response.data);
    //   });
    // });
  };

  return (
    <Box paddingBottom={10}>
      <Typography component="h1" variant="h1" align="center" className="title">
        Análisis de frecuencias
      </Typography>
      <Grid container alignItems="center" justify="center">
        <Grid item xs={12}>
          <TweetsSelection
            sectionName="frecuencias"
            handleSubmit={handleSubmit}
            setHasTweets={setHasTweets}
          />
        </Grid>
        <Grid item xs={12}>
          <HashtagCloud />
        </Grid>
        {wordsCount ? (
          <Grid item xs={12}>
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
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
};
