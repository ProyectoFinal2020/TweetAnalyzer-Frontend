import {
  AccountCircle,
  CloudUpload,
  ListAlt,
  SentimentVerySatisfied,
  Storage,
} from "@material-ui/icons";
import React from "react";
import config from "../../assets/custom/scss/config.module.scss";
import { routes } from "../../utils/routes/routes";

export const getPageSections = () => {
  return [
    {
      name: "Carga de datos",
      color: config["homeBordeaux"],
      icon: <CloudUpload />,
      subsections: [
        {
          name: "Buscar tweets",
          description:
            "Recupera tweets utilizando la API oficial de Twitter. Para realizar la búsqueda se deberá ingresar un tema, un idioma, palabras clave, un rango de fechas y una cantidad máxima de tweets.",
          link: routes.tweetFetcher.path,
        },
        {
          name: "Crear noticias",
          description:
            "Sube tantas noticias como desees. Cada una de ellas deberá tener un idioma, un contenido y un título para identificarla.",
          link: routes.createReports.path,
        },
      ],
    },
    {
      name: "Selección de datos",
      color: config["homeGreen"],
      icon: <Storage />,
      subsections: [
        {
          name: "Selección de datos",
          description: `Elige la noticia y el tema de los tweets a utilizar en las páginas restantes. Ambos deberán estar en el mismo idioma.`,
          link: routes.dataSelection.path,
        },
      ],
    },
    {
      name: "Perfil",
      color: config["homePurple"],
      icon: <AccountCircle />,
      subsections: [
        {
          name: "Mis tweets",
          description:
            "Lista los temas almacenados y sus respectivos tweets. Puedes eliminar el tema o los tweets individualmente.",
          link: routes.tweets.path,
        },
        {
          name: "Mis noticias",
          description:
            "Lista las noticias almacenadas. Puedes editar, eliminar y filtrar según su idioma o su título.",
          link: routes.reports.path,
        },
      ],
    },
    {
      name: "Algoritmos de similitud",
      color: config["homeRed"],
      icon: <ListAlt />,
      subsections: [
        {
          name: "Algoritmos de similitud",
          description:
            "Compara los tweets del tema seleccionado con la noticia. Construye una tabla donde, por cada tweet, muestra el puntaje de cada algoritmo seleccionado.",
          link: routes.similarityAlgorithms.path,
        },
      ],
    },
    {
      name: "Análisis",
      color: config["homeBlue"],
      icon: <SentimentVerySatisfied />,
      subsections: [
        {
          name: "Análisis de frecuencias",
          description:
            "Obtiene la frecuencia de aparición de todas las palabras relevantes al tema seleccionado.",
          link: routes.frequencyAnalyzer.path,
        },
      ],
    },
    {
      name: "Análisis",
      color: config["homeBlue"],
      icon: <SentimentVerySatisfied />,
      subsections: [
        {
          name: "Análisis de sentimiento",
          description:
            "Obtiene los sentimientos de cada tweet: positivo, negativo o neutro. Incluso, permite seleccionar un subconjunto de los tweets obtenidos en el paso anterior.",
          link: routes.sentimentAnalyzer.path,
        },
      ],
    },
    {
      name: "Análisis",
      color: config["homeBlue"],
      icon: <SentimentVerySatisfied />,
      subsections: [
        {
          name: "Análisis de emociones",
          description:
            "Obtiene las emociones de cada tweet: alegría, anticipación, aversión, confianza, enojo, miedo, sorpresa y/o tristeza. Incluso, permite seleccionar un subconjunto de los tweets obtenidos en el paso anterior.",
          link: routes.emotionAnalyzer.path,
        },
      ],
    },
  ];
};
