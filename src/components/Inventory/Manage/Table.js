import _ from 'lodash'
import React, { useEffect, useState } from "react";
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import CustomToolbar from "./AddDeviceToolbar";
import CustomToolbarSelect from "./CustomToolbarSelect";
import DeviceInfoModal from "./DeviceInfoDialog";
import DeleteConfirmModal from "./DeleteConfirmationDialog";
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store'


const InvStyles = makeStyles(() => ({
  action_btn: {
    marginRight: "10px",
    padding: 6
  },
}));

const tableTheme = createMuiTheme({
  overrides: {
    // MUIDataTablesHead: {
    //   root: {
    //     padding: 0
    //   }
    // },
    // MUIDataTableBodyCell: {
    //   root: {
    //     padding: 0,
    //     backgroundColor: "#FF0000"
    //   }
    // },
    MuiTableCell: {
      root: {
        padding: "0px 30px 0px 30px"
      }
    }
  }
});


const InventoryTable = () => {
  const classes = InvStyles();
  const [state] = useStateValue();
  const authAPI = useAuthAPI();

  const { user } = state;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState();
  const [device, setDevice] = useState({
    "hostname": "",
    "mgmt_ip": "",
  });
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [deviceId, setDeviceId] = useState(-1);
  const [id, setId] = useState(-1);
  const [first, setFirst] = useState(true); // eslint-disable-line no-unused-vars
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([[], [], [], [], [], [], []]);
  const [sort, setSort] = useState(["none", "none", "none", "none", "none", "desc", "none"]);
  const [displayList, setDisplayList] = useState(["false", "true", "true", "true", "true", "true", "false"]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [singleDelete, setSingleDelete] = useState();
  const [loading, setLoading] = useState(false);
  const [circleValue, setCircleValue] = useState(5);
  const [duplicateHost, setDuplicateHost] = useState(false);
  const [duplicateIP, setDuplicateIP] = useState(false);

  const lockedByFilterOptions = _.chain(data)
                            .map(row => _.get(row, 'lock_user.display_name'))
                            .filter(Boolean)
                            .uniq()
                            .value();

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
        display: displayList[0],
        filterList: filter[0],
        sortDirection: sort[0]
      }
    },
    {
      name: "hostname",
      label: "Host Name",
      options: {
        filter: true,
        sort: true,
        display: displayList[1],
        filterList: filter[1],
        sortDirection: sort[1]
      }
    },
    {
      name: "mgmt_ip",
      label: "Management IP",
      options: {
        filter: true,
        sort: true,
        display: displayList[2],
        filterList: filter[2],
        sortDirection: sort[2]
      }
    },
    {
      name: "create_user.display_name",
      label: "Created By",
      options: {
        filter: true,
        sort: true,
        display: displayList[3],
        filterList: filter[3],
        sortDirection: sort[3]
      }
    },
    {
      name: "lock_user.display_name",
      label: "Locked By",
      options: {
        filter: true,
        sort: true,
        display: displayList[4],
        filterList: filter[4],
        sortDirection: sort[4],
        filterOptions: {
          names: lockedByFilterOptions
        }
      }
    },
    {
      name: "timestamp",
      label: "Timestamp",
      options: {
        filter: true,
        sort: true,
        display: displayList[5],
        sortDirection: sort[5],
        filterList: filter[5],
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
      name: "locked_bool",
      label: "Locked",
      options: {
        filter: true,
        sort: true,
        display: displayList[6],
        filterList: filter[6],
        sortDirection: sort[6],
        //show true/false for locked column and filter chip
        customBodyRender: (value, tableMeta) => {
          return <div>{tableMeta.rowData[6].toString()}</div>
        },
        customFilterListOptions: { 
          render(value) {
            if(value) {
              return "Locked"
            } else {
              return "Unlocked"
            }
          }
        },
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
          var isDisabled = false;

          //undefined check and state set check
          //if passes, only set disabled if locked_bool is true and it is not belonging to current user
          if (tableMeta.rowData != undefined) {
            if (tableMeta.rowData[6] != false) {
              if (tableMeta.rowData[4] != user.display_name) {
                isDisabled = true;
              }
            }
          }
          var helper = tableMeta.rowData[1] + " is currently part of a deployment group that does not belong to you. To unlock the device, please contact the locked by user."

          return (
            <React.Fragment>
              {isDisabled ? (
                <React.Fragment >
                  <Tooltip title="Edit">
                    <span>
                      <IconButton
                        aria-label="edit"
                        onClick={event => { editRow(event, tableMeta.rowData[0]); setShowButton(true); setShow(true); }}
                        className={classes.action_btn}
                        disabled={isDisabled}
                      >
                        <EditIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <span>
                      <IconButton
                        aria-label="delete"
                        onClick={event => { inLineDelete(event, tableMeta.rowData[0]) }}
                        className={classes.action_btn}
                        disabled={isDisabled}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={helper}>
                    <span>
                      <IconButton
                        aria-label="helper"
                        className={classes.action_btn}
                        disabled={!isDisabled}
                      >
                        <LockIcon
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </React.Fragment>
              ) : (
                  <React.Fragment >
                    <Tooltip title="Edit">
                      <span>
                        <IconButton
                          aria-label="edit"
                          onClick={event => { editRow(event, tableMeta.rowData[0]); setShowButton(true); setShow(true); }}
                          className={classes.action_btn}
                          disabled={isDisabled}
                        >
                          <EditIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <span>
                        <IconButton
                          aria-label="delete"
                          onClick={event => { inLineDelete(event, tableMeta.rowData[0]) }}
                          className={classes.action_btn}
                          disabled={isDisabled}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>

                  </React.Fragment>
                )
              }
            </React.Fragment>
          );
        }
      }
    }
  ]

  const options = {
    filter: true,
    selectableRows: "multiple",
    filterType: "dropdown",
    responsive: "scrollFullHeight",
    rowsPerPageOptions: [5, 10, 15],
    rowsPerPage: 10,
    print: false,
    searchText: search,
    rowsSelected: selectedRows,
    onRowsSelect: (rowsSelected, allRows) => {
      setSelectedRows(allRows.map(row => row.dataIndex));
    },
    onTableChange: (action, tableState) => {
      //preserve state through table actions
      //hard set search, filter, sort, display list
      if (action !== 'propsUpdate') {
        if (action === 'search' || action == 'filterChange' || action === 'sort' || action === 'columnViewChange') {
          setSearch(tableState.searchText);
          setFilter(tableState.filterList);
          for (var idx in tableState.columns) {
            sort[idx] = tableState.columns[idx].sortDirection;
            displayList[idx] = tableState.columns[idx].display;
          }
          setSort(sort);
          setDisplayList(displayList);
        }
      }
    },
    customSort: (data, colIndex, order) => {
      //custom sort if management ip or datetime
      if (colIndex === 2) {
        if (order === 'asc') {
          return data.sort((a, b) => {
            const num1 = Number(a.data[2].split(".").map((num) => (`000${num}`).slice(-3)).join(""));
            const num2 = Number(b.data[2].split(".").map((num) => (`000${num}`).slice(-3)).join(""));
            return (num1 > num2 ? 1 : -1);
          })
        } else if (order === 'desc') {
          return data.sort((a, b) => {
            const num1 = Number(a.data[2].split(".").map((num) => (`000${num}`).slice(-3)).join(""));
            const num2 = Number(b.data[2].split(".").map((num) => (`000${num}`).slice(-3)).join(""));
            return (num1 < num2 ? 1 : -1);
          });
        }
      } else if (colIndex === 5) {
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
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <CustomToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        onRowsDelete={deleteDevice}
      />
    ),
    customToolbar: () => {
      return (
        <CustomToolbar
          show={show}
          setShow={setShow}
          setShowButton={setShowButton}
          setDevice={setDevice}
        />
      );
    },
    isRowSelectable: (dataIndex) => {
      //only allow row to be selected if device is not locked or if you are not the one locking it
      if (data[dataIndex].locked_bool != false) {
        if (data[dataIndex].locked_by == user.id) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  };

  //triggers from the confirm delete modal and deletes the row(s) of deleted selected devices
  const deleteMult = () => {
    for (var idx in selectedDevices) {
      authAPI.delete(`/dbase/inventory/${selectedDevices[idx].id}`)
        .then(() => {
          refreshDevices();
        }).catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
    }
    setSelectedRows([]);
    setShowDeleteConfirm(false);
  }

  //connected to delete icon in CustomToolbarSelect
  //selectedDevices is pushed to the delete confirmation dialog so it has a list of devices
  const deleteDevice = (displayData, setSelectedRows, selectedRows) => {
    var tempDeviceList = [];
    setSingleDelete(false);
    for (var idx in selectedRows.data) {
      var rowId = selectedRows.data[idx].dataIndex;
      tempDeviceList.push(data[rowId]);
    }
    setSelectedDevices(tempDeviceList);
  };

  //enforces that the delete confirmation wont show first time through
  useEffect(() => {
    if (selectedDevices.length > 0) {
      setShowDeleteConfirm(true);
    }
  }, [selectedDevices])

  //called if inline edit button is clicked
  const editRow = (event, id) => {
    setId(id);
    authAPI.get(`/dbase/inventory/${id}`)
      .then(({ data }) => {
        const rows = data.data;
        setDevice(rows);
      }).catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }

  //handle single row deletion
  const handleDelete = () => {
    authAPI.delete(`/dbase/inventory/${deviceId}`)
      .then(() => {
        refreshDevices();
        setShowDeleteConfirm(false);
      }).catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }

  //called if inline delete button clicked
  //provides needed information for confirmation dialog
  const inLineDelete = (event, id) => {
    setDeviceId(id);
    authAPI.get(`/dbase/inventory/${id}`)
      .then(({ data }) => {
        const rows = data.data;
        setSingleDelete(true);
        setShowDeleteConfirm(true);
        setDevice(rows);
      }).catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  };

  const refreshDevices = () => {
    authAPI.get("/dbase/inventory")
      .then(({ data }) => {
        const rows = data.data;
        setData(rows);
      }).catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  };

  //closes dialogs if cancel is clicked
  const handleClose = () => {
    setShow(false);
    setShowDeleteConfirm(false);
  };

  //get user id to add to post body before starting vapi calls
  //then call submitInv()
  const handleSubmit = () => {
    setFirst(false);
    submitInv(user.id);
  }

  //first VAPI call
  const submitInv = (user_id) => {
    var device_array = [];
    device_array.push(device);
    var postData = device;
    postData["created_by"] = user_id;
    setLoading(true);

    authAPI.post("/inventory", device_array)
      .then((data) => {
        const job_id = data.data.data
        checkStatus(job_id, postData);
      })
      .catch(error => {
        setLoading(false);
        if (error.response != undefined) {
          let errorReturned;
          try {
            errorReturned = JSON.parse(error.response.data.error);
          } catch {
            errorReturned = error.response.data.error;
          }
          if (errorReturned.detail != undefined) {
            showNotification(errorReturned.detail, 'error', enqueueSnackbar, closeSnackbar);
          } else {
            showNotification("Currently unable to connect to VAPI.", 'error', enqueueSnackbar, closeSnackbar);
          }

        } else {
          showNotification("Currently unable to connect to VAPI.", 'error', enqueueSnackbar, closeSnackbar);
        }
      });

  };

  //updating validating progress circle
  const progress = () => {
    setCircleValue(circleValue => (circleValue >= 80 ? 95 : circleValue + 25));
  }

  const checkStatus = (job_id, postData) => {
    progress();
    if (showButton === false) {
      authAPI.get("/dbase/inventory")
        .then(({ data }) => {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            if (postData.mgmt_ip === obj.mgmt_ip && postData.hostname === obj.hostname) {
              showNotification("The hostname " + postData.hostname + " and the management IP " + postData.mgmt_ip + " already exists in Proteus Inventory", 'error', enqueueSnackbar, closeSnackbar);
              setDuplicateIP(true);
              setDuplicateHost(true);
              setLoading(false);
              return;
            }
            else if (postData.mgmt_ip === obj.mgmt_ip) {
              showNotification("The management IP " + postData.mgmt_ip + " already exists in Proteus Inventory", 'error', enqueueSnackbar, closeSnackbar);
              setDuplicateIP(true);
              setLoading(false);
              return;
            }
            else if (postData.hostname === obj.hostname) {
              showNotification("The hostname " + postData.hostname + " already exists in Proteus Inventory", 'error', enqueueSnackbar, closeSnackbar);
              setDuplicateHost(true);
              setLoading(false);
              return;
            }
          }
          setTimeout(() => {
            if (duplicateIP === false || duplicateHost === false) {
              authAPI.get(`/status/${job_id}`)
                .then((data) => {
                  //check if the call is still processing,
                  //if it is wait 5 seconds and call again
                  if (data.data.code == 102) {
                    setTimeout(() => {
                      checkStatus(job_id, postData);
                    }, 5000);
                  } else if (data.data.code !== 200) {
                    var error = JSON.parse(data.data.data);
                    setLoading(false);
                    setCircleValue(5);
                    showNotification(error.detail, 'error', enqueueSnackbar, closeSnackbar);
                  } else {
                    //If adding a new device, post, else patch the data
                    //Make decision based on what button is shown
                    if (showButton === false) {
                      var postMsg = JSON.parse(data.data.data);
                      showNotification(postMsg.message, 'info', enqueueSnackbar, closeSnackbar);
                      authAPI.post("/dbase/inventory", { "data": [postData] })
                        .then(() => {
                          showNotification("Your device has been successfully added to the Proteus inventory.", 'success', enqueueSnackbar, closeSnackbar);
                          refreshDevices();
                          setLoading(false);
                          setShow(false);
                          setCircleValue(5);

                        })
                        .catch(() => {
                          setLoading(false);
                          setCircleValue(5);
                          showNotification("Either the Host Name or Management IP you entered is already in the Proteus inventory.", 'error', enqueueSnackbar, closeSnackbar);
                        });
                    }
                  }
                })
                .catch(() => {
                  setLoading(false);
                  setCircleValue(5);
                  showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                });
            }
          }, 2000);

        }).catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
    }
    else if (showButton === true) {
      authAPI.get(`/status/${job_id}`)
        .then((data) => {
          //check if the call is still processing,
          //if it is wait 5 seconds and call again
          if (data.data.code == 102) {
            setTimeout(() => {
              checkStatus(job_id, postData);
            }, 5000);
          } else if (data.data.code !== 200) {
            var error = JSON.parse(data.data.data);
            setLoading(false);
            setCircleValue(5);
            showNotification(error.detail, 'error', enqueueSnackbar, closeSnackbar);
          } else {
            var patch_device = { "hostname": device.hostname, "mgmt_ip": device.mgmt_ip }
            //If adding a new device, post, else patch the data
            //Make decision based on what button is shown
            authAPI.patch(`/dbase/inventory/${id}`, { "data": patch_device })
              .then(() => {
                showNotification("Your device has been successfully changed", 'success', enqueueSnackbar, closeSnackbar);
                refreshDevices();
                setLoading(false);
                setCircleValue(5);
                setShow(false);
              })
              .catch(() => {
                setLoading(false);
                setCircleValue(5);
                showNotification("Either the Host Name or Management IP you entered is already in the Table", 'error', enqueueSnackbar, closeSnackbar);
              });
          }
        })
        .catch(() => {
          setLoading(false);
          setCircleValue(5);
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
    }
    //second VAPI call and post or patch if completed successfully

  }

  useEffect(() => {
    //get all inventory items to view on table
    authAPI.get("/dbase/inventory")
      .then((data) => {
        const rows = data.data.data;
        setData(rows);
      }).catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }, []);

  return (
    <React.Fragment>
      <MuiThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={"Inventory Management"}
          data={data}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      <DeviceInfoModal
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        device={device}
        showButton={showButton}
        setDevice={setDevice}
        submitInv={submitInv}
        loading={loading}
        circleValue={circleValue}
      />
      <DeleteConfirmModal
        showDeleteConfirm={showDeleteConfirm}
        handleClose={handleClose}
        handleDelete={handleDelete}
        device={device}
        selectedDevices={selectedDevices}
        singleDelete={singleDelete}
        deleteMult={deleteMult}
      />
    </React.Fragment>

  );
}

export default InventoryTable;
