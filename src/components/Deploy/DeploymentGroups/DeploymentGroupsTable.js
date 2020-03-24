import React, { useEffect } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from "@material-ui/core/Tooltip";
import LoadingPage from './LoadingPage';
import CustomToolbar from './DeploymentGroupCustomToolbar';
import DeleteConfirmModal from './DeleteConfirmationDialog';
import { withRouter } from 'react-router-dom';
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store'


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
    width: '200px'
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
    }
  }
});

const DeploymentGroupsTable = (props) => {
  const { history } = props;
  const [state] = useStateValue();
  const authAPI = useAuthAPI();

  const { user } = state;
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = React.useState();
  const [displayDeployments, setDisplayDeployments] = React.useState([]);
  const [title, setTitle] = React.useState(""); // eslint-disable-line
  const [titleRow, setTitleRow] = React.useState(); // eslint-disable-line
  const [submitTitle, setSubmitTitle] = React.useState(true); // eslint-disable-line
  const [editRow, setEditRow] = React.useState({}); // eslint-disable-line
  const [loadingDone, setLoadingDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true); // eslint-disable-line
  const [expandRow, setExpandRow] = React.useState([]); // eslint-disable-line
  const [groupId, setGroupId] = React.useState(-1);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [show, setShow] = React.useState(false); // eslint-disable-line

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "name",
      label: "Title",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "user.display_name",
      label: "Owner",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "timestamp",
      label: "Timestamp",
      options: {
        filter: true,
        sort: true,
        sortDirection: "desc",
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
      name: "Deployment",
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRender: (value, tableMeta) => {
          var ownsGroup = true;
          if (tableMeta.rowData != undefined) {
            if (tableMeta.rowData[2] === user.display_name) {
              ownsGroup = false;
            }
          }
          return (
            <React.Fragment>
              <Button
                color="primary"
                variant="contained"
                onClick={() => { handleOpenDeployments(tableMeta) }}
                className={classes.primary_btn}
                disabled={ownsGroup}
              >
                Create
              </Button>
            </React.Fragment>

          );
        }
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
          var ownsGroup = true;
          if (tableMeta.rowData != undefined) {
            if (tableMeta.rowData[2] === user.display_name) {
              ownsGroup = false;
            }
          }
          return (
            <React.Fragment>
              <Tooltip title="Edit">
                <span>
                  <IconButton
                    aria-label="edit"
                    onClick={() => { handleEditDeployments(tableMeta) }}
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
                    onClick={event => { inLineDelete(event, tableMeta.rowData[0]) }}
                    className={classes.edit_btn}
                    disabled={ownsGroup}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
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
    rowsPerPageOptions: [5, 10, 15],
    print: false,
    expandableRows: true,
    customSort: (data, colIndex, order) => {
      //sort differently if column is date
      if (colIndex === 3) {
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
      var rowList = `row${rowData[0]}`;
      var mapList = [];
      var emptyRow = true;

      //do null checks to avoid front end errors
      //if they pass, set mapList which will be list of devices that are attached to that deployment group
      //if no devices under that group, display message
      if (data != undefined) {
        if (data[rowList] != undefined) {
          mapList = data[rowList];
          if (mapList.length > 0) {
            emptyRow = false;
          }
        }
      }

      return (
        <React.Fragment>
          {emptyRow ? (
            <TableRow>
              <TableCell colSpan={colSpan} className={classes.emptyRow}>
                No devices found for Deployment Group {rowData[0]}.
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
                    {mapList.map((row, index) => {
                      return (
                        <TableBody key={index} className={classes.rowExpand}>
                          <TableRow key={index} className={classes.rowExpand}>
                            <TableCell alight="left">
                              {row.hostname}
                            </TableCell>
                            <TableCell alight="right">{row.mgmt_ip}</TableCell>
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
    },
    customToolbar: () => {
      return (
        <CustomToolbar />
      );
    }
  };

  //redirect to create deployment group request table with specified deployment_id
  const handleOpenDeployments = (tableMeta) => {
    var deployment_id = tableMeta.rowData[0];
    history.push(`/deploy/deployment/create/${deployment_id}`);
  };

  //redirect to edit deployment group to edit deployment group
  const handleEditDeployments = (tableMeta) => {
    var deployment_id = tableMeta.rowData[0];
    history.push(`/deploy/group/edit/${deployment_id}`);
  };

  //closes dialogs if cancel is clicked
  const handleClose = () => {
    setShow(false);
    setShowDeleteConfirm(false);
  }

  //handle single row deletion
  const handleDelete = () => {
    authAPI.delete(`/dbase/get_back_ref/deploy/id:${groupId}`)
      .then(() => {
        setShowDeleteConfirm(false);
        setLoadingDone(false);
        refreshDevices();
      }).catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }

  //called if inline delete button clicked
  //provides needed information for confirmation dialog
  const inLineDelete = (event, id) => {
    setGroupId(id);
    setShowDeleteConfirm(true);
  };

  const refreshDevices = () => {
    authAPI.get(`/dbase/get_back_ref/deploy`)
      .then((response) => {
        const deploymentGroups = subNullsForEmptyStrings(response.data.data);
        deploymentGroups.forEach((deploymentGroup) => {
          setData((previous) => {
            return ({ ...previous, [`row${deploymentGroup.id}`]: deploymentGroup.devices })
          })
        })
        setDisplayDeployments(deploymentGroups);
        setLoadingDone(true)
      })
      .catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  };
//
//    //deletes whole deployment group and updates relationship values in crud endpoint
//    //after successful deletion, redirect to deployment group table
//    const inLineDelete = (group_id) => {
//        let didTimeOut = false;
//        new Promise(function (resolve, reject) {
//
//            const timeout = setTimeout(function () {
//                didTimeOut = true;
//                reject(new Error('Request timed out'));
//            }, 5000);
//
//            authAPI.fetch(`/dbase/get_back_ref/deploy/id:${group_id}`, {
//                method: 'DELETE'
//            }).then((response) => {
//                clearTimeout(timeout);
//                if (!didTimeOut) {
//                    resolve(response);
//                    window.location.href = `${API_URL}/deploy/deployment_groups`;
//                }
//            }).catch(error => {
//                handleClickVariant("There was an error contacting the database. Please contact administrator. this?", 'error');
//            });
//
//        })
//            .then(function () {
//            })
//            .catch(function (err) {
//                handleClickVariant("There was an error contacting the database. Please contact administrator.hereeeeee", 'error');
//            });
//    };

    useEffect(() => {
      authAPI.get(`/dbase/get_back_ref/deploy`)
        .then((response) => {
          const deploymentGroups = subNullsForEmptyStrings(response.data.data);
          deploymentGroups.forEach((deploymentGroup) => {
            setData((previous) => {
              return ({ ...previous, [`row${deploymentGroup.id}`]: deploymentGroup.devices })
            })
          })
          setDisplayDeployments(deploymentGroups);
          setLoadingDone(true)
          })
          .catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
          });
    }, []);

  return (
    <React.Fragment>
      {loadingDone ? (
        <React.Fragment>
          <MuiThemeProvider theme={tableTheme}>
            <MUIDataTable
              title={"Deployment Groups"}
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
        </React.Fragment>
      ) : (
          <LoadingPage />
        )}
    </React.Fragment>
  );
};

const subNullsForEmptyStrings = (rows) => {
  for (var idx in rows) {
    if (rows[idx].name == null) {
      rows[idx].name = '';
    }
  }
  return rows;
}

export default withRouter(DeploymentGroupsTable);
