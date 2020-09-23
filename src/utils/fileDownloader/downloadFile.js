export const downloadFile = async (data, title) => {
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  const href = await URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = title + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
