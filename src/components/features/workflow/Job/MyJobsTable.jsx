import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { useUser, useAuthAPI, useIsAdmin } from 'store/store';
import { showNotification } from 'utils/notifications';

import JobsToolbar from './JobsToolbar';
import { useFeaturePermission } from '../hooks';

const useStyles = makeStyles(() => ({
  rowExpand: {
    backgroundColor: '#f7f7f7',
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

const tableTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '6px 16px 6px 16px',
      },
    },
  },
});

const Jobs = () => {
  const history = useHistory();
  const classes = useStyles();
  const authAPI = useAuthAPI();
  const [, hasWriteAccess] = useFeaturePermission();
  const isAdmin = useIsAdmin();

  const user = useUser();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [displayJobs, setDisplayJobs] = useState([]);
  const [editRow, setEditRow] = useState({});
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [filter, setFilter] = useState([[], [], [], [], [], [], []]);
  const [sort, setSort] = useState(['none', 'none', 'desc', 'none', 'none', 'none', 'none']);
  const [displayList, setDisplayList] = useState(['true', 'true', 'true', 'true', 'true', 'true', 'false']);

  const query = queryString.parse(history.location.search);
  const workflowType = query.workflow_type;

  useEffect(() => {
    const workflowColumnIndex = 6;
    if (workflowType) setFilter(filter.map((list, index) => (index === workflowColumnIndex ? [workflowType] : list)));
    else setFilter(filter.map((list, index) => (index === workflowColumnIndex ? [] : list)));
  }, [workflowType, history.location.key]);

  // open tasks table for specific job
  const handleTask = (rowMeta) => {
    const jobId = displayJobs[rowMeta.dataIndex].id;
    history.push(`/workflow/job/tasks/${jobId}`);
  };

  // creates an array of unique jobs from the view
  // this array is contained in the state displayJobs
  // displayJobs is the top level data seen in the table
  const createRows = (inputReq) => {
    const tempJobs = {};
    inputReq.forEach((task) => {
      if (!tempJobs[task.id]) {
        tempJobs[task.id] = task;
      }
    });
    setDisplayJobs(Object.values(tempJobs));
  };

  // called from toolbar, enabling to refresh table data without refreshing whole page
  const refreshData = () => {
    authAPI.get('/workflow/job_tasks')
      .then((data) => {
        const rows = data.data.data;
        createRows(rows);
      })
      .catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error', enqueueSnackbar,
          closeSnackbar,
        );
      });
  };


  // redirects to wizard for specific job
  const handleOpenWizard = (tableMeta) => {
    const jobId = tableMeta.rowData[0];
    history.push(`/workflow/deploy/deployment_builder/${jobId}`);
  };

  // redirects to device validation report for specific job
  const handleOpenReport = (tableMeta) => {
    const jobId = tableMeta.rowData[0];
    history.push(`/workflow/validation/reports/${jobId}`);
  };

  // determines which type of open action is needed based on workflow type
  const handleOpen = (tableMeta) => {
    const workflowType = tableMeta.rowData[6];
    if (workflowType === 'DA Validation') {
      handleOpenReport(tableMeta);
    } else {
      handleOpenWizard(tableMeta);
    }
  };

  // track changes on title fields in both state and tableMeta for local continuity
  const change = (newTitle, tableMeta) => {
    const jobId = tableMeta.rowData[0];

    setDisplayJobs(displayJobs.map((job) => {
      if (job.job_id === jobId) {
        return {
          ...job,
          name: newTitle,
        };
      }

      return job;
    }));
  };

  // handles save or edit of title field
  // changes the value of editRow for specific row
  // if save is clicked, patch the job in the database
  const handleSubmit = (tableMeta) => {
    const jobId = tableMeta.rowData[0];
    const postData = { name: tableMeta.rowData[1] };
    authAPI.patch(`/workflow/update_job/${jobId}`, { data: postData })
      .then(() => {
      })
      .catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error', enqueueSnackbar,
          closeSnackbar,
        );
      });
  };

  const columns = [
    {
      name: 'id',
      label: 'Job',
      options: {
        filter: true,
        sort: true,
        display: displayList[0],
        filterList: filter[0],
        sortDirection: sort[0],
      },
    },
    {
      name: 'name',
      label: 'Title',
      options: {
        filter: true,
        sort: true,
        display: displayList[1],
        filterList: filter[1],
        sortDirection: sort[1],
        customBodyRender: (value, tableMeta, updateValue) => {
          const row = `row${tableMeta.rowData[0]}`;
          let ownsJob = false;

          // check for who owns the row to set whether a textfield
          // or input is shown
          // will only be able to edit field if ownsJob = true
          if (tableMeta.rowData) {
            if (_.isEqual(tableMeta.rowData[5], user.display_name)) {
              ownsJob = true;
            }
          }

          // null check for name field
          if (displayJobs[tableMeta.rowIndex].name === null) {
            displayJobs[tableMeta.rowIndex].name = '';
          }
          return (
            <>
              {(ownsJob || isAdmin) ? (
                <Input
                  onChange={(e) => {
                    updateValue(e.target.value);
                  }}
                  className={classes.titleField}
                  readOnly={!editRow[row]}
                  value={tableMeta.rowData[1] || ''}
                  inputProps={{ maxLength: 15 }}
                  endAdornment={(
                    <InputAdornment position="end">
                      {
                        editRow[row] ? (
                          <Tooltip title="Save Job Name">
                            <span>
                              <IconButton
                                onClick={() => {
                                  change(value, tableMeta);
                                  handleSubmit(tableMeta);
                                  setEditRow((prevState) => ({ ...prevState, [row]: false }));
                                }}
                                disabled={!hasWriteAccess}
                              >
                                <SaveIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Edit Job Name">
                            <span>
                              <IconButton
                                onClick={() => {
                                  setEditRow((prevState) => ({ ...prevState, [row]: true }));
                                }}
                                disabled={!hasWriteAccess}
                              >
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )
                      }
                    </InputAdornment>
                  )}
                />
              ) : (
                <Input
                  classes={{
                    root: classes.root,
                    input: classes.input,
                  }}
                  className={classes.roTitleField}
                  readOnly
                  value={tableMeta.rowData[1] || ''}
                />
              )}
            </>
          );
        },
      },
    },
    {
      name: 'timestamp',
      label: 'Timestamp',
      options: {
        filter: true,
        sort: true,
        display: displayList[2],
        filterList: filter[2],
        sortDirection: sort[2],
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
      name: 'status_details',
      label: 'Status Details',
      options: {
        filter: true,
        sort: true,
        display: displayList[3],
        filterList: filter[3],
        sortDirection: sort[3],
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        display: displayList[4],
        filterList: filter[4],
        sortDirection: sort[4],
      },
    },
    {
      name: 'display_name',
      label: 'Owner',
      options: {
        filter: true,
        sort: true,
        display: displayList[5],
        sortDirection: sort[5],
        filterList: filter[5],
      },
    },
    {
      name: 'workflow_type',
      label: 'Workflow Type',
      options: {
        filter: true,
        sort: true,
        display: displayList[6],
        filterList: filter[6],
        sortDirection: sort[6],
      },
    },
    {
      name: 'Actions',
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRender: (value, tableMeta) => {
          let jobReady = false;
          if (tableMeta.rowData && (tableMeta.rowData[5] === user.display_name || isAdmin)) {
            // if the job is yours and status is in one of the below status, can open job wizard
            const workflowType = tableMeta.rowData[6];
            if (
              (tableMeta.rowData[4] === 'User Input' || tableMeta.rowData[4] === 'Ready'
               || tableMeta.rowData[4] === 'Complete') && hasWriteAccess
            ) {
              jobReady = true;
            } else if (workflowType === 'DA Validation' && tableMeta.rowData[4] === 'Incomplete') {
              jobReady = true;
            }
          }

          return (
            <>
              <Button
                color="primary"
                variant="contained"
                onClick={() => { handleOpen(tableMeta); }}
                disabled={!jobReady}
              >
                Open
              </Button>
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
    print: false,
    searchText: search,
    expandableRows: true,
    rowsPerPageOptions: [5, 10, 15],
    rowsExpanded: expandedRows,
    onTableChange: (action, tableState) => {
      // hard set state to preserve on table rerenders and changes
      // saves expanded rows, filter, search, sort, displayList
      if (action !== 'propsUpdate') {
        if (action === 'expandRow') {
          setExpandedRows(Object.keys(tableState.expandedRows.lookup).map((indexStr) => Number.parseInt(indexStr, 10)));
        }
        if (action === 'search' || action === 'filterChange' || action === 'sort' || action === 'columnViewChange') {
          setSearch(tableState.searchText);
          setFilter(tableState.filterList);
          setSort(tableState.columns.map((column) => column.sortDirection));
          setDisplayList(tableState.columns.map((column) => column.display));
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
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      let emptyRow = true;
      let mapRow = [];

      // undefined checks to prevent front end errors
      // if passed, pull the devices from user_selections of the specific job
      if (displayJobs[rowMeta.dataIndex]) {
        if (displayJobs[rowMeta.dataIndex].user_selections) {
          mapRow = JSON.parse(displayJobs[rowMeta.dataIndex].user_selections);
          emptyRow = false;
        }
      }

      return (
        <>
          {emptyRow ? (
            <TableRow>
              <TableCell colSpan={colSpan} className={classes.emptyRow}>
                No tasks found for Job
                {' '}
                {rowData[0]}
                .
              </TableCell>
            </TableRow>
          ) : (
            <TableRow
              hover
              tabIndex={-1}
              className={classes.rowExpand}
            >
              <TableCell colSpan={colSpan} align="center">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Hostname</TableCell>
                      <TableCell alight="right">Management IP</TableCell>
                      <TableCell alight="right">Workflow</TableCell>
                      <TableCell alight="right">Template</TableCell>
                    </TableRow>
                  </TableHead>
                  {mapRow.map((row) => (
                    <TableBody key={row.hostname} className={classes.rowExpand}>
                      <TableRow className={classes.rowExpand}>
                        <TableCell alight="left">
                          {row.hostname}
                        </TableCell>
                        <TableCell alight="right">{row.mgmt_ip}</TableCell>
                        <TableCell alight="right">{row.workflow}</TableCell>
                        <TableCell alight="right">{row.template}</TableCell>
                      </TableRow>
                    </TableBody>
                  ))}

                </Table>
                <div>
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.tasks}
                    onClick={() => { handleTask(rowMeta); }}
                  >
                    View Job Task(s) Details
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </>
      );
    },
    customToolbar: () => (
      <JobsToolbar
        refreshData={refreshData}
      />
    ),
  };

  // create object to track the title editing field
  // editRows will be used to track which rows a user has clicked save or edit button on
  useEffect(() => {
    const editRows = {};
    Object.values(displayJobs).forEach((displayJob) => {
      editRows[`row${displayJob.id}`] = false;
    });
    setEditRow(editRows);
  }, [displayJobs]);

  useEffect(() => {
    // pull all from job_tasks view, pull only the ones that need user input
    authAPI.get('/workflow/job_tasks')
      .then((data) => {
        const rows = data.data.data;
        createRows(rows);
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
    <MuiThemeProvider theme={tableTheme}>
      <MUIDataTable
        title="Jobs"
        data={displayJobs}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
};

export default Jobs;
