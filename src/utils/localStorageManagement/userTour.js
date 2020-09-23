const ITEM_NAME = "user_tour";

export const saveUserTour = (data) => {
  localStorage.setItem(ITEM_NAME, JSON.stringify(data));
};

export const removeUserTour = () => {
  localStorage.removeItem(ITEM_NAME);
};

export const getUserTour = () => {
  return JSON.parse(localStorage.getItem(ITEM_NAME));
};
