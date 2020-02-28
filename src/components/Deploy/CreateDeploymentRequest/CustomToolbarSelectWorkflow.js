import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  iconContainer: {
    marginRight: "24px",
  },
  workflowDropdown: {
    width: '300px',
    textAlign: 'left',
  },
}));

const CustomToolbarSelectWorkflow = (props) => {
  const classes = useStyles();
  const { selectedRows, setSelectedRows, displayData, updateBulkWorkflows, deviceList } = props;
  const [workflowValue, setWorkflowValue] = React.useState("");

  //pass the Workflow selected in header back to table
  const updateValue = (val) => {
    setWorkflowValue(val);
    updateBulkWorkflows(val, selectedRows, setSelectedRows, displayData);
  }

  return (
    <div className={classes.iconContainer}>
      <TextField
        className={classes.workflowDropdown}
        name="workflow"
        label="Assign Workflow to Selected Items"
        placeholder="Choose Workflow"
        value={workflowValue}
        onChange={e => {
          updateValue(e.target.value);
        }
        }
        select
      >
        {deviceList.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

export default CustomToolbarSelectWorkflow;