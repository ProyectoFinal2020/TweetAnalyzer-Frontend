import config from "assets/custom/scss/config.scss";

export const graphColors = [
  config["graphBlue"],
  config["graphOrange"],
  config["graphRed"],
  config["graphTeal"],
  config["graphPink"],
  config["graphGreen"],
  config["graphPurple"],
  config["graphYellow"],
];

export const getOptions = (title) => {
  return {
    title: {
      text: title,
      display: true,
      fontSize: 22,
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            labelString: "Polaridad",
            display: true,
            fontSize: 18,
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            labelString: "Cantidad de tweets",
            display: true,
            fontSize: 18,
          },
        },
      ],
    },
  };
};
