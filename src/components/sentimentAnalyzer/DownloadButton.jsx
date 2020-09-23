import { Button } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import React from "react";
import { get } from "utils/api/api.js";
import { downloadFile } from "utils/fileDownloader/downloadFile.js";

export const DownloadButton = ({
  disabled = false,
  url,
  filename,
  ...rest
}) => {
  const handleDownload = () => {
    get(url).then((response) => downloadFile(response.data, filename));
  };

  return (
    <Button
      className="download_button"
      variant="contained"
      color="secondary"
      aria-label="Descargar"
      onClick={handleDownload}
      disabled={disabled}
    >
      <CloudDownloadIcon /> Descargar
    </Button>
  );
};
