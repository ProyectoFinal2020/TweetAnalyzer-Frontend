import { Button, IconButton, Tooltip } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import React from "react";
import { get } from "utils/api/api";
import { downloadFile } from "utils/fileDownloader/downloadFile.js";
import "./DownloadButton.scss";

export const DownloadButton = ({
  disabled = false,
  asIcon = false,
  url,
  filename,
  ...rest
}) => {
  const handleDownload = () => {
    get(url).then((response) => downloadFile(response.data, filename));
  };

  return !asIcon ? (
    <Button
      className="btn-download"
      variant="contained"
      color="secondary"
      aria-label="Descargar"
      onClick={handleDownload}
      disabled={disabled}
    >
      <CloudDownloadIcon /> Descargar
    </Button>
  ) : (
    <Tooltip title="Descargar">
      <IconButton aria-label="settings" onClick={handleDownload}>
        <CloudDownloadIcon />
      </IconButton>
    </Tooltip>
  );
};
