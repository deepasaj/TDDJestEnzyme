import React, { useEffect } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import JobTasksToolbar from './JobTasksToolbar';
import { useParams } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useStateValue } from 'store/store';
import { useAuthAPI } from 'store/store'

const useStyles = makeStyles(() => ({
  rowExpand: {
    backgroundColor: "#f7f7f7"
  }
}));

const tableTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: "6px 16px 6px 16px"
      }
    }
  }
});

const MyJobsTable = () => {
  const classes = useStyles();
  let { job_id } = useParams();
  const [state] = useStateValue();
  const authAPI = useAuthAPI();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = React.useState(); // eslint-disable-line no-unused-vars
  const [displayTasks, setDisplayTasks] = React.useState([]);
  const [displayJobs, setDisplayJobs] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [expandedRows, setExpandedRows] = React.useState([]);
  const [filter, setFilter] = React.useState([[], []]);
  const [sort, setSort] = React.useState(['none', 'desc']);
  const [displayList, setDisplayList] = React.useState(["true", "true"]);


  const columns = [
    {
      name: "target",
      label: "Hostname",
      options: {
        filter: true,
        sort: true,
        display: displayList[0],
        filterList: filter[0],
        sortDirection: sort[0]
      }
    },
    {
      name: "last_updated",
      label: "Timestamp (Last Updated)",
      options: {
        filter: true,
        sort: true,
        display: displayList[1],
        filterList: filter[1],
        sortDirection: sort[1],
      }
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "scrollFullHeight",
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    print: false,
    expandableRows: true,
    download: false,
    searchText: search,
    rowsExpanded: expandedRows,
    customToolbar: () => {
      return (
        <JobTasksToolbar
          refreshData={refreshData}
        />
      );
    },
    onTableChange: (action, tableState) => {
      //preserve state through refresh or table state change
      //hard set expanded rows, filter, search, sort, displayList
      if(action !== 'propsUpdate' ) {
        if (action === 'expandRow') {
          var tempRowExpand = []
          for (var idx in tableState.expandedRows.lookup) {
            tempRowExpand.push(parseInt(idx))
          }
          setExpandedRows(tempRowExpand);
        }
        if (action === 'search' || action == 'filterChange' || action === 'sort' || action === 'columnViewChange') {
          setSearch(tableState.searchText);
          setFilter(tableState.filterList);
          for (var idx in tableState.columns) { // eslint-disable-line no-redeclare
            sort[idx] = tableState.columns[idx].sortDirection;
            displayList[idx] = tableState.columns[idx].display;
          }
          setSort(sort);
          setDisplayList(displayList);
        }
      }
    },
    customSort: (data, colIndex, order) => {
      //custom sort if datetime column
      if (colIndex === 1) {
        if (order === 'asc') {
          return data.sort((a, b) => {
            return new Date(a.data[colIndex]) - new Date(b.data[colIndex]);
          })
        } else if (order === 'desc') {
          return data.sort((a, b) => {
            return new Date(b.data[colIndex]) - new Date(a.data[colIndex])
          });
        }
      } else {
        if (order === 'asc') {
          return data.sort((a, b) => {
            return (a.data[colIndex] < b.data[colIndex] ? 1 : -1);
          })
        } else if (order === 'desc') {
          return data.sort((a, b) => {
            return (a.data[colIndex] < b.data[colIndex] ? -1 : 1);
          });
        }
      }
    },
    renderExpandableRow: (rowData) => {
      const colSpan = rowData.length + 1;
      var mapKey = "row" + rowData[0];
      var mapRow = [];

      //make sure displayTasks has been set to avoid front end errors
      //mapRow will contain all the tasks that are under a single device
      if (displayTasks != undefined) {
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
              {mapRow.map((row, index) => {
                return (
                  < TableBody key={index} className={classes.rowExpand}>
                    <TableRow key={index} className={classes.rowExpand}>

                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">{row.message}</TableCell>
                      <TableCell align="right">{row.timestamp}</TableCell>
                      <TableCell align="right">{row.task_status}</TableCell>
                    </TableRow>
                  </TableBody>
                );
              })}
            </Table>
          </TableCell>
        </TableRow>
      );
    }
  };

  //called from toolbar, enabling to refresh table data without refreshing whole page
  const refreshData = () => {
    authAPI.get(`/job/task_details`)
      .then((data) => {
        var row = data.data.data;
        var jobTasks = [];
        for (var status in row) {
          if (row[status].job_id == job_id) {
            jobTasks.push(row[status]);
          }
        }
        setData(data.data.data);
        createRows(jobTasks);
        createSubRows(jobTasks);
      })
      .catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }

  //creates an array of unique devices from the view
  //this array is contained in the state displayJobs
  //displayJobs is the top level data seen in the table
  const createRows = (jobTasks) => {
    var tempJobList = [];
    for (var row in jobTasks) {
      //first device will always be unique
      if (tempJobList.length < 1) {
        tempJobList.push(jobTasks[row]);
      } else {
        var jobPresent = true;
        //an attempt to get the last reference to the device in the data state
        //if we have the last reference, we should have the last updated time to view
        for (var job in tempJobList) {
          if (jobTasks[row].target == tempJobList[job].target) {
              for (var idx in tempJobList) {
                if (tempJobList[idx].target == jobTasks[row].target) {
                  tempJobList.splice(idx, 1);
                  tempJobList.push(jobTasks[row]);
                }
              }
            jobPresent = true;
          } else {
            jobPresent = false;
          }
        }
        if (jobPresent == false) {
          tempJobList.push(jobTasks[row]);
        }
      }
    }
    setDisplayJobs(tempJobList);
  }

  //creates array with tasks per device
  //displayTasks is the data used in the expandable rows
  const createSubRows = (jobTasks) => {
    var tempTasks = {};
    for (var idx in jobTasks) {
      var rowList = "row" + jobTasks[idx].target
      if (rowList in tempTasks) {
        tempTasks[rowList].push(jobTasks[idx]);
      } else {
        tempTasks[rowList] = [jobTasks[idx]];
      }
    }

    setDisplayTasks(tempTasks);
  }

  useEffect(() => {
    //get all task_details from the view and pull only the ones to the specific job
    //may be able to simplify with new crud endpoints now
    authAPI.get(`/job/task_details`, { timeout:5000 })
      .then((data) => {
        var row = data.data.data;
        var jobTasks = [];
        for (var status in row) {
          if (row[status].job_id == job_id) {
            jobTasks.push(row[status]);
          }
        }
        setData(data.data.data);
        createRows(jobTasks);
        createSubRows(jobTasks);
      })
      .catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }, []);

  return (
    <React.Fragment>
      <MuiThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={"Job Task(s) Details"}
          data={displayJobs}
          columns={columns}
          options={options}
        />
       </MuiThemeProvider>
    </React.Fragment>
  );
};

export default MyJobsTable;
