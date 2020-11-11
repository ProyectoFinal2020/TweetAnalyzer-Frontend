import { Card, CardContent, CardHeader, IconButton } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import Skeleton from "@material-ui/lab/Skeleton";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import { get } from "utils/api/api";
import { HashtagCloudDialog } from "./HashtagCloudDialog";

export const HashtagCloud = () => {
  const { selectedData } = useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(undefined);
  const [filteredHashtagCount, setFilteredHashtagCount] = useState(undefined);
  const [minimumFrequency, setMinimumFrequency] = useState(1);
  const [maxAmountWords, setMaxAmountWords] = useState(150);

  useEffect(() => {
    if (selectedData && selectedData.topic) {
      get(
        "/frequencyAnalyzer/hashtags?topicTitle=" + selectedData.topic.title
      ).then((response) => {
        var aux = Object.keys(response.data).map((key) => {
          return { text: key, value: response.data[key] };
        });
        setHashtagCount(aux);
        setFilteredHashtagCount(aux);
      });
    }
  }, [selectedData]);

  const save = (maxWords, minFrequency) => {
    setMaxAmountWords(maxWords);
    setMinimumFrequency(minFrequency);
    const filtered = hashtagCount.filter((data) => data.value >= minFrequency);
    console.log(filtered);
    setFilteredHashtagCount(filtered);
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Nube de hashtags"
          action={
            <IconButton
              aria-label="filtrar"
              disabled={!hashtagCount}
              onClick={() => setDialogOpen(true)}
            >
              <FilterListIcon />
            </IconButton>
          }
        />
        <CardContent>
          {filteredHashtagCount ? (
            <ReactWordcloud
              maxWords={maxAmountWords}
              words={filteredHashtagCount}
              options={{
                rotations: 0,
                fontSizes: [15, 60],
                fontFamily: "Roboto",
                // deterministic: false,
              }}
            />
          ) : (
            <Skeleton height={300} style={{ width: "100%" }} />
          )}
        </CardContent>
      </Card>
      <HashtagCloudDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        maxAmountWords={maxAmountWords}
        minimumFrequency={minimumFrequency}
        save={save}
      />
    </>
  );
};
