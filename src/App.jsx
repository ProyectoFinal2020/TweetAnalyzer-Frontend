import {
  createMuiTheme,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core/styles";
import { PrivateRoute } from "components/auth/routes/PrivateRoute";
import { PublicRoute } from "components/auth/routes/PublicRoute";
import { Header } from "components/shared/header/Header.jsx";
import { HeaderLinks } from "components/shared/header/HeaderLinks.jsx";
import { DefaultLayout } from "components/shared/layout/DefaultLayout.jsx";
import { ScrollToTop } from "components/shared/layout/ScrollToTop.jsx";
import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { theme } from "./assets/custom/jss/theme.js";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomProvider } from "./contexts/CustomContext";
import { routes } from "./utils/routes/routes";

const materialuiTheme = createMuiTheme(theme);

const App = () => {
  return (
    <AuthProvider>
      <StylesProvider injectFirst>
        <ThemeProvider theme={materialuiTheme}>
          <CustomProvider>
            <Router>
              <ScrollToTop />
              <Header
                href={routes.home.path}
                brand="Tweet Analyzer"
                color="dark"
                rightLinks={<HeaderLinks />}
                fixed
              />
              <Switch>
                <PublicRoute
                  restricted={true}
                  exact
                  path={routes.login.path}
                  component={routes.login.component}
                />
                <PublicRoute
                  restricted={true}
                  exact
                  path={routes.signUp.path}
                  component={routes.signUp.component}
                />
                <PublicRoute
                  restricted={true}
                  exact
                  path={routes.passwordReset.path}
                  component={routes.passwordReset.component}
                />
                <PublicRoute
                  exact
                  path={routes.verifyEmail.path}
                  component={routes.verifyEmail.component}
                />
                <PublicRoute
                  exact
                  path={routes.emailWasVerified.path}
                  component={routes.emailWasVerified.component}
                />
                <PublicRoute
                  exact
                  path={routes.home.path}
                  component={routes.home.component}
                />
                <PublicRoute
                  exact
                  path={routes.default.path}
                  component={routes.default.component}
                />
                <DefaultLayout>
                  <PrivateRoute
                    path={routes.emotionAnalyzer.path}
                    component={routes.emotionAnalyzer.component}
                  />
                  <PrivateRoute
                    path={routes.tweets.path}
                    component={routes.tweets.component}
                  />
                  <PrivateRoute
                    path={routes.editReport.path}
                    component={routes.editReport.component}
                  />
                  <PrivateRoute
                    path={routes.createReports.path}
                    component={routes.createReports.component}
                  />
                  <PrivateRoute
                    path={routes.reports.path}
                    component={routes.reports.component}
                  />
                  <PrivateRoute
                    path={routes.reportsList.path}
                    component={routes.reportsList.component}
                  />
                  <PrivateRoute
                    path={routes.similarityAlgorithms.path}
                    component={routes.similarityAlgorithms.component}
                  />
                  <PrivateRoute
                    path={routes.tweetFetcher.path}
                    component={routes.tweetFetcher.component}
                  />
                  <PrivateRoute
                    path={routes.dataSelection.path}
                    component={routes.dataSelection.component}
                  />
                  <PrivateRoute
                    path={routes.sentimentAnalyzer.path}
                    component={routes.sentimentAnalyzer.component}
                  />
                  <PrivateRoute
                    path={routes.frequencyAnalyzer.path}
                    component={routes.frequencyAnalyzer.component}
                  />
                </DefaultLayout>
              </Switch>
            </Router>
          </CustomProvider>
        </ThemeProvider>
      </StylesProvider>
    </AuthProvider>
  );
};

export default App;
