import { Divider, Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { EmptyMessageResult } from "../shared/emptyMessageResult/EmptyMessageResult";
import { LanguageDropdown } from "../shared/languageDropdown/LanguageDropdown";
import React, { useEffect, useState } from "react";
import { languagesDictionary } from "../../utils/dictionaries/language";
import "./SearchTweets.scss";

export const SearchTweets = ({
  tweetsTopics,
  selectedTweetTopic,
  handleTweetsTopicChange,
  disabled = false,
  ...props
}) => {
  const [filteredTweetsTopics, setFilteredTweetsTopics] = useState([]);
  const [languages, setLanguages] = useState(Object.keys(languagesDictionary));

  useEffect(() => {
    if (tweetsTopics) {
      setFilteredTweetsTopics(tweetsTopics.map((t) => t.topic_title));
    }
  }, [tweetsTopics]);

  const handleLanguageChange = (language) => {
    setLanguages(language);
    const filtered = tweetsTopics
      .filter((t) => language.includes(t.language))
      .map((t) => t.topic_title);
    setFilteredTweetsTopics(filtered);
    if (!filtered.find((topic) => topic === selectedTweetTopic)) {
      handleTweetsTopicChange(filtered[0]);
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={1}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={9}
          xl={10}
          className="search_bar search-tweets-bar"
        >
          <Autocomplete
            options={filteredTweetsTopics}
            loading={!tweetsTopics}
            value={selectedTweetTopic}
            renderInput={(params) => (
              <TextField {...params} placeholder="Buscar" variant="filled" />
            )}
            onChange={(e, value) => handleTweetsTopicChange(value)}
            classes={{ inputRoot: "search-input" }}
            noOptionsText="No se encontraron tweets"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3} xl={2} className="multiple_selector">
          <LanguageDropdown
            disabled={disabled}
            languages={languages}
            handleLanguageChange={handleLanguageChange}
          />
        </Grid>
      </Grid>
      <Divider light className="mgn-top-10  mgn-btm-20" />
      {filteredTweetsTopics.length === 0 && tweetsTopics ? (
        <EmptyMessageResult
          title="Lo sentimos, no encontramos tweets con esas características."
          subtitle="¡Intentá nuevamente con otro filtro!"
        />
      ) : null}
    </>
  );
};
