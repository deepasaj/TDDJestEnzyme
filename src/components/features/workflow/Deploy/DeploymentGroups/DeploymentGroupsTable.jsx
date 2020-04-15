import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import LoadingPage from 'components/LoadingPage';
import { useHistory } from 'react-router-dom';
import { useUser, useAuthAPI, useIsAdmin } from 'store/store';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';

import DeleteConfirmModal from './DeleteConfirmationDialog';
import CustomToolbar from './DeploymentGroupCustomToolbar';
import { useFeaturePermission } from '../../hooks';


const useStyles = makeStyles(() => ({
  rowExpand: {
    backgroundColor: '#f7f7f7',
  },
  table: {
    boxShadow: '0px 0px 0px 0px',
    border: '1px solid #e3e3e3',
    borderRadius: '5px',
  },
  btn_primary: {
    marginLeft: '10px',
    marginRight: '25px',
  },
  edit_btn: {
    marginRight: '10px',
    padding: 6,
  },
  titleField: {
    width: '200px',
  },
  emptyRow: {
    textAlign: 'center',
    backgroundColor: '#F5F5F5',
  },
}));

const tableTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '6px 16px 6px 16px',
      },
    },
  },
});

const subNullsForEmptyStrings = (rows) => rows.map((row) => ({
  ...row,
  name: row.name || '',
}));


const DeploymentGroupsTable = () => {
  const history = useHistory();
  const authAPI = useAuthAPI();
  const [, hasWriteAccess] = useFeaturePermission();
  const isAdmin = useIsAdmin();

  const user = useUser();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState();
  const [displayDeployments, setDisplayDeployments] = useState([]);
  const [title, setTitle] = useState(""); // eslint-disable-line
  const [titleRow, setTitleRow] = useState(); // eslint-disable-line
  const [submitTitle, setSubmitTitle] = useState(true); // eslint-disable-line
  const [editRow, setEditRow] = useState({}); // eslint-disable-line
  const [loadingDone, setLoadingDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // eslint-disable-line
  const [expandRow, setExpandRow] = useState([]); // eslint-disable-line
  const [groupId, setGroupId] = useState(-1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [show, setShow] = useState(false); // eslint-disable-line


  // redirect to create deployment group request table with specified deployment_id
  const handleOpenDeployments = (tableMeta) => {
    const deploymentId = tableMeta.rowData[0];
    history.push(`/workflow/deploy/deployment/create/${deploymentId}`);
  };

  // redirect to edit deployment group to edit deployment group
  const handleEditDeployments = (tableMeta) => {
    const deploymentId = tableMeta.rowData[0];
    history.push(`/workflow/deploy/group/edit/${deploymentId}`);
  };

  // closes dialogs if cancel is clicked
  const handleClose = () => {
    setShow(false);
    setShowDeleteConfirm(false);
  };

  const refreshDevices = () => {
    authAPI.get('/workflow/get_back_ref/deploy')
      .then((response) => {
        const deploymentGroups = subNullsForEmptyStrings(response.data.data);
        deploymentGroups.forEach((deploymentGroup) => {
          setData((previous) => ({ ...previous, [`row${deploymentGroup.id}`]: deploymentGroup.devices }));
        });
        setDisplayDeployments(deploymentGroups);
        setLoadingDone(true);
      })
      .catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error', enqueueSnackbar,
          closeSnackbar,
        );
      });
  };

  // handle single row deletion
  const handleDelete = () => {
    authAPI.delete(`/workflow/get_back_ref/deploy/id:${groupId}`)
      .then(() => {
        setShowDeleteConfirm(false);
        setLoadingDone(false);
        refreshDevices();
      }).catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error', enqueueSnackbar,
          closeSnackbar,
        );
      });
  };

  // called if inline delete button clicked
  // provides needed information for confirmation dialog
  const inLineDelete = (event, id) => {
    setGroupId(id);
    setShowDeleteConfirm(true);
  };

  const columns = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'name',
      label: 'Title',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'user.display_name',
      label: 'Owner',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'timestamp',
      label: 'Timestamp',
      options: {
        filter: true,
        sort: true,
        sortDirection: 'desc',
        filterOptions: {
          names: ['Last 7 days', 'Last 14 days', 'Last 30 days'],
          logic(timestamp, filterVal) {
            const pastWeekDate = new Date();
            pastWeekDate.setDate(pastWeekDate.getDate() - 7);
            const pastTwoWeeksDate = new Date();
            pastTwoWeeksDate.setDate(pastTwoWeeksDate.getDate() - 14);
            const pastMonthDate = new Date();
            pastMonthDate.setDate(pastMonthDate.getDate() - 30);
            const timestampDate = new Date(timestamp);

            const show = (filterVal.indexOf('Last 7 days') >= 0 && timestampDate.getTime() >= pastWeekDate.getTime())
              || (filterVal.indexOf('Last 14 days') >= 0 && timestampDate.getTime() >= pastTwoWeeksDate.getTime())
              || (filterVal.indexOf('Last 30 days') >= 0 && timestampDate.getTime() >= pastMonthDate.getTime());
            return !show;
          },
        },
      },
    },
    {
      name: 'Deployment',
      options: {
        display: hasWriteAccess,
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRender: (value, tableMeta) => {
          let ownsGroup = true;
          if (tableMeta.rowData) {
            if (tableMeta.rowData[2] === user.display_name) {
              ownsGroup = false;
            }
          }
          if (isAdmin) {
            ownsGroup = false;
          }
          return (
            <>
              <Button
                color="primary"
                variant="contained"
                onClick={() => { handleOpenDeployments(tableMeta); }}
                className={classes.primary_btn}
                disabled={ownsGroup}
              >
                Create
              </Button>
            </>

          );
        },
      },
    },
    {
      name: 'Actions',
      options: {
        display: hasWriteAccess,
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRender: (value, tableMeta) => {
          let ownsGroup = true;
          if (tableMeta.rowData) {
            if (tableMeta.rowData[2] === user.display_name) {
              ownsGroup = false;
            }
          }
          if (isAdmin) {
            ownsGroup = false;
          }
          return (
            <>
              <Tooltip title="Edit">
                <span>
                  <IconButton
                    aria-label="edit"
                    onClick={() => { handleEditDeployments(tableMeta); }}
                    className={classes.edit_btn}
                    disabled={ownsGroup}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Delete">
                <span>
                  <IconButton
                    aria-label="delete"
                    onClick={(event) => { inLineDelete(event, tableMeta.rowData[0]); }}
                    className={classes.edit_btn}
                    disabled={ownsGroup}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </>

          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'scrollFullHeight',
    selectableRows: 'none',
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    print: false,
    expandableRows: true,
    customSort: (data, colIndex, order) => {
      // sort differently if column is date
      if (colIndex === 3) {
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
    renderExpandableRow: (rowData) => {
      const colSpan = rowData.length + 1;
      const rowList = `row${rowData[0]}`;
      let mapList = [];
      let emptyRow = true;

      // do null checks to avoid front end errors
      // if they pass, set mapList which will be list of devices that are attached to that deployment group
      // if no devices under that group, display message
      if (data) {
        if (data[rowList]) {
          mapList = data[rowList];
          if (mapList.length > 0) {
            emptyRow = false;
          }
        }
      }

      return (
        <>
          {emptyRow ? (
            <TableRow>
              <TableCell colSpan={colSpan} className={classes.emptyRow}>
                No devices found for Deployment Group
                {' '}
                {rowData[0]}
                .
              </TableCell>
            </TableRow>
          ) : (
            <TableRow
              tabIndex={-1}
              className={classes.rowExpand}
            >
              <TableCell colSpan={colSpan} align="center">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Hostname</TableCell>
                      <TableCell alight="right">Management IP</TableCell>
                    </TableRow>
                  </TableHead>
                  {mapList.map((row) => (
                    <TableBody key={row.hostname} className={classes.rowExpand}>
                      <TableRow key={row.hostname} className={classes.rowExpand}>
                        <TableCell alight="left">
                          {row.hostname}
                        </TableCell>
                        <TableCell alight="right">{row.mgmt_ip}</TableCell>
                      </TableRow>
                    </TableBody>
                  ))}

                </Table>
              </TableCell>
            </TableRow>
          )}
        </>
      );
    },
    customToolbar: () => (
      <CustomToolbar />
    ),
  };

  useEffect(() => {
    authAPI.get('/workflow/get_back_ref/deploy')
      .then((response) => {
        const deploymentGroups = subNullsForEmptyStrings(response.data.data);
        deploymentGroups.forEach((deploymentGroup) => {
          setData((previous) => ({ ...previous, [`row${deploymentGroup.id}`]: deploymentGroup.devices }));
        });
        setDisplayDeployments(deploymentGroups);
        setLoadingDone(true);
      })
      .catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error', enqueueSnackbar,
          closeSnackbar,
        );
      });
  }, []);

  return (
    <>
      {loadingDone ? (
        <>
          <MuiThemeProvider theme={tableTheme}>
            <MUIDataTable
              title="Deployment Groups"
              data={displayDeployments}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
          <DeleteConfirmModal
            showDeleteConfirm={showDeleteConfirm}
            handleClose={handleClose}
            handleDelete={handleDelete}
            deploymentGroup={groupId}
          />
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default DeploymentGroupsTable;
