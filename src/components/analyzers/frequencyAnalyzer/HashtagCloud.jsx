import { Card, CardContent, CardHeader, IconButton } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import Skeleton from "@material-ui/lab/Skeleton";
import { FilterFields } from "components/shared/chips/FilterFields";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import { get } from "utils/api/api";
import { FrequencyDialog } from "./dialogs/FrequencyDialog";

export const HashtagCloud = ({ className, ...props }) => {
  const { selectedData } = useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(undefined);
  const [filteredHashtagCount, setFilteredHashtagCount] = useState(undefined);
  const [minimumFrequency, setMinimumFrequency] = useState(1);
  const [maxAmountWords, setMaxAmountWords] = useState(150);

  useEffect(() => {
    get(
      "/frequencyAnalyzer/hashtags?topicTitle=" +
        selectedData.frequencyAnalysis.topicTitle
    ).then((response) => {
      var aux = response.data.map((item) => {
        return { text: item.label, value: item.value };
      });
      setHashtagCount(aux);
      setFilteredHashtagCount(aux);
    });
  }, [selectedData]);

  const save = (maxWords, minFrequency) => {
    setMaxAmountWords(maxWords);
    setMinimumFrequency(minFrequency);
    const filtered = hashtagCount.filter((data) => data.value >= minFrequency);
    setFilteredHashtagCount(filtered);
  };

  return (
    <>
      <Card className={className} variant="outlined">
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
          className="graph-card-header"
        />
        <CardContent className="graph-card-container">
          {filteredHashtagCount ? (
            <>
              <FilterFields
                values={[
                  "Max. cantidad de hashtags en el gráfico: " + maxAmountWords,
                  "Total de hashtags: " + hashtagCount.length,
                ]}
              />
              <ReactWordcloud
                maxWords={maxAmountWords}
                words={filteredHashtagCount}
                options={{
                  rotations: 0,
                  fontSizes: [15, 60],
                  fontFamily: "Roboto",
                  deterministic: true,
                }}
              />
            </>
          ) : (
            <Skeleton height={300} variant="rect" />
          )}
        </CardContent>
      </Card>
      <FrequencyDialog
        dialogTitle="Nube de hashtags"
        open={dialogOpen}
        setOpen={setDialogOpen}
        maxAmountWords={maxAmountWords}
        minimumFrequency={minimumFrequency}
        save={save}
      />
    </>
  );
};
