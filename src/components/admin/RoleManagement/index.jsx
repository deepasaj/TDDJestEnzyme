import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import { useAuthAPI } from 'store/store';
import { FEATURES } from 'config';
import { showNotification } from 'utils/notifications';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const useStyles = makeStyles(() => ({
  roleManagement: {
    marginTop: 10,
  },
  customToolbarSelect: {
    marginRight: 24,
  },
  rowExpand: {
    backgroundColor: '#f7f7f7',
    '& td': {
      paddingTop: 9,
      paddingBottom: 9,
    },
  },
  titleField: {
    width: '200px',
  },
  tasks: {
    marginTop: '10px',
    float: 'left',
  },
  emptyRow: {
    textAlign: 'center',
    backgroundColor: '#F5F5F5',
  },
  roTitleField: {
    width: '200px',
  },
  root: {
    cursor: 'default',
  },
  input: {
    cursor: 'default',
  },
}));

const theme = createMuiTheme({
  overrides: {
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

function RoleManagement() {
  const classes = useStyles();
  const history = useHistory();
  const authAPI = useAuthAPI();
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Admin', path: '/admin' },
    { text: 'Role Management', path: '/admin/role_management' },
  ];

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [rowsSelected, setRowsSelected] = useState([]);
  const [rolesToDelete, setRolesToDelete] = useState([]);
  const [data, setData] = useState([]);

  const columns = [
    {
      name: 'name',
      label: 'Role Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'groups',
      label: 'Group',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <div>
            {value.length}
          </div>
        ),
      },
    },
    {
      name: 'members',
      label: 'Membership',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <div>
            {value.length}
          </div>
        ),
      },
    },
    {
      name: 'features',
      label: 'Features',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <div>
            {value.length}
          </div>
        ),
      },
    },
    {
      name: 'Actions',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => (
          <>
            <Tooltip title="Edit">
              <span>
                <IconButton
                  aria-label="edit"
                  onClick={() => history.push(`/admin/role_management/edit_role/${data[tableMeta.rowIndex].id}`)}
                  className={classes.editButton}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <span>
                <IconButton
                  aria-label="delete"
                  onClick={() => setRolesToDelete([data[tableMeta.rowIndex]])}
                  className={classes.action_btn}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </>
        ),
      },
    },
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'scrollFullHeight',
    selectableRows: 'multiple',
    rowsPerPage: 10,
    print: false,
    expandableRows: true,
    rowsSelected,
    onRowsSelect: (currentRowsSelected, allRowsSelected) => {
      setRowsSelected(allRowsSelected.map(({ dataIndex }) => dataIndex));
    },
    rowsPerPageOptions: [5, 10, 15],
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
    renderExpandableRow: (rowData, rowMeta) => {
      const { groups, members, features } = data[rowMeta.dataIndex];

      const rows = _.zip(groups, members, features);

      return (
        <>
          {
            rows.map(([group, member, feature]) => {
              let featureLabel;
              if (feature) {
                const permission = feature.permission === 'read-write' ? ' (ReadWrite)' : ' (ReadOnly)';
                featureLabel = _.find(FEATURES, { value: feature.value }).label + permission;
              }
              return (
                <TableRow className={classes.rowExpand} key={`${group}-${member}-${featureLabel}`}>
                  <TableCell />
                  <TableCell />
                  <TableCell>{group}</TableCell>
                  <TableCell>{member}</TableCell>
                  <TableCell>{featureLabel}</TableCell>
                  <TableCell />
                </TableRow>
              );
            })
          }
        </>
      );
    },
    customToolbarSelect: () => (
      <div className={classes.customToolbarSelect}>
        <Tooltip title="Delete">
          <span>
            <IconButton
              aria-label="delete"
              onClick={() => setRolesToDelete(rowsSelected.map((index) => data[index]))}
              className={classes.action_btn}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>

    ),
    customToolbar: () => (
      <>
        <Tooltip title="Create New Role">
          <IconButton
            aria-label="add"
            className={classes.fab}
            size="medium"
            onClick={() => history.push('/admin/role_management/create_role')}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </>
    ),
  };

  async function getData() {
    try {
      const { data } = await authAPI.get('/admin/roles');
      setData(data.data);
    } catch (e) {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        {
          rolesToDelete.length > 0 && (
            <DeleteConfirmationDialog
              show
              roleName={rolesToDelete.map(({ name }) => name).join(', ')}
              onClose={() => setRolesToDelete([])}
              onProceed={async () => {
                try {
                  await Promise.all(rolesToDelete.map((role) => authAPI.delete(`/admin/role/${role.id}/delete`)));

                  getData();
                  setRolesToDelete([]);
                  setRowsSelected([]);
                } catch (e) {
                  showNotification(
                    'There was an error contacting the database. Please contact administrator.',
                    'error', enqueueSnackbar,
                    closeSnackbar,
                  );
                }
              }}
            />
          )
        }
        <MuiThemeProvider theme={theme}>
          <MUIDataTable
            className={classes.roleManagement}
            title="Role Management"
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </main>
    </>
  );
}

export default RoleManagement;
