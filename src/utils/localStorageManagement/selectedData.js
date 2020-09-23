const ITEM_NAME = "selected_data";

export const saveSelectedData = (data) => {
  localStorage.setItem(ITEM_NAME, JSON.stringify(data));
};

export const removeSelectedData = () => {
  localStorage.removeItem(ITEM_NAME);
};

export const getSelectedData = () => {
  return JSON.parse(localStorage.getItem(ITEM_NAME));
};
