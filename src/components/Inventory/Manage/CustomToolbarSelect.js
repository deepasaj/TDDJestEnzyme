import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  iconContainer: {
    marginRight: "24px",
  },
}));

const CustomToolbarSelect = (props) => {
  const { selectedRows, displayData, onRowsDelete, setSelectedRows } = props;
  const classes = useStyles();

  //called when delete in header button clicked
  const deleteRow = () => {
    onRowsDelete(displayData, setSelectedRows, selectedRows);
  }

  return (
    <div className={classes.iconContainer}>
       <Tooltip title="Delete selected device(s)">
        <IconButton aria-label="delete" onClick={deleteRow}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default CustomToolbarSelect;

