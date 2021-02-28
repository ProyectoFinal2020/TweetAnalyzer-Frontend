import charts from "../../../assets/custom/scss/config.module.scss";

export const getEmotions = (emotion) => {
  let emotions = [];
  for (let attribute in emotion) {
    if (emotion[attribute] > 0) {
      emotions.push({
        title: attribute,
        value: emotion[attribute],
        color: charts[attribute],
      });
    }
  }
  return emotions.length > 0
    ? emotions
    : [{ title: "none", value: 100, color: charts["none"] }];
};

export const getTweetAndEmotions = (items) => {
  let tweetAndEmotions = [];
  for (let i = 0; i < items.length; i++) {
    tweetAndEmotions.push({
      tweet: items[i].tweet,
      emotions: getEmotions(items[i].emotion),
      key: i,
    });
  }
  return tweetAndEmotions;
};
