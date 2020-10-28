import axios from "axios";

export const initializeInterceptors = (
  setLoading,
  setSnackbarItem,
  setShowSnackbar
) => {
  axios.interceptors.request.use(
    (config) => {
      setLoading(true);
      return config;
    },
    (error) => {
      setLoading(false);
      setSnackbarItem({
        severity: "error",
        message: error.response ? error.response.data : error.message,
      });
      setShowSnackbar(true);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      setLoading(false);
      return response;
    },
    (error) => {
      setLoading(false);
      setSnackbarItem({
        severity: "error",
        message: error.response ? error.response.data : error.message,
      });
      setShowSnackbar(true);
      return Promise.reject(error);
    }
  );
};
