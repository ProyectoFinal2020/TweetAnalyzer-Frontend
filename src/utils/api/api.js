import axios from "axios";

const SERVER_DOMAIN = process.env.REACT_APP_ENDPOINT;

const getHeaders = () => {
  return {
    headers: {
      Accept: "application/json",
      Contentype: "application/json",
    },
    withCredentials: true,
  };
};

export const get = (path) => {
  return axios.get(SERVER_DOMAIN + path, getHeaders());
};

export const getById = (path, id) => {
  return axios.get(SERVER_DOMAIN + path + "/" + id, getHeaders());
};

export const post = (path, data) => {
  return axios.post(`${SERVER_DOMAIN}${path}`, data, getHeaders());
};
export const put = (path, data) => {
  return axios.put(`${SERVER_DOMAIN}${path}`, data, getHeaders());
};

export const deleteBatch = (path, data) => {
  return axios.delete(`${SERVER_DOMAIN}${path}`, {
    headers: {
      Accept: "application/json",
      Contentype: "application/json",
    },
    withCredentials: true,
    data: data,
  });
};
