export const TOUR_STEPS = [
  {
    target: ".navbar_logo",
    content: "¡Puedes presionar este botón para volver al inicio!",
    disableBeacon: true, // This makes the tour to start automatically without click
  },
  {
    target: ".navbar-data-upload",
    content:
      "Puedes clickear aquí para desplegar un menú que te brindará 2 opciones: buscar tweets y guardarlos, o subir una noticia",
  },
  {
    target: ".navbar-data-selection",
    content:
      "En esta sección puedes seleccionar el conjuto de tweets a utilizar, y la noticia con la cuál se compararán",
  },
  {
    target: ".navbar-similarity-algorithms",
    content:
      "Aquí podrás elegir varios algoritmos de similitud para ver cuánto se asemejan los tweets seleccionados a la noticia",
  },
  {
    target: ".navbar-frequencies-analysis",
    content:
      "Aquí podrás visualizar la frecuencia de aparición de cada palabra relevante al tema seleccionado.\n" +
      "Las palabras se mostrarán en un gráfico de burbujas: cuanto mayor sea la frecuencia, más grande será la burbuja.",
  },
  {
    target: ".navbar-sentiments-analysis",
    content:
      "Aquí podrás evaluar el sentimiento de los tweets: positivo, negativo o neutro.\n" +
      "Finalmente, podrás elegir uno de los algoritmos de similitud ejecutados y un umbral. " +
      "En base a tu selección se analizará el sentimiento de los tweets cuyo puntaje de similitud con la noticia supere al umbral elegido",
  },
  {
    target: ".navbar-emotions-analysis",
    content:
      "Aquí podrás evaluar las emociones de los tweets: alegría, anticipación, aversión, confianza, enojo, miedo, sorpresa y/o tristeza.\n" +
      "Finalmente, podrás elegir uno de los algoritmos de similitud ejecutados y un umbral. " +
      "En base a tu selección se analizarán las emociones de los tweets cuyo puntaje de similitud con la noticia supere al umbral elegido",
  },
  {
    target: ".navbar-dropdown",
    content:
      "¡Este es tu menú de usuario! Aquí puedes ver tus tweets guardados, tus noticias, y cerrar sesión",
  },
];
