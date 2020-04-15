import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import { makeStyles } from '@material-ui/core/styles';
import TitlePopUp from './TitleDialog';

const useStyles = makeStyles(() => ({
  iconContainer: {
    marginRight: '24px',
  },
}));

const DeploymentGroupCustomToolbarSelect = ({
  selectedRows, displayData, groupId, setGroupId,
}) => {
  const classes = useStyles();
  const [showSetTitle, setShowSetTitle] = useState(false);

  // show TitleDialog when create deployment group button clicked
  const handleClickGroupDevicesSelected = () => {
    setShowSetTitle(true);
  };

  return (
    <>
      <div className={classes.iconContainer}>
        <Tooltip title="Create Deployment Group">
          <IconButton
            onClick={() => { handleClickGroupDevicesSelected(); }}
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
    </>
  );
};

DeploymentGroupCustomToolbarSelect.propTypes = {
  selectedRows: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  groupId: PropTypes.string.isRequired,
  setGroupId: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  displayData: PropTypes.array.isRequired,
};

export default DeploymentGroupCustomToolbarSelect;
