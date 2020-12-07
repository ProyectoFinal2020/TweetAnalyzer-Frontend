import {
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import "./TopicsRemovalDialog.scss";

export const TopicsRemovalDialog = ({
  tweetsTopics,
  open,
  setOpen,
  handleDelete,
  ...props
}) => {
  const [selectedTopics, setSelectedTopics] = React.useState([]);
  const [allSelected, setAllSelected] = React.useState(false);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(tweetsTopics.map((t) => t.topic_title));
    }
    setAllSelected(!allSelected);
  };

  const handleToggle = (value) => () => {
    const currentIndex = selectedTopics.indexOf(value);
    const newChecked = [...selectedTopics];

    if (currentIndex === -1) {
      newChecked.push(value);
      setAllSelected(
        tweetsTopics.every(
          (topic) => newChecked.indexOf(topic.topic_title) !== -1
        )
      );
    } else {
      newChecked.splice(currentIndex, 1);
      setAllSelected(false);
    }

    setSelectedTopics(newChecked);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTopics([]);
    setAllSelected(false);
  };

  const handleDeleteBtn = () => {
    handleDelete(selectedTopics);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">Eliminar temas</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleccione los temas que desea eliminar
        </DialogContentText>
        <List>
          <ListItem key={0} button onClick={handleSelectAll}>
            <ListItemIcon>
              <Tooltip
                title={
                  allSelected ? "Deseleccionar todos" : "Seleccionar todos"
                }
              >
                <Checkbox
                  edge="start"
                  checked={allSelected}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": 0 }}
                />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              id={0}
              primary="Temas almacenados"
              classes={{ root: "list-header-title" }}
            />
          </ListItem>
          <Divider component="li" style={{ height: 2 }} />
          {tweetsTopics
            ? tweetsTopics.map((tweetsTopic, index) => (
                <div key={index + 1}>
                  <ListItem
                    dense
                    button
                    onClick={handleToggle(tweetsTopic.topic_title)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={
                          selectedTopics.indexOf(tweetsTopic.topic_title) !== -1
                        }
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": index + 1 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={index + 1}
                      primary={tweetsTopic.topic_title}
                      secondary={"Espacio usado: " + tweetsTopic.spaceUsed}
                    />
                  </ListItem>
                  <Divider component="li" />
                </div>
              ))
            : null}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleDeleteBtn}
          color="primary"
          variant="contained"
          disabled={selectedTopics.length === 0}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
