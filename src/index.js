import React from "react";
import ReactDOM from "react-dom";
import "./assets/material-kit/css/material-kit-react.css?v=1.8.0";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "react-fake-tweet/dist/index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./assets/mdbreact/scss/mdb.scss";
import "./assets/custom/scss/export.scss";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
