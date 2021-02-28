import { AuthContext } from "../../../contexts/AuthContext";
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { routes } from "../../../utils/routes/routes";

export const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  return (
    isAuthenticated !== undefined && (
      <Route
        {...rest}
        render={(routeProps) =>
          isAuthenticated ? (
            currentUser && currentUser.emailVerified ? (
              <>
                <RouteComponent {...routeProps} />
              </>
            ) : (
              <Redirect to={routes.verifyEmail.path} />
            )
          ) : (
            <Redirect to={routes.login.path} />
          )
        }
      />
    )
  );
};
