import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import { makeStyles } from "@material-ui/core/styles";
import TitlePopUp from './TitleDialog';

const useStyles = makeStyles(() => ({
  iconContainer: {
    marginRight: "24px",
  },
}));

const DeploymentGroupCustomToolbarSelect = (props) => {
  const { selectedRows, displayData, groupId, setGroupId } = props;
  const classes = useStyles();
  const [showSetTitle, setShowSetTitle] = React.useState(false);

  //show TitleDialog.js when create deployment group button clicked
  const handleClickGroupDevicesSelected = () => {
    setShowSetTitle(true);
  };

  return (
    <React.Fragment>
    <div className={classes.iconContainer}>
      <Tooltip title={"Create Deployment Group"}>
        <IconButton
          onClick={() => { handleClickGroupDevicesSelected() }}
        >
          <GroupWorkIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
    </div>
     <TitlePopUp
        showSetTitle={showSetTitle}
        setShowSetTitle={setShowSetTitle}
        groupId={groupId}
        selectedRows={selectedRows}
        displayData={displayData}
        setGroupId={setGroupId}
      />
    </React.Fragment>
  );
}

export default DeploymentGroupCustomToolbarSelect;