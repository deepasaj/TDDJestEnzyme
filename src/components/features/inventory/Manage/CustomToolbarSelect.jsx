import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  iconContainer: {
    marginRight: '24px',
  },
}));

const CustomToolbarSelect = ({
  selectedRows, onRowsDelete,
}) => {
  const classes = useStyles();

  // called when delete in header button clicked
  const deleteRow = () => {
    onRowsDelete(selectedRows);
  };

  return (
    <div className={classes.iconContainer}>
      <Tooltip title="Delete selected device(s)">
        <IconButton aria-label="delete" onClick={deleteRow}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

CustomToolbarSelect.propTypes = {
  selectedRows: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  onRowsDelete: PropTypes.func.isRequired,
};

export default CustomToolbarSelect;
