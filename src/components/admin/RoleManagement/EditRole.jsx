import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CancelIcon from '@material-ui/icons/Cancel';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import LoadingPage from 'components/LoadingPage'
import { useAuthAPI } from 'store/store';
import { FEATURES } from 'config'
import { showNotification } from 'utils/notifications';
import RoleSettingsTable from './RoleSettingsTable'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'


const useStyles = makeStyles((theme) => ({
  indicator: {
    backgroundColor: '#4051B6'
  },
  titleText: {
    paddingLeft: 24,
    lineHeight: '48px'
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
    paddingLeft: 24
  },
  toolbarSelectRight: {
    display: 'flex',
    alignItems: 'center'
  },
  underTabsDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  footerCell: {
    padding: 0
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 14
  },
  addGroupButton: {
    color: '#147BFC',
    whiteSpace: 'nowrap',
    textTransform: 'none',
    padding: '2px 10px'
  },
}));

function ToolbarSelect({ role, roleGroups, roleMembers, roleFeatures }) {
  const classes = useStyles()
  const [name, setName] = useState(role.name)
  const [showRoleDeletionDialog, setShowRoleDeletionDialog] = useState(false)
  const authAPI = useAuthAPI();
  const history = useHistory()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const saveRole = () => {
    const updatedRole = {
      name,
      groups: roleGroups.map(({ group_id }) => group_id),
      members: roleMembers.map(({ user_id }) => user_id),
      features: roleFeatures.map((feature) => ({
        value: feature.value,
        permission: feature.permission
      }))
    }

    authAPI.post(`/admin/role/${role.id}/update`, {
      data: updatedRole
    }).then(() => {
      history.push('/admin/role_management')
    }).catch(() => {
      showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar)
    });
  }

  return (
    <Paper className={classes.toolbarSelect}>
      <DeleteConfirmationDialog
        show={showRoleDeletionDialog}
        roleName={name}
        onClose={() => setShowRoleDeletionDialog(false)}
        onProceed={() => {
          authAPI.delete(`/admin/role/${role.id}/delete`).then(({ data }) => {
            history.push('/admin/role_management')
          }).catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar)
          });
        }}
      />
      <Typography className={classes.toolbarSelectTitleText}>
        {roleGroups.length} group(s), {roleMembers.length} member(s), {roleFeatures.length} feature(s) selected
      </Typography>
      <div className={classes.toolbarSelectRight}>
        <TextField placeholder="Role Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Tooltip title={"Save"}>
          <IconButton onClick={saveRole}>
            <SaveIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Delete Role"}>
          <IconButton
            onClick={() => setShowRoleDeletionDialog(true)}
          >
            <DeleteForeverIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Cancel and Return"}>
          <IconButton onClick={() => history.push('/admin/role_management')}>
            <CancelIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      </div>
    </Paper>
  )
}


function CreateRole() {
  const authAPI = useAuthAPI();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { roleId } = useParams()

  const [role, setRole] = useState(null)
  const [groups, setGroups] = useState([])
  const [users, setUsers] = useState([])
  const [roleGroups, setRoleGroups] = useState([])
  const [roleMembers, setRoleMembers] = useState([])
  const [roleFeatures, setRoleFeatures] = useState([])

  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Admin', path: '/admin' },
    { text: 'Role Management', path: '/admin/role_management' },
    { text: `Edit ${_.get(role, 'name')}`, path: '/admin/role_management/create_role' },
  ];


  async function getData() {
    try {
      const [groupData, usersData, roleData] = await Promise.all([
        authAPI.get('/admin/user_groups'),
        authAPI.get('/admin/users'),
        authAPI.get(`/admin/role/${roleId}`)
      ])

      const groups = groupData.data.data
      setGroups(groups)

      const users = usersData.data.data
      setUsers(users)

      const role = roleData.data.data
      setRole(role)
      setRoleGroups(role.groups)
      setRoleMembers(role.members)
      setRoleFeatures(role.features)
    } catch (e) {
      showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar)
    }
  }

  async function refreshGroups() {
    const groupData = await authAPI.get('/admin/user_groups')

    const groups = groupData.data.data
    setGroups(groups)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <NavBar />
      {
        role ? (
          <>
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
                ToolbarSelect={() => <ToolbarSelect
                  role={role}
                  roleGroups={roleGroups}
                  roleMembers={roleMembers}
                  roleFeatures={roleFeatures}
                />}
              />
            </main>
          </>
        ) : <LoadingPage />
      }
    </>
  )
}

export default CreateRole
