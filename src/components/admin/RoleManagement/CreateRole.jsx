
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';
import { FEATURES } from 'config';
import CreateRoleDialog from './CreateRoleDialog';
import RoleSettingsTable from './RoleSettingsTable';


const useStyles = makeStyles((theme) => ({
  indicator: {
    backgroundColor: '#4051B6',
  },
  titleText: {
    paddingLeft: 24,
    lineHeight: '48px',
  },
  toolbarSelect: {
    height: 64,
    paddingRight: 24,
    backgroundColor: theme.palette.background.default,
    flex: '1 1 100%',
    display: 'flex',
    position: 'relative',
    zIndex: 120,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: typeof theme.spacing === 'function' ? theme.spacing(1) : theme.spacing.unit,
    paddingBottom: typeof theme.spacing === 'function' ? theme.spacing(1) : theme.spacing.unit,
  },
  toolbarSelectTitleText: {
    paddingLeft: 24,
  },
  underTabsDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
}));


function ToolbarSelect({ roleGroups, roleMembers, roleFeatures }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const classes = useStyles();
  const authAPI = useAuthAPI();
  const history = useHistory();
  const createRole = (name) => {
    const role = {
      name,
      groups: roleGroups.map((roleGroup) => roleGroup.group_id),
      members: roleMembers.map((roleMember) => roleMember.user_id),
      features: roleFeatures.map((feature) => ({
        value: feature.value,
        permission: feature.permission,
      })),
    };
    authAPI.post('/admin/role/create', {
      data: role,
    }).then(() => {
      history.push('/admin/role_management');
    }).catch(() => {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    });
  };

  return (
    <Paper className={classes.toolbarSelect}>
      <CreateRoleDialog
        show={showCreateRoleDialog}
        onClose={() => setShowCreateRoleDialog(false)}
        onProceed={createRole}
      />
      <Typography className={classes.toolbarSelectTitleText}>
        {roleGroups.length}
        {' '}
        group(s),
        {roleMembers.length}
        {' '}
        member(s),
        {roleFeatures.length}
        {' '}
        feature(s) selected
      </Typography>
      <Tooltip title="Create Role">
        <IconButton onClick={() => setShowCreateRoleDialog(true)}>
          <GroupWorkIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}

ToolbarSelect.propTypes = {
  roleGroups: PropTypes.arrayOf(PropTypes.shape({
    group_id: PropTypes.number.isRequired,
  })).isRequired,
  roleMembers: PropTypes.arrayOf(PropTypes.shape({
    user_id: PropTypes.number.isRequired,
  })).isRequired,
  roleFeatures: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    permission: PropTypes.string.isRequired,
  })).isRequired,
};

function CreateRole() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Admin', path: '/admin' },
    { text: 'Role Management', path: '/admin/role_management' },
    { text: 'Create Role', path: '/admin/role_management/create_role' },
  ];
  const authAPI = useAuthAPI();

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [roleGroups, setRoleGroups] = useState([]);
  const [roleMembers, setRoleMembers] = useState([]);
  const [roleFeatures, setRoleFeatures] = useState([]);

  async function getData() {
    try {
      const [groupData, usersData] = await Promise.all([
        authAPI.get('/admin/user_groups'),
        authAPI.get('/admin/users'),
      ]);

      setGroups(groupData.data.data);

      setUsers(usersData.data.data);
    } catch (e) {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    }
  }

  async function refreshGroups() {
    const groupData = await authAPI.get('/admin/user_groups');

    setGroups(groupData.data.data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <RoleSettingsTable
          groups={groups}
          members={users}
          features={FEATURES}
          roleGroups={roleGroups}
          setRoleGroups={setRoleGroups}
          roleMembers={roleMembers}
          setRoleMembers={setRoleMembers}
          roleFeatures={roleFeatures}
          setRoleFeatures={setRoleFeatures}
          onRefreshGroups={refreshGroups}
          ToolbarSelect={() => (
            <ToolbarSelect
              roleGroups={roleGroups}
              roleMembers={roleMembers}
              roleFeatures={roleFeatures}
            />
          )}
        />
      </main>
    </>
  );
}

export default CreateRole;
