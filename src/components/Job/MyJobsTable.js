import React, { useEffect } from "react";
import queryString from 'query-string'
import axios from "axios";
import { useSnackbar } from "notistack";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import JobsToolbar from './JobsToolbar';
import _ from "lodash";
import { API_URL } from 'config';
import { useStateValue } from 'store/store';
import { showNotification } from 'utils/notifications';
import { withRouter } from 'react-router-dom';
import { getAuthHeader } from 'utils/auth';
import { useAuthAPI } from 'store/auth-store'

const useStyles = makeStyles(() => ({
  rowExpand: {
    backgroundColor: "#f7f7f7"
  },
  titleField: {
    width: '200px'
  },
  tasks: {
    marginTop: "10px",
    float: "left"
  },
  emptyRow: {
    textAlign: "center",
    backgroundColor: "#F5F5F5"
  },
  roTitleField: {
    width: "200px",
  },
  root: {
    cursor: "default"
  },
  input: {
    cursor: "default"
  },
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

const Jobs = (props) => {
  const { history } = props;
  const classes = useStyles();
  const [state] = useStateValue();
  const authAPI = useAuthAPI();

  const { user } = state;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = React.useState(); // eslint-disable-line no-unused-vars
  const [userInputTasks, setUserInputTasks] = React.useState([]); // eslint-disable-line no-unused-vars
  const [displayJobs, setDisplayJobs] = React.useState([]);
  const [title, setTitle] = React.useState(""); // eslint-disable-line no-unused-vars
  const [editRow, setEditRow] = React.useState({});
  const [statusFilter, setStatusFilter] = React.useState([]); // eslint-disable-line no-unused-vars
  const [workflowTypeFilter, setWorkflowTypeFilter] = React.useState([]); // eslint-disable-line no-unused-vars
  const [search, setSearch] = React.useState("");
  const [expandedRows, setExpandedRows] = React.useState([]);
  const [filter, setFilter] = React.useState([[], [], [], [], statusFilter, [], workflowTypeFilter]);
  const [sort, setSort] = React.useState(['none', 'none', 'desc', 'none', 'none', 'none', 'none']);
  const [displayList, setDisplayList] = React.useState(["true", "true", "true", "true", "true", "true", "false"]);

  const params = queryString.parse(props.location.search)
  let job_status = params.job_status;
  let workflow_type = params.workflow_type;

  const columns = [
    {
      name: "id",
      label: "Job",
      options: {
        filter: true,
        sort: true,
        display: displayList[0],
        filterList: filter[0],
        sortDirection: sort[0]
      }
    },
    {
      name: "name",
      label: "Title",
      options: {
        filter: true,
        sort: true,
        display: displayList[1],
        filterList: filter[1],
        sortDirection: sort[1],
        customBodyRender: (value, tableMeta, updateValue) => {
          var row = "row" + tableMeta.rowData[0];
          var ownsJob = false;

          //check for who owns the row to set whether a textfield
          //or input is shown
          //will only be able to edit field if ownsJob = true
          if (tableMeta.rowData != undefined) {
            if (_.isEqual(tableMeta.rowData[5], user.display_name)) {
              ownsJob = true;
            }
          }

          //null check for name field
          if (displayJobs[tableMeta.rowIndex].name == null) {
            displayJobs[tableMeta.rowIndex].name = "";
          }
          return (
            <React.Fragment>
              {ownsJob ? (
                <Input
                  onChange={e => {
                    change(e, tableMeta);
                    updateValue(e.target.value);
                  }
                  }
                  className={classes.titleField}
                  readOnly={!editRow[row]}
                  value={tableMeta.rowData[1] || ''}
                  inputProps={{ maxLength: 15 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip title={editRow[row] ? "Save Deployment Name" : "Edit Deployment Name"}>
                        <IconButton
                          onClick={() => {
                            handleSubmit(tableMeta);
                          }}
                        >
                          {editRow[row] ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                />
              ) : (
                  <Input
                    classes={{
                      root: classes.root,
                      input: classes.input
                    }}
                    className={classes.roTitleField}
                    readOnly={true}
                    value={tableMeta.rowData[1] || ''}
                  />
                )}
            </React.Fragment>
          );
        }
      }
    },
    {
      name: "timestamp",
      label: "Timestamp",
      options: {
        filter: true,
        sort: true,
        display: displayList[2],
        filterList: filter[2],
        sortDirection: sort[2],
        filterOptions: {
          names: ['Last 7 days', 'Last 14 days', 'Last 30 days'],
          logic(timestamp, filterVal) {
            var pastWeekDate = new Date();
            pastWeekDate.setDate(pastWeekDate.getDate() - 7);
            var pastTwoWeeksDate = new Date();
            pastTwoWeeksDate.setDate(pastTwoWeeksDate.getDate() - 14);
            var pastMonthDate = new Date();
            pastMonthDate.setDate(pastMonthDate.getDate() - 30);
            var timestampDate = new Date(timestamp);

            const show =
              (filterVal.indexOf('Last 7 days') >= 0 && timestampDate.getTime() >= pastWeekDate.getTime()) ||
              (filterVal.indexOf('Last 14 days') >= 0 && timestampDate.getTime() >= pastTwoWeeksDate.getTime()) ||
              (filterVal.indexOf('Last 30 days') >= 0 && timestampDate.getTime() >= pastMonthDate.getTime());
            return !show;
          }
        }
      }
    },
    {
      name: "status_details",
      label: "Status Details",
      options: {
        filter: true,
        sort: true,
        display: displayList[3],
        filterList: filter[3],
        sortDirection: sort[3]
      }
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        //                filterList: statusFilter,
        sort: true,
        display: displayList[4],
        filterList: filter[4],
        sortDirection: sort[4]
      }
    },
    {
      name: "display_name",
      label: "Owner",
      options: {
        filter: true,
        sort: true,
        display: displayList[5],
        sortDirection: sort[5],
        filterList: filter[5],
      }
    },
    {
      name: "workflow_type",
      label: "Workflow Type",
      options: {
        filter: true,
        sort: true,
        display: displayList[6],
        filterList: filter[6],
        sortDirection: sort[6]
      }
    },
    {
      name: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRender: (value, tableMeta) => {
          var jobReady = true;
          if (!user.id) {
            if (tableMeta.rowData != undefined) {
              //if the job is yours and status is in one of the below status, can open job wizard
              if (tableMeta.rowData[4] == "User Input" || tableMeta.rowData[4] == "Ready" || tableMeta.rowData[4] == "Complete") {
                if (tableMeta.rowData[5] === user.display_name) {
                  jobReady = false;
                }
              }
            }
          }
          return (
            <React.Fragment>
              <Button
                color="primary"
                variant="contained"
                onClick={() => { handleOpen(tableMeta) }}
                disabled={jobReady}
              >
                Open
              </Button>
            </React.Fragment>
          );
        }
      }
    }
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "scrollFullHeight",
    selectableRows: "none",
    rowsPerPage: 10,
    print: false,
    searchText: search,
    expandableRows: true,
    rowsPerPageOptions: [5, 10, 15],
    rowsExpanded: expandedRows,
    onTableChange: (action, tableState) => {
      //hard set state to preserve on table rerenders and changes
      //saves expanded rows, filter, search, sort, displayList
      if (action !== 'propsUpdate') {
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
      //custom sort if datetime
      if (colIndex === 2) {
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
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      var emptyRow = true;
      var mapRow = []

      //undefined checks to prevent front end errors
      //if passed, pull the devices from user_selections of the specific job
      if (displayJobs[rowMeta.dataIndex] != undefined) {
        if (displayJobs[rowMeta.dataIndex].user_selections != undefined) {
          mapRow = JSON.parse(displayJobs[rowMeta.dataIndex].user_selections);
          emptyRow = false;
        }
      }

      return (
        <React.Fragment>
          {emptyRow ? (
            <TableRow>
              <TableCell colSpan={colSpan} className={classes.emptyRow}>
                No tasks found for Job {rowData[0]}.
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
                    {mapRow.map((row, index) => {
                      return (
                        <TableBody key={index} className={classes.rowExpand}>
                          <TableRow key={index} className={classes.rowExpand}>
                            <TableCell alight="left">
                              {row.hostname}
                            </TableCell>
                            <TableCell alight="right">{row.mgmt_ip}</TableCell>
                            <TableCell alight="right">{row.workflow}</TableCell>
                            <TableCell alight="right">{row.template}</TableCell>
                          </TableRow>
                        </TableBody>
                      );
                    })}

                  </Table>
                  <div>
                    <Button color="primary" variant="contained" className={classes.tasks} onClick={() => { handleTask(rowMeta) }}>
                      View Job Task(s) Details
                </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
        </React.Fragment>
      );
    },
    customToolbar: () => {
      return (
        <JobsToolbar
          refreshData={refreshData}
        />
      );
    }
  };

  //called from toolbar, enabling to refresh table data without refreshing whole page
  const refreshData = () => {
    authAPI.get(`${API_URL}/job/job_tasks`)
      .then((data) => {
        const rows = data.data.data;
        var userinput_required_tasks = [];
        for (var task in rows) {
          if (rows[task].userinput_required === 1) {
            userinput_required_tasks.push(rows[task]);
          }
        }
        setUserInputTasks(userinput_required_tasks);
        setData(userinput_required_tasks);
        createRows(userinput_required_tasks);
      })
      .catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }

  //open tasks table for specific job
  const handleTask = (rowMeta) => {
    var job_id = displayJobs[rowMeta.dataIndex].id;
    history.push(`/job/tasks/${job_id}`);
  }

  //redirects to wizard for specific job
  const handleOpenWizard = (tableMeta) => {
    var job_id = tableMeta.rowData[0];
    history.push(`/deploy/deployment_builder/${job_id}`);
  }

  //redirects to device validation report for specific job
  const handleOpenReport = (tableMeta) => {
    var job_id = tableMeta.rowData[0];
    history.push(`/validation/reports/${job_id}`);
  }

  //determines which type of open action is needed based on workflow type
  const handleOpen = (tableMeta) => {
    var workflow_type = tableMeta.rowData[6];
    if (workflow_type === 'DA Validation') {
      handleOpenReport(tableMeta);
    } else {
      handleOpenWizard(tableMeta);
    }
  }

  //creates an array of unique jobs from the view
  //this array is contained in the state displayJobs
  //displayJobs is the top level data seen in the table
  const createRows = (inputReq) => {
    var tempJobList = [];
    for (var row in inputReq) {
      if (tempJobList.length < 1) {
        tempJobList.push(inputReq[row]);
      } else {
        var jobPresent = true;
        for (var job in tempJobList) {
          if (inputReq[row].id == tempJobList[job].id) {
            jobPresent = true;
          } else {
            jobPresent = false;
          }
        }
        if (jobPresent == false) {
          tempJobList.push(inputReq[row]);
        }
      }
    }
    setDisplayJobs(tempJobList);
  }

  //create object to track the title editing field
  //editRows will be used to track which rows a user has clicked save or edit button on
  useEffect(() => {
    var editRows = {};
    for (var num in displayJobs) {
      var row = "row" + displayJobs[num].id
      editRows[row] = false;
    }
    setEditRow(editRows);
  }, [displayJobs]);

  //track changes on title fields in both state and tableMeta for local continuity
  const change = (e, tm) => {
    var row = tm.rowData[0];
    for (var idx in displayJobs) {
      if (displayJobs[idx].job_id == row) {
        displayJobs[idx].name = e.target.value;
        tm.rowData[1] = displayJobs[idx].name
      }
    }
    setTitle(e.target.value);
  }

  //handles save or edit of title field
  //changes the value of editRow for specific row
  //if save is clicked, patch the job in the database
  const handleSubmit = (tableMeta) => {
    var currRow = "row" + tableMeta.rowData[0];
    if (editRow[currRow] == false) {
      setEditRow(prevState => {
        return { ...prevState, [currRow]: true }
      });
    } else {
      var jobId = tableMeta.rowData[0];
      var postData = { "name": tableMeta.rowData[1] };
      authAPI.patch(API_URL + "/dbase/job/" + jobId, { "data": postData }, { timeout: 5000 })
        .then(() => {
        })
        .catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
      setEditRow(prevState => {
        return { ...prevState, [currRow]: false }
      });
    }
  }

  useEffect(() => {
    //used for quicklinks, job_status is a query string through url
    //passed through html file and views.py
    if (job_status) {
      statusFilter.push(job_status);
    }
    if (workflow_type) {
      workflowTypeFilter.push(workflow_type);
    }
    //pull all from job_tasks view, pull only the ones that need user input
    authAPI.get(`${API_URL}/job/job_tasks`, { timeout: 5000 })
      .then((data) => {
        const rows = data.data.data;
        var userinput_required_tasks = [];
        for (var task in rows) {
          if (rows[task].userinput_required === 1) {
            userinput_required_tasks.push(rows[task]);
          }
        }
        console.log(userinput_required_tasks);
        setUserInputTasks(userinput_required_tasks);
        setData(userinput_required_tasks);
        createRows(userinput_required_tasks);
      })
      .catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }, []);

  return (
    <MuiThemeProvider theme={tableTheme}>
      <MUIDataTable
        title={"Jobs"}
        data={displayJobs}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
};

export default withRouter(Jobs);
