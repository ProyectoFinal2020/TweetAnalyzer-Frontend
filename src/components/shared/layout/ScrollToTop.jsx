import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls the window up on every navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
