import List from "@material-ui/core/List";
import {
  CloudUpload,
  Home,
  ListAlt,
  SentimentVerySatisfied,
  Storage,
  Settings,
} from "@material-ui/icons";
import { AuthContext } from "../../../../contexts/AuthContext";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { app } from "../../../../utils/firebase/firebase";
import { logout } from "../../../../utils/localStorageManagement/authentication";
import { routes } from "../../../../utils/routes/routes";
import { get } from "../../../../utils/api/api";
import { SidebarItem } from "./SidebarItem";
import anonymousUser from "../../../../assets/custom/img/anonymousUser.png";
import { removeUserTour } from "../../../../utils/localStorageManagement/userTour";
import { UserTour } from "../userTour/UserTour";

export const Sidebar = ({ ...props }) => {
  const history = useHistory();
  const {
    setIsAuthenticated,
    setSelectedData,
    currentUser,
    setUserTour,
  } = useContext(AuthContext);

  const handleResetTour = () => {
    removeUserTour();
    setUserTour(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    get("/account/logout").then(() => {
      setSelectedData(undefined);
      logout();
      setIsAuthenticated(false);
      app.auth().signOut();
      history.push(routes.login.path);
    });
  };

  const itemsAux = [
    {
      name: "inicio",
      label: "Inicio",
      icon: <Home />,
      onClick: () => history.push(routes.home.path),
      className: "",
    },
    {
      name: "cargaDeDatos",
      label: "Carga de datos",
      icon: <CloudUpload />,
      className: "navbar-data-upload",
      items: [
        {
          name: "buscarTweets",
          label: "Buscar tweets",
          onClick: () => history.push(routes.tweetFetcher.path),
          className: "",
        },
        {
          name: "crearNoticias",
          label: "Crear noticias",
          onClick: () => history.push(routes.createReports.path),
          className: "",
        },
      ],
    },
    {
      name: "seleccionDatos",
      label: "Selección de datos",
      icon: <Storage />,
      onClick: () => history.push(routes.dataSelection.path),
      className: "navbar-data-selection",
    },
    {
      name: "algoritmosSimilitud",
      label: "Algoritmos de similitud",
      icon: <ListAlt />,
      onClick: () => history.push(routes.similarityAlgorithms.path),
      className: "navbar-similarity-algorithms",
    },
    {
      name: "analisisDeTweets",
      label: "Análisis",
      icon: <SentimentVerySatisfied />,
      className: "",
      items: [
        {
          name: "analisisDeFrecuencias",
          label: "Análisis de frecuencias",
          onClick: () => history.push(routes.frequencyAnalyzer.path),
          className: "navbar-frequencies-analysis",
        },
        {
          name: "analisisDeSentimientos",
          label: "Análisis de sentimientos",
          onClick: () => history.push(routes.sentimentAnalyzer.path),
          className: "navbar-sentiments-analysis",
        },
        {
          name: "analisisDeEmociones",
          label: "Análisis de emociones",
          onClick: () => history.push(routes.emotionAnalyzer.path),
          className: "navbar-emotions-analysis",
        },
      ],
    },
    {
      name: "perfil",
      label: "Perfil",
      icon: (
        <img
          src={
            currentUser
              ? currentUser.photoUrl !== ""
                ? currentUser.photoUrl
                : anonymousUser
              : null
          }
          alt="profile"
        />
      ),
      className: "",
      items: [
        {
          name: "misTweets",
          label: "Mis tweets",
          onClick: () => history.push(routes.tweets.path),
          className: "",
        },
        {
          name: "misNoticias",
          label: "Mis noticias",
          onClick: () => history.push(routes.reports.path),
          className: "",
        },
        {
          name: "cerrarSesion",
          label: "Cerrar sesión",
          onClick: handleLogout,
          className: "",
        },
      ],
    },
    {
      name: "preferencias",
      label: "Preferencias",
      icon: <Settings />,
      className: "",
      items: [
        {
          name: "resetTour",
          label: "Mostrar recorrido",
          onClick: () => handleResetTour(),
          className: "",
        },
      ],
    },
  ];
  return (
    <>
      <List disablePadding dense className="sidebar_list_container">
        {itemsAux.map((item, index) => (
          <SidebarItem
            key={`${item.name}${index}`}
            label={item.label}
            icon={item.icon}
            className={item.className}
            onClickHandler={() => {
              item.onClick();
              if (props.handleClick) props.handleClick();
            }}
            items={item.items}
            handleGenericClick={props.handleClick}
          />
        ))}
      </List>
      <UserTour />
    </>
  );
};
