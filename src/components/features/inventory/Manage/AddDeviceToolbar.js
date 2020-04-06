import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { useFeaturePermission } from "../hooks";


const useStyles = makeStyles(() => ({
  fab: {
    boxShadow: '0px 0px',
  },
}));

const Toolbar = (props) => {
  const { setShow, setShowButton, setDevice } = props;
  const classes = useStyles();
  const [hasReadAccess, hasWriteAccess] = useFeaturePermission()

  //set to add device view rather than edit with setShowButton
  //open DeviceInfoDialog.js
  //clear device state
  const handleClick = () => {
    setShowButton(false);
    setShow(true);
    setDevice({
      "hostname": "",
      "mgmt_ip": "",
    });
  }

  return hasWriteAccess && (
    <Tooltip title={"Add New Inventory Item"} >
      <IconButton
        aria-label="add"
        className={classes.fab}
        size="medium"
        onClick={handleClick}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
}

export default Toolbar;