import React, { useEffect, useReducer } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useContext } from "react";
import { AuthContext } from "contexts/AuthContext";
import { saveUserTour } from "utils/localStorageManagement/userTour";

const TOUR_STEPS = [
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
    target: ".navbar-analysis",
    content:
      "Aquí podrás evaluar el sentimiento de los tweets: positivo, negativo o neutro.\n" +
      "Finalmente, podrás elegir uno de los algoritmos de similitud ejecutados y un umbral. " +
      "En base a tu selección se analizarán las emociones de los tweets cuyo puntaje de similitud con la noticia supere al umbral elegido",
  },
  {
    target: ".navbar-dropdown",
    content:
      "¡Este es tu menú de usuario! Aquí puedes ver tus tweets guardados, tus noticias, y cerrar sesión",
  },
];

const INITIAL_STATE = {
  key: new Date(), // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true, // Show next button
  loading: false,
  stepIndex: 0, // Make the component controlled
  steps: TOUR_STEPS,
};

// Reducer will manage updating the local state
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // start the tour
    case "START":
      return { ...state, run: true };
    // Reset to 0th step
    case "RESET":
      return { ...state, stepIndex: 0 };
    // Stop the tour
    case "STOP":
      return { ...state, run: false };
    // Update the steps for next / back button click
    case "NEXT_OR_PREV":
      return { ...state, ...action.payload };
    // Restart the tour - reset go to 1st step, restart create new tour
    case "RESTART":
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      };
    default:
      return state;
  }
};

export const UserTour = () => {
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { isAuthenticated, userTour, setUserTour } = useContext(AuthContext);

  // Set once tour is viewed, skipped or closed
  const setTourViewed = () => {
    saveUserTour(true);
  };

  useEffect(() => {
    // Auto start the tour if the tour is not viewed before
    if (!userTour) {
      dispatch({ type: "RESTART" });
      setUserTour(true);
    }
  }, [userTour, setUserTour]);

  // Listen to callback and dispatch state changes
  const callback = (data) => {
    const { action, index, type, status } = data;

    if (
      // If close button clicked, then close the tour
      action === ACTIONS.CLOSE ||
      // If skipped or end tour, then close the tour
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      setTourViewed();
      dispatch({ type: "STOP" });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Check whether next or back button click and update the step.
      dispatch({
        type: "NEXT_OR_PREV",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
      });
    }
  };

  //   // Call startTour to start the tour
  //   const startTour = () => {
  //     // Start the tour manually
  //     dispatch({ type: "RESTART" });
  //   };

  return (
    <>
      {isAuthenticated ? (
        <JoyRide
          {...tourState}
          callback={callback}
          showSkipButton={true}
          styles={{
            tooltipContainer: {
              textAlign: "left",
            },
            buttonBack: {
              marginRight: 10,
            },
          }}
          locale={{
            next: "Siguiente",
            back: "Anterior",
            last: "Finalizar recorrido",
            skip: "Saltear",
          }}
        />
      ) : null}
    </>
  );
};
