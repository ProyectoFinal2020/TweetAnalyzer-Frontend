import Chip from "@material-ui/core/Chip";
import React from "react";

export const TagChips = ({ items, setItems, ...rest }) => {
  const handleDelete = (chipToDelete) => () => {
    setItems((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  return (
    <ul className="deleteable_chips">
      {items.map((data, key) => {
        return (
          <li key={key}>
            <Chip
              label={data}
              color="primary"
              onDelete={handleDelete(data)}
              className="chip"
            />
          </li>
        );
      })}
    </ul>
  );
};
