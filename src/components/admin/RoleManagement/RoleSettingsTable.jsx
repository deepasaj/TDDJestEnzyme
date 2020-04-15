import _ from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import MUIDataTable, { TablePagination } from 'mui-datatables';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createMuiTheme, MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';
import AddGroupDialog from './AddGroupDialog';
import EditGroupDialog from './EditGroupDialog';

const tableTheme = createMuiTheme({
  overrides: {
    MUIDataTable: {
      paper: {
        boxShadow: 'none',
      },
    },
    MUIDataTableToolbar: {
      root: {
        display: 'none',
      },
    },
    MUIDataTableToolbarSelect: {
      root: {
        display: 'none',
      },
    },
    MUIDataTableFilterList: {
      root: {
        display: 'none',
      },
    },
    MUIDataTableHeadCell: {
      root: {
        padding: '0px 15px 0px 15px',
      },
    },
    MUIDataTableBodyCell: {
      root: {
        padding: '0px 15px 0px 15px',
      },
    },
    MUIDataTableBody: {
      emptyTitle: {
        padding: 16,
      },
    },
  },
});

const toolbarTheme = createMuiTheme({
  overrides: {
    MUIDataTable: {
      paper: {
        boxShadow: 'none',
      },
    },
    MUIDataTableHead: {
      main: {
        display: 'none',
      },
    },
    MUIDataTableBodyRow: {
      root: {
        display: 'none',
      },
    },
    MUIDataTablePagination: {
      root: {
        display: 'none',
      },
    },
  },
});


const useStyles = makeStyles((theme) => ({
  roleSettings: {
    marginTop: 10,
  },
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
  tabs: {
    position: 'relative',
  },
  underTabsDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerCell: {
    padding: 0,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 14,
  },
  addGroupButton: {
    color: '#147BFC',
    whiteSpace: 'nowrap',
    textTransform: 'none',
    padding: '2px 10px',
  },
}));


const RoleSettingsTable = ({
  groups,
  members,
  features,
  roleGroups,
  setRoleGroups,
  roleMembers,
  setRoleMembers,
  roleFeatures,
  setRoleFeatures,
  onRefreshGroups,
  ToolbarSelect,
}) => {
  const classes = useStyles();
  const authAPI = useAuthAPI();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [tab, setTab] = useState('groups');
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);

  const [groupsFilterLists, setGroupsFilterLists] = useState([], []);
  const [membershipFilterLists, setMembershipFilterLists] = useState([], [], []);
  const [featureFilterLists, setFeatureFilterLists] = useState([], [], []);

  const [groupsSearchText, setGroupsSearchText] = useState('');
  const [membershipSearchText, setMembershipSearchText] = useState('');
  const [featuresSearchText, setFeaturesSearchText] = useState('');

  const groupsColumns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        filterList: groupsFilterLists[0],
      },
    },
    {
      name: 'added',
      label: 'Date/Time Added',
      options: {
        filterList: groupsFilterLists[1],
        customBodyRender: (value, tableMeta) => {
          const groupId = groups[tableMeta.rowIndex].id;
          const roleGroup = _.find(roleGroups, { group_id: groupId });
          return (
            <div>{roleGroup && roleGroup.added}</div>
          );
        },
      },
    },
    {
      name: 'Actions',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => (
          <Tooltip title="Edit">
            <span>
              <IconButton
                aria-label="edit"
                onClick={() => setGroupToEdit(groups[tableMeta.rowIndex])}
                className={classes.editButton}
              >
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
        ),
      },
    },
  ];

  const membershipColumns = [
    {
      name: 'display_name',
      label: 'Name',
      options: {
        filter: true,
        filterList: membershipFilterLists[0],
      },
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: true,
        filterList: membershipFilterLists[1],
      },
    },
    {
      name: 'added',
      label: 'Date/Time Added',
      options: {
        filter: true,
        filterList: membershipFilterLists[2],
        customBodyRender: (value, tableMeta) => {
          const memberId = members[tableMeta.rowIndex].id;
          const roleMember = _.find(roleMembers, { user_id: memberId });
          return (
            <div>{roleMember && roleMember.added}</div>
          );
        },
      },
    },
  ];

  const featuresColumns = [
    {
      name: 'label',
      label: 'Name',
      options: {
        filter: true,
        filterList: featureFilterLists[0],
      },
    },
    {
      name: 'permission',
      label: 'Permission',
      options: {
        filter: true,
        filterList: featureFilterLists[1],
        customBodyRender: (value, { rowIndex }) => {
          const roleFeatureIndex = _.findIndex(roleFeatures, { value: features[rowIndex].value });
          const roleFeature = roleFeatures[roleFeatureIndex];
          return roleFeatureIndex !== -1 && (
            <Select
              disableUnderline
              displayEmpty
              classes={{ root: classes.selectPermission }}
              value={roleFeature.permission || ''}
              onChange={(e) => setRoleFeatures(
                roleFeatures.map(
                  (feature, index) => (index === roleFeatureIndex
                    ? ({
                      ...feature,
                      permission: e.target.value,
                    }) : feature),
                ),
              )}
            >
              <MenuItem disabled value="">
                Select Permission
              </MenuItem>
              <MenuItem value="read-only">Read Only</MenuItem>
              <MenuItem value="read-write">Read Write</MenuItem>
            </Select>
          );
        },
      },
    },
    {
      name: 'added',
      label: 'Date/Time Added',
      options: {
        filter: true,
        filterList: featureFilterLists[2],
        customBodyRender: (value, tableMeta) => {
          const feature = features[tableMeta.rowIndex].value;
          const roleFeature = _.find(roleFeatures, { value: feature });
          return (
            <div>{roleFeature && roleFeature.added}</div>
          );
        },
      },
    },
  ];

  let data;
  let columns;
  let rowsSelected;
  let onRowsSelect;
  let searchText;

  if (tab === 'groups') {
    data = groups;
    columns = groupsColumns;
    rowsSelected = roleGroups.map((roleGroup) => {
      const index = _.findIndex(groups, { id: roleGroup.group_id });
      return index;
    });
    onRowsSelect = (currentRowsSelected, allRowsSelected) => {
      setRoleGroups(
        allRowsSelected.map(({ dataIndex }) => {
          const group = groups[dataIndex];
          const roleGroup = _.find(roleGroups, { group_id: group.id });
          if (roleGroup) {
            return roleGroup;
          }
          return {
            group_id: group.id,
            added: '',
          };
        }),
      );
    };
    searchText = groupsSearchText;
  } else if (tab === 'membership') {
    data = members;
    columns = membershipColumns;
    rowsSelected = roleMembers.map((roleMember) => {
      const index = _.findIndex(members, { id: roleMember.user_id });
      return index;
    });
    onRowsSelect = (currentRowsSelected, allRowsSelected) => {
      setRoleMembers(
        allRowsSelected.map(({ dataIndex }) => {
          const member = members[dataIndex];
          const roleMember = _.find(roleMembers, { user_id: member.id });
          if (roleMember) {
            return roleMember;
          }
          return {
            user_id: member.id,
            added: '',
          };
        }),
      );
    };
    searchText = membershipSearchText;
  } else if (tab === 'features') {
    data = features;
    columns = featuresColumns;
    rowsSelected = roleFeatures.map(({ value }) => {
      const index = _.findIndex(features, { value });
      return index;
    });
    onRowsSelect = (currentRowsSelected, allRowsSelected) => {
      setRoleFeatures(
        allRowsSelected.map(({ dataIndex }) => {
          const feature = features[dataIndex];
          const roleFeature = _.find(roleFeatures, { value: feature.value });
          if (roleFeature) {
            return roleFeature;
          }
          return {
            value: feature.value,
            permission: '',
            added: '',
          };
        }),
      );
    };
    searchText = featuresSearchText;
  }

  const options = {
    download: false,
    print: false,
    pagination: true,
    responsive: 'scrollFullHeight',
    selectableRows: 'multiple',
    rowsPerPage: 10,
    disableToolbarSelect: true,
    searchText,
    expandableRows: false,
    rowsPerPageOptions: [5, 10, 15],
    rowsSelected,
    onRowsSelect,
    onTableChange: (action, tableState) => {
      if (action === 'filterChange') {
        if (tab === 'groups') {
          setGroupsFilterLists(tableState.filterList);
        } else if (tab === 'membership') {
          setMembershipFilterLists(tableState.filterList);
        } else if (tab === 'features') {
          setFeatureFilterLists(tableState.filterList);
        }
      } else if (action === 'search') {
        if (tab === 'groups') {
          setGroupsSearchText(tableState.searchText);
        } else if (tab === 'membership') {
          setMembershipSearchText(tableState.searchText);
        } else if (tab === 'features') {
          setFeaturesSearchText(tableState.searchText);
        }
      }
    },
    customSort: (data, colIndex, order) => {
      // custom sort if datetime
      if (colIndex === 2) {
        if (order === 'asc') {
          return data.sort((a, b) => new Date(a.data[colIndex]) - new Date(b.data[colIndex]));
        } if (order === 'desc') {
          return data.sort((a, b) => new Date(b.data[colIndex]) - new Date(a.data[colIndex]));
        }
      } else {
        if (order === 'asc') {
          return data.sort((a, b) => (a.data[colIndex] < b.data[colIndex] ? 1 : -1));
        } if (order === 'desc') {
          return data.sort((a, b) => (a.data[colIndex] < b.data[colIndex] ? -1 : 1));
        }
      }
      throw new Error('Unexpected order value');
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabelsPagination) => {
      if (tab === 'groups') {
        return (
          <TableBody>
            <TableRow>
              <TableCell className={classes.footerCell}>
                <div className={classes.footer}>
                  <Button
                    className={classes.addGroupButton}
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddGroupDialog(true)}
                  >
                    Add Group
                  </Button>
                  <Table>
                    <TablePagination
                      count={count}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      changeRowsPerPage={changeRowsPerPage}
                      changePage={changePage}
                      component="div"
                      options={{
                        textLabels: {
                          pagination: textLabelsPagination,
                        },
                      }}
                    />
                  </Table>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        );
      }
      return (
        <TablePagination
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
          component="div"
          options={{
            textLabels: {
              pagination: textLabelsPagination,
            },
          }}
        />
      );
    },
  };

  const showToolbarSelect = roleGroups.length || roleMembers.length || roleFeatures.length;

  return (
    <Paper className={classes.roleSettings} elevation={4}>
      <AddGroupDialog
        show={showAddGroupDialog}
        onClose={() => setShowAddGroupDialog(false)}
        onFinish={onRefreshGroups}
      />
      {
        groupToEdit && (
          <EditGroupDialog
            initialName={groupToEdit.name}
            onClose={() => setGroupToEdit(null)}
            onProceed={(newName) => {
              authAPI.patch(`/admin/user_group/${groupToEdit.id}/update`, {
                data: {
                  name: newName,
                },
              }).then(() => {
                onRefreshGroups();
                setGroupToEdit(null);
              }).catch(() => {
                showNotification(
                  'There was an error contacting the database. Please contact administrator.',
                  'error', enqueueSnackbar,
                  closeSnackbar,
                );
              });
            }}
          />
        )
      }
      {
        showToolbarSelect ? <ToolbarSelect /> : (
          <MuiThemeProvider theme={toolbarTheme}>
            <MUIDataTable
              title="Select Group, Membership and Feature"
              options={{
                ...options,
                customFooter() {
                  return <></>;
                },
              }}
              data={data}
              columns={columns}
            />
          </MuiThemeProvider>
        )
      }
      <div className={classes.tabs}>
        <Tabs indicatorColor="primary" value={tab} onChange={(e, value) => setTab(value)}>
          <Tab value="groups" label="groups" />
          <Tab value="membership" label="Membership" />
          <Tab value="features" label="Feature" />
        </Tabs>
        <Divider className={classes.underTabsDivider} />
      </div>
      <MuiThemeProvider theme={tableTheme}>
        <MUIDataTable
          title=""
          data={data}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    </Paper>
  );
};

RoleSettingsTable.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    display_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })).isRequired,
  features: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  roleGroups: PropTypes.arrayOf(PropTypes.shape({
    added: PropTypes.string.isRequired,
    group_id: PropTypes.number.isRequired,
  })).isRequired,
  roleMembers: PropTypes.arrayOf(PropTypes.shape({
    added: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
  })).isRequired,
  roleFeatures: PropTypes.arrayOf(PropTypes.shape({
    added: PropTypes.string.isRequired,
    permission: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  setRoleGroups: PropTypes.func.isRequired,
  setRoleMembers: PropTypes.func.isRequired,
  setRoleFeatures: PropTypes.func.isRequired,
  onRefreshGroups: PropTypes.func.isRequired,
  ToolbarSelect: PropTypes.elementType.isRequired,
};

export default RoleSettingsTable;
