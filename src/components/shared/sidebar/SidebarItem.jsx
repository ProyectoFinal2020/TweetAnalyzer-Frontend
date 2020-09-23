import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Typography, Grid } from "@material-ui/core";

export const SidebarItem = ({
  label,
  icon,
  onClickHandler,
  className,
  items,
  depthStep = 40,
  depth = 0,
  handleGenericClick,
  ...rest
}) => {
  return (
    <>
      <ListItem
        button
        dense
        disabled={items && items.length >= 0}
        onClick={onClickHandler}
        className={className}
      >
        <ListItemText style={{ paddingLeft: depth * depthStep }}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="flex-start"
          >
            <Grid item>{icon}</Grid>
            <Grid item>
              <Typography component="p" variant="body1">
                {label}
              </Typography>
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      {Array.isArray(items) ? (
        <List disablePadding dense>
          {items.map((subItem, index) => (
            <SidebarItem
              key={`${subItem.name}${index}`}
              label={subItem.label}
              icon={subItem.icon}
              onClickHandler={() => {
                subItem.onClick();
                if (handleGenericClick) handleGenericClick();
              }}
              className={subItem.className}
              items={subItem.items}
              depthStep={depthStep}
              depth={depth + 1}
            />
          ))}
        </List>
      ) : null}
    </>
  );
};
