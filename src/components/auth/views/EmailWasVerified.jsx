import { useEffect, useContext } from "react";
import { routes } from "utils/routes/routes";
import { useHistory } from "react-router-dom";
import { get } from "utils/api/api";
import { logout } from "utils/localStorageManagement/authentication";
import { app } from "utils/firebase/firebase";
import { AuthContext } from "contexts/AuthContext";

export const EmailWasVerified = () => {
  const history = useHistory();
  const { setIsAuthenticated, setSelectedData } = useContext(AuthContext);

  useEffect(() => {
    get("/account/logout").then(() => {
      setSelectedData(undefined);
      logout();
      setIsAuthenticated(false);
      app.auth().signOut();
      history.push(routes.login.path);
    });
  }, [history, setIsAuthenticated, setSelectedData]);

  return null;
};
