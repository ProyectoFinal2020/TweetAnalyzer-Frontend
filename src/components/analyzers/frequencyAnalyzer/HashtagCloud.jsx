import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import Skeleton from "@material-ui/lab/Skeleton";
import { FilterFields } from "../../shared/chips/FilterFields";
import { EmptyMessageResult } from "../../shared/emptyMessageResult/EmptyMessageResult";
import { SimilarityAlgorithmsKeys } from "../../similarityAlgorithms/SimilarityAlgorithmsNames";
import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import { get } from "../../../utils/api/api";
import { CardSubheader } from "../common/CardSubheader";

const FrequencyDialog = lazy(() => import("./dialogs/FrequencyDialog"));

export const HashtagCloud = ({ className, selectedData, ...props }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(undefined);
  const [filteredHashtagCount, setFilteredHashtagCount] = useState(undefined);
  const [minimumFrequency, setMinimumFrequency] = useState(1);
  const [maxAmountWords, setMaxAmountWords] = useState(150);
  const [showResults, setShowResults] = useState(true);

  useEffect(() => {
    setFilteredHashtagCount(undefined);
    get(
      "/frequencyAnalyzer/hashtags?topicTitle=" +
        selectedData.topicTitle +
        "&reportId=" +
        selectedData.reportId +
        "&algorithm=" +
        selectedData.algorithm +
        "&threshold=" +
        selectedData.threshold
    ).then((response) => {
      var aux = response.data.map((item) => {
        return { text: item.label, value: item.value };
      });
      setShowResults(aux.length !== 0);
      setHashtagCount(aux);
      setFilteredHashtagCount(aux);
    });
  }, [selectedData, setShowResults]);

  const save = (maxWords, minFrequency) => {
    setMaxAmountWords(maxWords);
    setMinimumFrequency(minFrequency);
    const filtered = hashtagCount.filter((data) => data.value >= minFrequency);
    setFilteredHashtagCount(filtered);
  };

  return showResults ? (
    <>
      <Card className={className} variant="outlined">
        <CardHeader
          title={"Nube de hashtags"}
          subheader={
            <CardSubheader
              labels={
                selectedData.algorithm
                  ? [
                      {
                        title: "Tweets",
                        value: selectedData.topicTitle,
                      },
                      {
                        title: "Algoritmo",
                        value:
                          SimilarityAlgorithmsKeys[selectedData.algorithm].name,
                      },
                      {
                        title: "Umbral",
                        value: selectedData.threshold,
                      },
                    ]
                  : [
                      {
                        title: "Tweets",
                        value: selectedData.topicTitle,
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
                  disabled={!hashtagCount}
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
          {filteredHashtagCount ? (
            filteredHashtagCount.length > 0 ? (
              <>
                <FilterFields
                  values={[
                    "Max. cantidad de hashtags en el gráfico: " +
                      maxAmountWords,
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
                    fontDisplay: "swap",
                    deterministic: true,
                  }}
                />
              </>
            ) : (
              <EmptyMessageResult
                title="Lo sentimos, no se encontraron tweets con esas características."
                subtitle="¡Intentá nuevamente con otro filtro!"
              />
            )
          ) : (
            <Skeleton height={300} variant="rect" />
          )}
        </CardContent>
      </Card>
      <Suspense fallback={<CircularProgress />}>
        <FrequencyDialog
          dialogTitle="Nube de hashtags"
          open={dialogOpen}
          setOpen={setDialogOpen}
          maxAmountWords={maxAmountWords}
          minimumFrequency={minimumFrequency}
          save={save}
        />
      </Suspense>
    </>
  ) : (
    <Card>
      <EmptyMessageResult
        title="Lo sentimos, no se encontraron tweets con esas características."
        subtitle="¡Intentá nuevamente con otro umbral!"
      />
    </Card>
  );
};
