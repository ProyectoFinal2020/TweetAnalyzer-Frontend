import charts from "assets/custom/scss/config.scss";

const getEmotions = (sentiment) => {
  let emotions = [];
  for (let attribute in sentiment) {
    if (sentiment[attribute] > 0) {
      emotions.push({
        title: attribute,
        value: sentiment[attribute],
        color: charts[attribute],
      });
    }
  }
  return emotions.length > 0
    ? emotions
    : [{ title: "No posee sentimiento", value: 100, color: charts["none"] }];
};

export const getTweetAndSentiments = (items) => {
  let tweetAndSentiments = [];
  for (let i = 0; i < items.length; i++) {
    tweetAndSentiments.push({
      tweet: items[i].tweet,
      emotions: getEmotions(items[i].sentiment),
      key: i,
    });
  }
  return tweetAndSentiments;
};
