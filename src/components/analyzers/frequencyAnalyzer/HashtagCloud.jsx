import { TagCloud } from "react-tagcloud";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import { get } from "utils/api/api";

export const HashtagCloud = () => {
  const { selectedData } = useContext(AuthContext);
  const [hashtagCount, setHashtagCount] = useState(undefined);

  useEffect(() => {
    if (selectedData && selectedData.topic) {
      get("/frequencyAnalyzer?topicTitle=" + selectedData.topic.title).then(
        (response) => {
          let aux = [];
          for (var item in response.data) {
            //todo: ver este valor del if
            if (response.data[item] > 3) {
              aux.push({ value: item, count: response.data[item] });
            }
          }
          setHashtagCount(aux);
        }
      );
    }
  }, [selectedData]);

  return hashtagCount ? (
    <TagCloud
      minSize={12}
      maxSize={35}
      tags={hashtagCount}
      onClick={(tag) => alert(`'${tag.value}' was selected!`)}
    />
  ) : null;
};
