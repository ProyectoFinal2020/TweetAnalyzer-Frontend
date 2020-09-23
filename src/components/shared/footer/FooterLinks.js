export const footerLinks = [
  {
    title: "Autores",
    values: [
      {
        name: "Caterina Panzone",
        link: "https://github.com/Caterina-Panzone",
      },
      {
        name: "Hernán Pocchiola",
        link: "https://github.com/hpocchiola",
      },
    ],
  },
  {
    title: "Contáctanos",
    values: [
      {
        name: "Email",
        link: "mailto: tweetanalyzer.uns@gmail.com",
        tooltip: "tweetanalyzer.uns@gmail.com",
      },
    ],
  },
  {
    title: "Recursos",
    values: [
      {
        name: "Nuestra API",
        link:  process.env.REACT_APP_ENDPOINT, 
      },
      {
        name: "Twitter",
        link: "https://developer.twitter.com/en/docs/twitter-api",
      },
    ],
  },
];
