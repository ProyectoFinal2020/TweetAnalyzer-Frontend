import { PublicLayout } from "../../shared/layout/PublicLayout";
import { AuthContext } from "../../../contexts/AuthContext";
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { routes } from "../../../utils/routes/routes";

export const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    isAuthenticated !== undefined && (
      <PublicLayout>
        <Route
          {...rest}
          render={(props) =>
            isAuthenticated && restricted ? (
              <Redirect to={routes.home.path} />
            ) : (
              <Component {...props} />
            )
          }
        />
      </PublicLayout>
    )
  );
};
