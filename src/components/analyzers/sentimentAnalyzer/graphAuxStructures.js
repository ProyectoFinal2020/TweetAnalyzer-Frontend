import config from "assets/custom/scss/config.scss";

export const graphColors = config["polarity"];

export const getOptions = () => {
  return {
    aspectRatio: 2,
    responsive: true,
    scales: {
      xAxes: [
        {
          scaleLabel: {
            labelString: "Polaridad",
            display: true,
            fontSize: 18,
          },
          gridLines: {
            color: "transparent",
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
