import Skeleton from "@material-ui/lab/Skeleton";
import { EmotionChart } from "../../shared/tweet/EmotionChart";
import React, { useEffect, useState } from "react";
import { get } from "../../../utils/api/api";
import { getEmotions } from "./getTweetAndEmotions";
import "./SummaryChart.scss";

export const SummaryChart = ({ selectedData, setShowResults, ...props }) => {
  const [topicEmotions, setTopicEmotions] = useState(undefined);

  const checkForEmotions = (emotions) => {
    for (var emotion in emotions) {
      if (emotions[emotion] !== 0) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    setTopicEmotions(undefined);
    get(
      "/emotionAnalyzer/topic?topicTitle=" +
        selectedData.topicTitle +
        "&reportId=" +
        selectedData.reportId +
        "&algorithm=" +
        selectedData.algorithm +
        "&threshold=" +
        selectedData.threshold
    ).then((response) => {
      setTopicEmotions(getEmotions(response.data));
      setShowResults(checkForEmotions(response.data));
    });
  }, [selectedData, setShowResults]);

  return topicEmotions ? (
    <EmotionChart emotion={topicEmotions} height={250} fontSize={5} />
  ) : (
    <Skeleton height={260} variant="rect" />
  );
};
