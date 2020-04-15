import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  iconContainer: {
    marginRight: '24px',
  },
  workflowDropdown: {
    width: '300px',
    textAlign: 'left',
  },
}));

const CustomToolbarSelectWorkflow = ({
  selectedRows, setSelectedRows, updateBulkWorkflows, deviceList,
}) => {
  const classes = useStyles();
  const [workflowValue, setWorkflowValue] = useState('');

  // pass the Workflow selected in header back to table
  const updateValue = (val) => {
    setWorkflowValue(val);
    updateBulkWorkflows(val, selectedRows, setSelectedRows);
  };

  return (
    <div className={classes.iconContainer}>
      <TextField
        className={classes.workflowDropdown}
        name="workflow"
        label="Assign Workflow to Selected Items"
        placeholder="Choose Workflow"
        value={workflowValue}
        onChange={(e) => {
          updateValue(e.target.value);
        }}
        select
      >
        {deviceList.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

CustomToolbarSelectWorkflow.propTypes = {
  selectedRows: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  deviceList: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  updateBulkWorkflows: PropTypes.func.isRequired,
};

export default CustomToolbarSelectWorkflow;
