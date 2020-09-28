import { get } from "utils/api/api.js";
import React, { useEffect, useState } from "react";
import {
  getUserInformation,
  isLoggedIn,
  login,
} from "utils/localStorageManagement/authentication";
import { getSelectedData } from "utils/localStorageManagement/selectedData";
import { getUserTour } from "utils/localStorageManagement/userTour";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    isLoggedIn() ? true : undefined
  );
  const [currentUser, setCurrentUser] = useState(
    isLoggedIn() ? getUserInformation() : undefined
  );
  let dataInStorage = getSelectedData();
  const [selectedData, setSelectedData] = useState(
    dataInStorage ? dataInStorage : undefined
  );
  let userTourAux = getUserTour();
  const [userTour, setUserTour] = useState(
    isLoggedIn() && userTourAux ? userTourAux : true
  );

  useEffect(() => {
    let isSubscribed = true;
    get("/account/isAuthenticated").then((response) => {
      setIsAuthenticated(response.data);
      if (response.data && isSubscribed) {
        get("/account/userInformation").then((response) => {
          if (isSubscribed) {
            login(response.data);
            setCurrentUser(response.data);
          }
        });
      }
    });
    return () => (isSubscribed = false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        setIsAuthenticated,
        setCurrentUser,
        selectedData,
        setSelectedData,
        userTour,
        setUserTour,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
