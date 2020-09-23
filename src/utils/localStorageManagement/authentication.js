const TOKEN_KEY = "jwt";

export const login = (user) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("selected_data");
};

export const isLoggedIn = () => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY)) ? true : false;
};

export const getUserInformation = () => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
};
