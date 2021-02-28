import { Grid } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { EmptyMessageResult } from "../shared/emptyMessageResult/EmptyMessageResult";
import { ResponsiveTablePaginator } from "../shared/paginator/ResponsiveTablePaginator";
import { Tweet } from "../shared/tweet/Tweet";
import React from "react";

export const TweetsTable = ({
  tweets,
  count,
  total,
  page = 1,
  setPage,
  tweetsPerPage = 12,
  setTweetsPerPage,
  listItemsPerPage = [12, 24, 48, 96],
  getTweets,
  updateTweetChecked,
}) => {
  return tweets && tweets.length > 0 ? (
    <>
      <Grid container spacing={2} alignItems="stretch">
        {tweets.map((tweet, index) => (
          <Grid item xs={12} sm={6} lg={4} key={tweet.id}>
            <Tweet
              tweet={tweet}
              setCheckedTweet={() => updateTweetChecked(tweet.id)}
            />
          </Grid>
        ))}
      </Grid>
      <ResponsiveTablePaginator
        count={count}
        total={total}
        page={page}
        itemsPerPage={tweetsPerPage}
        listItemsPerPage={listItemsPerPage}
        getItems={getTweets}
        setPage={setPage}
        setItemsPerPage={setTweetsPerPage}
      />
    </>
  ) : !tweets ? (
    <Grid container direction="row" alignItems="stretch" spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <Grid item xs={12} sm={6} lg={4} key={key}>
          <Skeleton height={300} variant="rect" />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Skeleton height={52} variant="rect" />
      </Grid>
    </Grid>
  ) : (
    <EmptyMessageResult
      title="Lo sentimos, no se encontraron tweets con esas características."
      subtitle="¡Intentá nuevamente con otro filtro!"
    />
  );
};
