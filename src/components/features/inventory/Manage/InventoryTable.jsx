import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';
import { useAuthAPI, useUser, useIsAdmin } from 'store/store';
import CustomToolbar from './AddDeviceToolbar';
import CustomToolbarSelect from './CustomToolbarSelect';
import DeviceInfoModal from './DeviceInfoDialog';
import DeleteConfirmModal from './DeleteConfirmationDialog';
import { useFeaturePermission } from '../hooks';


const InvStyles = makeStyles(() => ({
  actionButton: {
    margin: '-6px 10px -6px -6px',
    padding: 6,
  },
}));

const tableTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '10px 30px 10px 30px',
      },
    },
  },
});


const InventoryTable = () => {
  const classes = InvStyles();
  const authAPI = useAuthAPI();

  const user = useUser();
  const [, hasWriteAccess] = useFeaturePermission();
  const isAdmin = useIsAdmin();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState();
  const [device, setDevice] = useState({
    hostname: '',
    mgmt_ip: '',
  });
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [deviceId, setDeviceId] = useState(-1);
  const [id, setId] = useState(-1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([[], [], [], [], [], [], []]);
  const [sort, setSort] = useState(['none', 'none', 'none', 'none', 'none', 'desc', 'none']);
  const [displayList, setDisplayList] = useState(['false', 'true', 'true', 'true', 'true', 'true', 'false']);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [singleDelete, setSingleDelete] = useState();
  const [loading, setLoading] = useState(false);
  const [circleValue, setCircleValue] = useState(5);
  const [duplicateHost, setDuplicateHost] = useState(false);
  const [duplicateIP, setDuplicateIP] = useState(false);

  const lockedByFilterOptions = _.chain(data)
    .map((row) => _.get(row, 'lock_user.display_name'))
    .filter(Boolean)
    .uniq()
    .value();

  // called if inline edit button is clicked
  const editRow = (event, id) => {
    setId(id);
    authAPI.get(`/inventory/device/${id}`)
      .then(({ data }) => {
        const rows = data.data;
        setDevice(rows);
      }).catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error',
          enqueueSnackbar,
          closeSnackbar,
        );
      });
  };


  const refreshDevices = () => {
    authAPI.get('/inventory/devices')
      .then(({ data }) => {
        const rows = data.data;
        setData(rows);
      }).catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error',
          enqueueSnackbar,
          closeSnackbar,
        );
      });
  };

  // handle single row deletion
  const handleDelete = () => {
    authAPI.delete(`/inventory/device/${deviceId}/delete`)
      .then(() => {
        refreshDevices();
        setShowDeleteConfirm(false);
      }).catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error',
          enqueueSnackbar,
          closeSnackbar,
        );
      });
  };

  // called if inline delete button clicked
  // provides needed information for confirmation dialog
  const inLineDelete = (event, id) => {
    setDeviceId(id);
    authAPI.get(`/inventory/device/${id}`)
      .then(({ data }) => {
        const rows = data.data;
        setSingleDelete(true);
        setShowDeleteConfirm(true);
        setDevice(rows);
      }).catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error',
          enqueueSnackbar,
          closeSnackbar,
        );
      });
  };

  // closes dialogs if cancel is clicked
  const handleClose = () => {
    setShow(false);
    setShowDeleteConfirm(false);
  };

  // updating validating progress circle
  const progress = () => {
    setCircleValue((circleValue) => (circleValue >= 80 ? 95 : circleValue + 25));
  };

  const checkStatus = async (jobId, postData) => {
    progress();
    if (showButton === false) {
      let existingDevice;
      const [{ data: byIP }, { data: byHostname }] = await Promise.all([
        authAPI.get(`/inventory/devices?mgmt_ip=${encodeURIComponent(postData.mgmt_ip)}`),
        authAPI.get(`/inventory/devices?hostname=${postData.hostname}`),
      ]);

      if (byIP.data.length) {
        existingDevice = byIP.data[0];
      } else if (byHostname.data.length) {
        existingDevice = byHostname.data[0];
      }

      if (existingDevice) {
        if (postData.mgmt_ip === existingDevice.mgmt_ip && postData.hostname === existingDevice.hostname) {
          showNotification(
            `The hostname ${postData.hostname} and the management IP `
            + `${postData.mgmt_ip} already exists in Proteus Inventory`,
            'error',
            enqueueSnackbar,
            closeSnackbar,
          );
          setDuplicateIP(true);
          setDuplicateHost(true);
          setLoading(false);
          return;
        }
        if (postData.mgmt_ip === existingDevice.mgmt_ip) {
          showNotification(
            `The management IP ${postData.mgmt_ip} already exists in Proteus Inventory`,
            'error',
            enqueueSnackbar,
            closeSnackbar,
          );
          setDuplicateIP(true);
          setLoading(false);
          return;
        }
        if (postData.hostname === existingDevice.hostname) {
          showNotification(
            `The hostname ${postData.hostname} already exists in Proteus Inventory`,
            'error',
            enqueueSnackbar,
            closeSnackbar,
          );
          setDuplicateHost(true);
          setLoading(false);
          return;
        }
      }

      setTimeout(() => {
        if (duplicateIP === false && duplicateHost === false) {
          authAPI.get(`/inventory/validation_status/${jobId}`)
            .then(({ data }) => {
              // check if the call is still processing,
              // if it is wait 5 seconds and call again
              if (data.code === 102) {
                setTimeout(() => {
                  checkStatus(jobId, postData);
                }, 5000);
              } else if (data.code !== 200) {
                const error = JSON.parse(data.data);
                setLoading(false);
                setCircleValue(5);
                showNotification(error.detail, 'error', enqueueSnackbar, closeSnackbar);
              } else if (showButton === false) {
                // If adding a new device, post, else patch the data
                // Make decision based on what button is shown
                const postMsg = JSON.parse(data.data);
                showNotification(postMsg.message, 'info', enqueueSnackbar, closeSnackbar);
                authAPI.post('/inventory/device/create', { data: postData })
                  .then(() => {
                    showNotification(
                      'Your device has been successfully added to the Proteus inventory.',
                      'success',
                      enqueueSnackbar,
                      closeSnackbar,
                    );
                    refreshDevices();
                    setLoading(false);
                    setShow(false);
                    setCircleValue(5);
                  })
                  .catch(() => {
                    setLoading(false);
                    setCircleValue(5);
                    showNotification(
                      'Either the Host Name or Management IP you entered is already in the Proteus inventory.',
                      'error',
                      enqueueSnackbar,
                      closeSnackbar,
                    );
                  });
              }
            })
            .catch(() => {
              setLoading(false);
              setCircleValue(5);
              showNotification(
                'There was an error contacting the database. Please contact administrator.',
                'error',
                enqueueSnackbar,
                closeSnackbar,
              );
            });
        }
      }, 2000);
    } else if (showButton === true) {
      authAPI.get(`/inventory/validation_status/${jobId}`)
        .then((data) => {
          // check if the call is still processing,
          // if it is wait 5 seconds and call again
          if (data.data.code === 102) {
            setTimeout(() => {
              checkStatus(jobId, postData);
            }, 5000);
          } else if (data.data.code !== 200) {
            const error = JSON.parse(data.data.data);
            setLoading(false);
            setCircleValue(5);
            showNotification(error.detail, 'error', enqueueSnackbar, closeSnackbar);
          } else {
            const updatedDevice = { hostname: device.hostname, mgmt_ip: device.mgmt_ip };
            // If adding a new device, post, else patch the data
            // Make decision based on what button is shown
            authAPI.patch(`/inventory/device/${id}/update`, { data: updatedDevice })
              .then(() => {
                showNotification(
                  'Your device has been successfully changed',
                  'success',
                  enqueueSnackbar,
                  closeSnackbar,
                );
                refreshDevices();
                setLoading(false);
                setCircleValue(5);
                setShow(false);
              })
              .catch(() => {
                setLoading(false);
                setCircleValue(5);
                showNotification(
                  'Either the Host Name or Management IP you entered is already in the Table',
                  'error',
                  enqueueSnackbar,
                  closeSnackbar,
                );
              });
          }
        })
        .catch(() => {
          setLoading(false);
          setCircleValue(5);
          showNotification(
            'There was an error contacting the database. Please contact administrator.',
            'error',
            enqueueSnackbar,
            closeSnackbar,
          );
        });
    }
    // second VAPI call and post or patch if completed successfully
  };

  // first VAPI call
  const submitInv = (userId) => {
    const deviceArray = [];
    deviceArray.push(device);
    const postData = device;
    postData.created_by = userId;
    setLoading(true);

    authAPI.post('/inventory/validate', deviceArray)
      .then((data) => {
        const jobId = data.data.data;
        checkStatus(jobId, postData);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          let errorReturned;
          try {
            errorReturned = JSON.parse(error.response.data.error);
          } catch (e) {
            errorReturned = error.response.data.error;
          }
          if (errorReturned.detail) {
            showNotification(errorReturned.detail, 'error', enqueueSnackbar, closeSnackbar);
          } else {
            showNotification('Currently unable to connect to VAPI.', 'error', enqueueSnackbar, closeSnackbar);
          }
        } else {
          showNotification('Currently unable to connect to VAPI.', 'error', enqueueSnackbar, closeSnackbar);
        }
      });
  };

  // get user id to add to post body before starting vapi calls
  // then call submitInv()
  const handleSubmit = () => {
    submitInv(user.id);
  };


  // triggers from the confirm delete modal and deletes the row(s) of deleted selected devices
  const deleteMult = () => {
    selectedDevices.forEach((selectedDevice) => {
      authAPI.delete(`/inventory/device/${selectedDevice.id}/delete`)
        .then(() => {
          refreshDevices();
        }).catch(() => {
          showNotification(
            'There was an error contacting the database. Please contact administrator.',
            'error',
            enqueueSnackbar,
            closeSnackbar,
          );
        });
    });

    setSelectedRows([]);
    setShowDeleteConfirm(false);
  };

  // connected to delete icon in CustomToolbarSelect
  // selectedDevices is pushed to the delete confirmation dialog so it has a list of devices
  const deleteDevice = (selectedRows) => {
    setSingleDelete(false);
    setSelectedDevices(selectedRows.data.map((row) => data[row.dataIndex]));
  };

  const columns = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: true,
        display: displayList[0],
        filterList: filter[0],
        sortDirection: sort[0],
      },
    },
    {
      name: 'hostname',
      label: 'Host Name',
      options: {
        filter: true,
        sort: true,
        display: displayList[1],
        filterList: filter[1],
        sortDirection: sort[1],
      },
    },
    {
      name: 'mgmt_ip',
      label: 'Management IP',
      options: {
        filter: true,
        sort: true,
        display: displayList[2],
        filterList: filter[2],
        sortDirection: sort[2],
      },
    },
    {
      name: 'create_user.display_name',
      label: 'Created By',
      options: {
        filter: true,
        sort: true,
        display: displayList[3],
        filterList: filter[3],
        sortDirection: sort[3],
      },
    },
    {
      name: 'lock_user.display_name',
      label: 'Locked By',
      options: {
        filter: true,
        sort: true,
        display: displayList[4],
        filterList: filter[4],
        sortDirection: sort[4],
        filterOptions: {
          names: lockedByFilterOptions,
        },
      },
    },
    {
      name: 'timestamp',
      label: 'Timestamp',
      options: {
        filter: true,
        sort: true,
        display: displayList[5],
        sortDirection: sort[5],
        filterList: filter[5],
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
      name: 'locked_bool',
      label: 'Locked',
      options: {
        filter: true,
        sort: true,
        display: displayList[6],
        filterList: filter[6],
        sortDirection: sort[6],
        // show true/false for locked column and filter chip
        customBodyRender: (value, tableMeta) => <div>{tableMeta.rowData[6].toString()}</div>,
        customFilterListOptions: {
          render(value) {
            if (value) {
              return 'Locked';
            }
            return 'Unlocked';
          },
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
          let isDisabled = false;

          // undefined check and state set check
          // if passes, only set disabled if locked_bool is true and it is not belonging to current user
          if (tableMeta.rowData) {
            if (tableMeta.rowData[6] !== false) {
              if (tableMeta.rowData[4] !== user.display_name) {
                isDisabled = true;
              }
            }
          }
          if (isAdmin) {
            isDisabled = false;
          }
          const helper = `${tableMeta.rowData[1]} is currently part of a deployment group that does not belong to you.`
            + ' To unlock the device, please contact the locked by user.';

          return (
            <>
              {isDisabled ? (
                <>
                  <Tooltip title="Edit">
                    <span>
                      <IconButton
                        aria-label="edit"
                        onClick={(event) => {
                          editRow(event, tableMeta.rowData[0]);
                          setShowButton(true);
                          setShow(true);
                        }}
                        className={classes.actionButton}
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
                        onClick={(event) => { inLineDelete(event, tableMeta.rowData[0]); }}
                        className={classes.actionButton}
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
                        className={classes.actionButton}
                        disabled={!isDisabled}
                      >
                        <LockIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Edit">
                    <span>
                      <IconButton
                        aria-label="edit"
                        onClick={(event) => {
                          editRow(event, tableMeta.rowData[0]);
                          setShowButton(true);
                          setShow(true);
                        }}
                        className={classes.actionButton}
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
                        onClick={(event) => {
                          inLineDelete(event, tableMeta.rowData[0]);
                        }}
                        className={classes.actionButton}
                        disabled={isDisabled}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                </>
              )}
            </>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: hasWriteAccess ? 'multiple' : 'none',
    filterType: 'dropdown',
    responsive: 'scrollFullHeight',
    rowsPerPageOptions: [5, 10, 15],
    rowsPerPage: 10,
    print: false,
    searchText: search,
    rowsSelected: selectedRows,
    onRowsSelect: (rowsSelected, allRows) => {
      setSelectedRows(allRows.map((row) => row.dataIndex));
    },
    onTableChange: (action, tableState) => {
      // preserve state through table actions
      // hard set search, filter, sort, display list
      if (action !== 'propsUpdate') {
        if (action === 'search' || action === 'filterChange' || action === 'sort' || action === 'columnViewChange') {
          setSearch(tableState.searchText);
          setFilter(tableState.filterList);
          setSort(tableState.columns.map((column) => column.sortDirection));
          setDisplayList(tableState.columns.map((column) => column.display));
        }
      }
    },
    customSort: (data, colIndex, order) => {
      // custom sort if management ip or datetime
      if (colIndex === 2) {
        if (order === 'asc') {
          return data.sort((a, b) => {
            const num1 = Number(a.data[2].split('.').map((num) => (`000${num}`).slice(-3)).join(''));
            const num2 = Number(b.data[2].split('.').map((num) => (`000${num}`).slice(-3)).join(''));
            return (num1 > num2 ? 1 : -1);
          });
        } if (order === 'desc') {
          return data.sort((a, b) => {
            const num1 = Number(a.data[2].split('.').map((num) => (`000${num}`).slice(-3)).join(''));
            const num2 = Number(b.data[2].split('.').map((num) => (`000${num}`).slice(-3)).join(''));
            return (num1 < num2 ? 1 : -1);
          });
        }
      } else if (colIndex === 5) {
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
    customToolbarSelect: (selectedRows) => (
      <CustomToolbarSelect
        selectedRows={selectedRows}
        onRowsDelete={deleteDevice}
      />
    ),
    customToolbar: () => (
      <CustomToolbar
        show={show}
        setShow={setShow}
        setShowButton={setShowButton}
        setDevice={setDevice}
      />
    ),
    isRowSelectable: (dataIndex) => {
      // only allow row to be selected if device is not locked or if you are not the one locking it
      if (data[dataIndex].locked_bool !== false) {
        if (data[dataIndex].locked_by === user.id) {
          return true;
        }
        return false;
      }
      return true;
    },
  };

  // enforces that the delete confirmation wont show first time through
  useEffect(() => {
    if (selectedDevices.length > 0) {
      setShowDeleteConfirm(true);
    }
  }, [selectedDevices]);

  useEffect(() => {
    authAPI.get('/inventory/devices')
      .then(({ data }) => {
        const rows = data.data;
        setData(rows);
      }).catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error',
          enqueueSnackbar,
          closeSnackbar,
        );
      });
  }, []);

  return (
    <>
      <MuiThemeProvider theme={tableTheme}>
        <MUIDataTable
          title="Inventory Management"
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
    </>

  );
};

export default InventoryTable;
