import React from "react";
import { Footer } from "../footer/Footer";

export const PublicLayout = (props) => {
  return (
    <>
      {props.children}
      <Footer />
    </>
  );
};
