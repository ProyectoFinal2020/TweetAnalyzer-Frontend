import Skeleton from "@material-ui/lab/Skeleton";
import { EmotionChart } from "components/shared/tweet/EmotionChart";
import React, { useEffect, useState } from "react";
import { get } from "utils/api/api";
import { getEmotions } from "./getTweetAndEmotions";
import "./SummaryChart.scss";

export const SummaryChart = ({ selectedData, ...props }) => {
  const [topicEmotions, setTopicEmotions] = useState(undefined);

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
    });
  }, [selectedData]);

  return topicEmotions ? (
    <EmotionChart emotion={topicEmotions} height={250} fontSize={5} />
  ) : (
    <Skeleton height={260} variant="rect" />
  );
};
