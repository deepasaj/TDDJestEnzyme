import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import LoadingPage from './LoadingPage';
// import { task_obj } from "./mock_actual";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import { useParams } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/auth-store';


const separator = {
  "------------------------------------": "------------------------------------"
};

const useStyles = makeStyles(() => ({
  rowExpand: {
    backgroundColor: "#f7f7f7"
  },
  table: {
    boxShadow: "0px 0px 0px 0px",
    border: "1px solid #e3e3e3",
    borderRadius: "5px"
  },
  btn_primary: {
    marginLeft: "10px",
    marginRight: "25px"
  },
  edit_btn: {
    marginRight: "10px",
    padding: 6
  },
  titleField: {
    width: "200px"
  },
  boldness: {
    fontWeight: "50px"
  },
  emptyRow: {
    textAlign: "center",
    backgroundColor: "#F5F5F5"
  }
}));

const tableTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: "6px 16px 6px 16px"
      }
    },
    MUIDataTableHeadCell: {
      root: {
      '&:nth-child(2)': {
        width: 350
      }
      }
    },
//        MUIDataTableBodyCell: {
//            root: {
//                backgroundColor: "#FFF",
//                width: "150px"
//            }
//        }
  }
});

const Validation = () => {
  const classes = useStyles();
  let { jobId } = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [systems, setSystems] = React.useState();
  const [job, setJob] = React.useState({}); // eslint-disable-line no-unused-vars
  const [tasks, setTasks] = React.useState([])
  const [loadingDone, setLoadingDone] = React.useState(false);
  const authAPI = useAuthAPI();

  const getReportData = () => {

    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`/deploy/get_tasks/${jobId}`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          clearTimeout(timeout);
          if (!didTimeOut) {
            resolve(response);
            const rows = response.data;
            console.log(rows);
            // for (var row in rows) {
            //     rows[row].task_object = JSON.parse(rows[row].task_object)
            //     if (rows[row].task_object.output == null) {
            //         rows[row].mgmt_ip = IP[rows[row].target];
            //         rows[row].task_object.formData = { "hostname": rows[row].target, "mgmt_ip": rows[row].mgmt_ip };
            //     }
            //     if (rows[row].task_object.uiSchema == null) {
            //         rows[row].task_object.uiSchema = {}
            //     }
            //     if (rows[row].task_object.input.uiSchema != undefined) {
            //         if (rows[row].task_object.input.uiSchema.mgmt_ip != undefined) {
            //             rows[row].task_object.input.uiSchema.mgmt_ip['ui:readonly'] = true;
            //         }
            //         if (rows[row].task_object.input.uiSchema.hostname != undefined) {
            //             rows[row].task_object.input.uiSchema.hostname['ui:readonly'] = true;
            //         }
            //     }
            // }
            setTasks(rows);
            // setTaskDataLoadingDone(true)
          }
        }).catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

  };

  useEffect(() => {
    setLoadingDone(false)
    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`/dbase/job/${jobId}`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          clearTimeout(timeout);
          if (!didTimeOut) {
            resolve(response);
            const jobObject = response.data;
            setJob(jobObject)
            setTimeout(() => {
              getReportData()
            }, 3000);
          }
        }).catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });


  }, []);

  useEffect(() => {
    var temp_systems = [];
    console.log(tasks[0])
    if (tasks[0] !== undefined) {
      var task_obj = JSON.parse(tasks[0].task_object);
      console.log(task_obj.output);
      if (task_obj.output) {
        task_obj.output.map((row, index) => {
          const hostKey = Object.keys(task_obj.output[index])[0];
          task_obj.output[index][hostKey].map((systemRow) => {
            var temp_device = [];
            var temp_keyval_array = [];

            var hostSystem = hostKey + " | " + Object.keys(systemRow);
            temp_device.push(hostSystem);
            temp_device.push(systemRow[Object.keys(systemRow)].status);
            temp_device.push(systemRow[Object.keys(systemRow)].error);

            // Create List of Objects
            var result_obj = systemRow[Object.keys(systemRow)].result;
            console.log('result_obj')
            console.log(result_obj)
            if (result_obj && systemRow[Object.keys(systemRow)].result.length > 1) {
              for (var i = 0; i < result_obj.length; i++) {
                if (typeof result_obj[i] === "object") {
                  for (var key in result_obj[i]) {
                    if (result_obj[i].hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
                      var temp_keyval = {};
                      temp_keyval[key] = result_obj[i][key];
                      temp_keyval_array.push(temp_keyval);
                    }
                  }
                } else {
                  temp_keyval_array.push({ " ": result_obj[i] });
                }
                temp_keyval_array.push(separator);
              }
            } else {
              if (result_obj && typeof result_obj[0] === "object") {
                for (var key in result_obj[0]) { // eslint-disable-line no-redeclare
                  if (result_obj[0].hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
                    var temp_keyval = {}; // eslint-disable-line no-redeclare
                    temp_keyval[key] = result_obj[0][key];
                    temp_keyval_array.push(temp_keyval);
                  }
                }
              } else {
                if(result_obj){
                  temp_keyval_array.push({ " ": result_obj[0] });
                }
              }
            }

            //Push the results into a temporary array
            temp_device.push(temp_keyval_array);
            temp_systems.push(temp_device);
          });
        });
      }
      setSystems(temp_systems);
      setLoadingDone(true)
    } else {
      console.log('skipping');
    }
  }, [tasks]);

  const columns = [
    {
      name: "Systems",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Status",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Error",
      options: {
        filter: true,
        sort: true
      }
    },

    {
      name: "Results",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false
      }
    }
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
    customSort: (data, colIndex, order) => {
      //sort differently if column is date
      if (colIndex === 3) {
        if (order === "asc") {
          return data.sort((a, b) => {
            return new Date(a.data[colIndex]) - new Date(b.data[colIndex]);
          });
        } else if (order === "desc") {
          return data.sort((a, b) => {
            return new Date(b.data[colIndex]) - new Date(a.data[colIndex]);
          });
        }
      } else {
        if (order === "asc") {
          return data.sort((a, b) => {
            return a.data[colIndex] < b.data[colIndex] ? 1 : -1;
          });
        } else if (order === "desc") {
          return data.sort((a, b) => {
            return a.data[colIndex] < b.data[colIndex] ? -1 : 1;
          });
        }
      }
    },
    renderExpandableRow: (rowData) => {
      const colSpan = rowData.length + 1;
      var emptyRow = false;
      //if no results, display message
      if (systems.length <= 0) {
        emptyRow = true;
      }
      return (
        <React.Fragment>
          {emptyRow ? (
            <TableRow>
              <TableCell colSpan={colSpan} className={classes.emptyRow}>
                {"No results found."}
              </TableCell>
            </TableRow>
          ) : (
              <TableRow tabIndex={-1} className={classes.rowExpand}>
                <TableCell colSpan={colSpan} align="center">
                  <Table>
                    <TableHead style={{ fontWeight: "500px" }}>
                      <TableRow>
                        <TableCell align="left">Key</TableCell>
                        <TableCell alight="left">Result</TableCell>
                      </TableRow>
                    </TableHead>
                    {rowData[3].map((row, index) => {
                      // Check for array of results and seperate with comma for easy read
                      if (Array.isArray(row[Object.keys(row)[0]])) {
                        var temp = row[Object.keys(row)[0]].join(", ");
                        row[Object.keys(row)[0]] = temp;
                      }
                      return (
                        <TableBody key={index} className={classes.rowExpand}>
                          <TableRow key={index} className={classes.rowExpand}>
                            <TableCell alight="left">
                              {Object.keys(row)[0]}
                            </TableCell>

                            <TableCell alight="left">
                              {row[Object.keys(row)[0]]}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      );
                    })}
                  </Table>
                </TableCell>
              </TableRow>
            )}
        </React.Fragment>
      );
    }
  };

  return (
    <React.Fragment>
      {loadingDone ? (
        <MuiThemeProvider theme={tableTheme}>
          <MUIDataTable
            title={"Reports Table"}
            data={systems}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      ) : (
          <LoadingPage />
        )}
    </React.Fragment>
  );
};

export default Validation;
