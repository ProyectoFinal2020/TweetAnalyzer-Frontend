import colors from "../../assets/custom/scss/config.module.scss";

export const SimilarityAlgorithmsNames = {
  "Bag of Words": {
    name: "bagOfWords",
  },
  Doc2Vec: {
    name: "doc2vecGensim",
  },
  "Doc2Vec N-Sim": {
    name: "doc2vecNSim",
  },
  Jaccard: {
    name: "jaccard",
  },
  "Soft Cosine": {
    name: "softCosine",
  },
  "Tf-Idf": {
    name: "tfIdfSim",
  },
  WMD: {
    name: "wmd",
  },
  Word2Vec: {
    name: "word2vecGensim",
  },
};

export const SimilarityAlgorithmsKeys = {
  bagOfWords: {
    name: "Bag of Words",
    key: "bow",
    color: colors.purple,
  },
  doc2vecGensim: {
    name: "Doc2Vec",
    key: "d2vg",
    color: colors.blue,
  },
  doc2vecNSim: {
    name: "Doc2Vec N-Sim",
    key: "d2vn",
    color: colors.green,
  },
  jaccard: {
    name: "Jaccard",
    key: "jac",
    color: colors.darkOrange,
  },
  softCosine: {
    name: "Soft Cosine",
    key: "scos",
    color: colors.lightBlue,
  },
  tfIdfSim: {
    name: "Tf-Idf",
    key: "tfidf",
    color: colors.darkPurple,
  },
  wmd: {
    name: "WMD",
    key: "wmd",
    color: colors.orange,
  },
  word2vecGensim: {
    name: "Word2Vec",
    key: "w2v",
    color: colors.darkGreen,
  },
};
