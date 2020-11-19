import Skeleton from "@material-ui/lab/Skeleton";
import { EmotionChart } from "components/shared/tweet/EmotionChart";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { get } from "utils/api/api";
import { getEmotions } from "./getTweetAndEmotions";
import "./SummaryChart.scss";

export const SummaryChart = () => {
  const { selectedData } = useContext(AuthContext);
  const [topicEmotions, setTopicEmotions] = useState(undefined);

  useEffect(() => {
    if (selectedData.emotionAnalysis) {
      setTopicEmotions(undefined);
      get(
        "/emotionAnalyzer/topic?topicTitle=" +
          selectedData.emotionAnalysis.topicTitle +
          "&reportId=" +
          selectedData.report?.id +
          "&algorithm=" +
          selectedData.emotionAnalysis.algorithm +
          "&threshold=" +
          selectedData.emotionAnalysis.threshold
      ).then((response) => {
        setTopicEmotions(getEmotions(response.data));
      });
    }
  }, [selectedData]);

  return topicEmotions ? (
    <EmotionChart emotion={topicEmotions} height={250} fontSize={5} />
  ) : (
    <Skeleton height={260} variant="rect" />
  );
};
