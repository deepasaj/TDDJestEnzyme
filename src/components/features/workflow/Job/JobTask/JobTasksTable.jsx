import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';

import { useAuthAPI } from 'store/store';
import JobTasksToolbar from './JobTasksToolbar';

const useStyles = makeStyles(() => ({
  rowExpand: {
    backgroundColor: '#f7f7f7',
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

const MyJobsTable = () => {
  const classes = useStyles();
  const jobId = Number.parseInt(useParams().jobId, 10);
  const authAPI = useAuthAPI();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [displayTasks, setDisplayTasks] = useState([]);
  const [displayJobs, setDisplayJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [filter, setFilter] = useState([[], []]);
  const [sort, setSort] = useState(['none', 'desc']);
  const [displayList, setDisplayList] = useState(['true', 'true']);

  // creates an array of unique devices from the view
  // this array is contained in the state displayJobs
  // displayJobs is the top level data seen in the table
  const createRows = (jobTasks) => {
    const byTargetJobs = {};
    jobTasks.forEach((task) => {
      // an attempt to get the last reference to the device in the data state
      // if we have the last reference, we should have the last updated time to view
      byTargetJobs[task.target] = task;
    });

    setDisplayJobs(Object.values(byTargetJobs));
  };

  // creates array with tasks per device
  // displayTasks is the data used in the expandable rows
  const createSubRows = (jobTasks) => {
    const tempTasks = {};

    jobTasks.forEach((task) => {
      const rowList = `row${task.target}`;
      if (rowList in tempTasks) {
        tempTasks[rowList].push(task);
      } else {
        tempTasks[rowList] = [task];
      }
    });

    setDisplayTasks(tempTasks);
  };

  // called from toolbar, enabling to refresh table data without refreshing whole page
  const refreshData = () => {
    authAPI.get('/workflow/task_details')
      .then((data) => {
        const details = data.data.data;
        const jobTasks = details.filter((status) => status.job_id === jobId);

        createRows(jobTasks);
        createSubRows(jobTasks);
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
      name: 'target',
      label: 'Hostname',
      options: {
        filter: true,
        sort: true,
        display: displayList[0],
        filterList: filter[0],
        sortDirection: sort[0],
      },
    },
    {
      name: 'last_updated',
      label: 'Timestamp (Last Updated)',
      options: {
        filter: true,
        sort: true,
        display: displayList[1],
        filterList: filter[1],
        sortDirection: sort[1],
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
    download: false,
    searchText: search,
    rowsExpanded: expandedRows,
    customToolbar: () => (
      <JobTasksToolbar
        refreshData={refreshData}
      />
    ),
    onTableChange: (action, tableState) => {
      // preserve state through refresh or table state change
      // hard set expanded rows, filter, search, sort, displayList
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
      // custom sort if datetime column
      if (colIndex === 1) {
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
      const mapKey = `row${rowData[0]}`;
      let mapRow = [];

      // make sure displayTasks has been set to avoid front end errors
      // mapRow will contain all the tasks that are under a single device
      if (displayTasks) {
        mapRow = displayTasks[mapKey];
      }

      return (
        <TableRow
          hover
          tabIndex={-1}
        >
          <TableCell colSpan={colSpan} align="center">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left"> Task </TableCell>
                  <TableCell align="left"> Details </TableCell>
                  <TableCell align="right"> Time Stamp </TableCell>
                  <TableCell align="right"> Status </TableCell>
                </TableRow>
              </TableHead>
              {mapRow.map((row) => (
                <TableBody key={row.id} className={classes.rowExpand}>
                  <TableRow key={row.id} className={classes.rowExpand}>

                    <TableCell align="left">{row.status}</TableCell>
                    <TableCell align="left">{row.message}</TableCell>
                    <TableCell align="right">{row.timestamp}</TableCell>
                    <TableCell align="right">{row.task_status}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </TableCell>
        </TableRow>
      );
    },
  };


  useEffect(() => {
    // get all task_details from the view and pull only the ones to the specific job
    // may be able to simplify with new crud endpoints now
    authAPI.get('/workflow/task_details')
      .then((data) => {
        const row = data.data.data;
        const jobTasks = row.filter((status) => status.job_id === jobId);

        createRows(jobTasks);
        createSubRows(jobTasks);
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
      <MuiThemeProvider theme={tableTheme}>
        <MUIDataTable
          title="Job Task(s) Details"
          data={displayJobs}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    </>
  );
};

export default MyJobsTable;
