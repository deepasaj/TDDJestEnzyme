import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import CustomToolbarSelectWorkflow from "./CustomToolbarSelectWorkflow";
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CustomToolbar from "./CustomToolbar";
import ConfirmationPopUp from "./JobConfirmationModal";
import { API_URL } from 'config';
import { withRouter, useParams } from 'react-router-dom';
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { getAuthHeader } from 'utils/auth';
import { useAuthAPI } from 'store/auth-store';


const useStyles = makeStyles(() => ({
  workflow_dropdown: {
    width: '300px',
    textAlign: 'left',
  },
  template_dropdown: {
    width: '200px',
    textAlign: 'left',
  },
  title: {
    fontSize: "35px",
    textAlign: "center",
    fontWeight: "400",
    marginBottom: "15px"
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

const DeploymentRequestTable = (props) => {
  const { history } = props;
  const classes = useStyles();
  const [state] = useStateValue();
  const { user } = state;
  const { createDeploymentGroupId } = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = React.useState([]);
  const [deviceList, setDeviceList] = React.useState([]);
  const [templateList, setTemplateList] = React.useState([]);
  const [buttonDisable, setButtonDisable] = React.useState(true);
  const [jobID, setJobID] = React.useState(-1);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const authAPI = useAuthAPI();

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
        display: 'false',
      }
    },
    {
      name: "hostname",
      label: "Host Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "mgmt_ip",
      label: "Management IP",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "workflow",
      label: "Choose Workflow",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var mapList = [];
          if (deviceList != undefined) {
            mapList = deviceList;
          }

          return (
            <TextField
              className={classes.workflow_dropdown}
              name="workflow"
              label="Workflow"
              placeholder="Workflow"
              value={value || ''}
              onChange={e => {
                updateValue(e.target.value);
                updateData(e, tableMeta.rowIndex);
                updateTemplate(e, tableMeta);
              }
              }
              select
            >
              {mapList.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          );
        }
      }
    },
    {
      name: "base_config_choice",
      label: "Template",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          var showTemplateField = true;
          var dropDown = false;
          var templateObject;
          var dropDownList = [];
          var template;

          //only set variables when tableMeta data has been filled
          if (data[tableMeta.rowIndex] != undefined) {
            template = data[tableMeta.rowIndex].template;
            templateObject = "deviceList" + data[tableMeta.rowIndex].hostname;
          }

          //do not show template drop down until workflow has been selected
          if (tableMeta.rowData != undefined) {
            if (tableMeta.rowData[8] != "") {
              showTemplateField = false;
            }
          }

          // capture the correct templates to match for each row
          // dropDownList is array containing the specific hostname template choices
          // if dropDownList has more than one choice, signal that a drop down must be rendered
          if (templateList[templateObject] != undefined) {
            dropDownList = templateList[templateObject];
            if (dropDownList.length > 1) {
              dropDown = true;
            } else {
              // addresses when template field is autofilled
              // showTemplateField = false;
              presetTemplate(dropDownList[0], tableMeta.rowIndex);
              if (tableMeta.tableData[tableMeta.rowIndex] != undefined) {
                if (tableMeta.tableData[tableMeta.rowIndex].data != undefined) {
                  tableMeta.tableData[tableMeta.rowIndex].data[9] = dropDownList[0];
                }
                checkForCompletion();
              }
            }
          } else {
            showTemplateField = true;  //only show template field if there is a template to show
          }

          //check to make sure dropDownList available to avoid front end errors
          //will appear as emtpy drop down if dropDownList is undefined
          var mapList = [];
          if (dropDownList != undefined) {
            mapList = dropDownList;
          }

          return (
            <React.Fragment>
              {dropDown ? (
                <TextField
                  className={classes.template_dropdown}
                  name="base_config_choice"
                  label="Choose Template"
                  placeholder="Choose Template"
                  value={template || ''}
                  hidden={showTemplateField}
                  onChange={e => {
                    updateValue(template);
                    setTemplate(e, tableMeta.rowIndex);
                    checkForCompletion();
                  }
                  }
                  select
                >
                  {mapList.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                  <TextField
                    className={classes.template_dropdown}
                    name="base_config_choice"
                    label="Template"
                    placeholder="Template"
                    value={template || ''}
                    hidden={showTemplateField}
                    InputProps={{
                      readOnly: true,
                    }}
                  >
                  </TextField>
                )
              }
            </React.Fragment>
          );
        }
      }
    }
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "scrollMaxHeight",
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    print: false,
    customSort: (data, colIndex, order) => {
      //sort differently if column is date or management ip
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
      } else if (colIndex === 7) {
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
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      return (
        <CustomToolbarSelectWorkflow
          selectedRows={selectedRows}
          displayData={displayData}
          setSelectedRows={setSelectedRows}
          deviceList={deviceList}
          updateBulkWorkflows={updateBulkWorkflows}
        />
      );
    },
    customToolbar: () => {
      return (
        <CustomToolbar
          postJob={postJob}
          disableButton={buttonDisable}
          setShowConfirmation={setShowConfirmation}
        />
      );
    },
  };

  //check for all template fields in table being filled out
  const checkForCompletion = () => {
    var allTemplatesSelected = false; // eslint-disable-line
    for (var i = 0; i < data.length; i++) {
      if (data[i].template == "") {
        //there is still a template field blank
        allTemplatesSelected = false;
        return;
      } else {
        allTemplatesSelected = true;
      }
    }
    if (allTemplatesSelected = true) { // eslint-disable-line
      setButtonDisable(false);
    }
  }


  //set Templates columns of all selected rows assigned a workflow in the header
  const updateBulkWorkflows = (val, selectedRows, setSelectedRows) => {
    for (var row in selectedRows.data) {
      var tableIdx = selectedRows.data[row].index;
      data[tableIdx].workflow = val;
      var body = { "hostname": data[tableIdx].hostname };
      var rowList = "deviceList" + data[tableIdx].hostname;
      captureWorkflows(rowList, row, body);
    }
    setSelectedRows([]);

  }

  //adds template to templateList when workflow chosen in header
  //templateList will return an array
  //the template column rendering is determined by the length of this array
  //each time it is called, the templateList state adds to the object another key, value pair
  //key will be "deviceList{hostname}" value will be templateList array
  const captureWorkflows = (rowList, row, body) => {
    if (templateList[rowList] == undefined) {
      let didTimeOut = false;
      // eslint-disable-next-line no-undef
      new Promise(function (resolve, reject) {

        setTimeout(function () {
          didTimeOut = true;
          reject(new Error('Request timed out'));
        }, 5000);

        authAPI.fetch(`${API_URL}/list_templates`, {
          method: 'POST',
          body: JSON.stringify(body)
        }).then(response => response.json())
          .then(response => {
            if (!didTimeOut) {
              resolve(response);
              if (response.error != undefined) {
                showNotification("Currently unable to connect to BCG.", 'error', enqueueSnackbar, closeSnackbar);
              } else {
                if (response.data.length == 0) {
                  showNotification(`There was no template found related to the given hostname: ${data[row].hostname}.`, 'error', enqueueSnackbar, closeSnackbar);
                } else {
                  setTemplateList(prevState => {
                    return { ...prevState, [rowList]: response.data }
                  });
                }
              }
            }
          })
          .catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
          });
      })
        .then(function () {
        })
        .catch(function () {
          // Error: response error, request timeout or runtime error
          showNotification("Currently unable to connect to BCG.", 'error', enqueueSnackbar, closeSnackbar);
        });

    }
  }

  //workflow dropdown change
  const updateData = (e, idx) => {
    data[idx].workflow = e.target.value;
    setData(data);
  }

  //if templateList is one item long, we automatically populate the template with the option
  const presetTemplate = (val, idx) => {
    data[idx].template = val;
    setData(data);
  }

  //if templateList > 1, wait for selection then set template
  const setTemplate = (e, idx) => {
    data[idx].template = e.target.value;
    setData(data);
  }

  //fills template list with an object per row
  //if workflow is chosen in table row
  //each time it is called, the templateList state adds to the object another key, value pair
  //key will be "deviceList{hostname}" value will be templateList array
  const updateTemplate = (e, tdm) => {
    var body = { "hostname": tdm.rowData[1] };
    var rowList = "deviceList" + data[tdm.rowIndex].hostname;
    //may be an issue if there is more than one option in the workflows drop down
    if (templateList[rowList] == undefined) {
      let didTimeOut = false;
      // eslint-disable-next-line no-undef
      new Promise(function (resolve, reject) {

        const timeout = setTimeout(function () {
          didTimeOut = true;
          reject(new Error('Request timed out'));
        }, 5000);

        authAPI.fetch(`${API_URL}/list_templates`, {
          method: 'POST',
          body: JSON.stringify(body)
        }).then(response => response.json())
          .then(response => {
            clearTimeout(timeout);
            if (!didTimeOut) {
              resolve(response);
              if (response.error != undefined) {
                showNotification("Currently unable to connect to BCG.", 'error', enqueueSnackbar, closeSnackbar);
              } else {
                if (response.data.length == 0) {
                  showNotification(`There was no template found related to the given hostname: ${tdm.rowData[1]}.`, 'error', enqueueSnackbar, closeSnackbar);
                } else {
                  setTemplateList({ ...templateList, [rowList]: response.data });
                }
              }
            }
          })
          .catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
          });
      })
        .then(function () {
        })
        .catch(function () {
          showNotification("Currently unable to connect to BCG.", 'error', enqueueSnackbar, closeSnackbar);
        });
    }
  }

  //kick off job creation orchestration
  //called in JobConfirmationModal.js
  const postJob = (title) => {
    const jobCreationBody = { "data": [{ "user_id": user.id, "user_selections": data, "name": title }] }

    let didTimeOut = false;
    let didTimeOut2 = false;
    let didTimeOut3 = false;

    //timeout for /dbase/job
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`${API_URL}/dbase/job`, {
        method: 'POST',
        body: JSON.stringify(jobCreationBody)
      }).then(response => response.json())
        .then((response) => {
          clearTimeout(timeout);
          if (!didTimeOut) {
            resolve(response);
            if (true) { // eslint-disable-line
              var id = response.id;
              setJobID(id);
              const createJobInput = { "data": [{ "id": id }] }

              //timeout for /job_create
              // eslint-disable-next-line no-undef
              new Promise(function (resolve, reject) {

                const timeout2 = setTimeout(function () {
                  didTimeOut2 = true;
                  reject(new Error('Request timed out'));
                }, 5000);

                authAPI.fetch(`${API_URL}/job_create`, {
                  method: 'POST',
                  body: JSON.stringify(createJobInput)
                }).then(response => response.json())
                  .then(response => {
                    clearTimeout(timeout2);
                    if (!didTimeOut2) {
                      resolve(response);
                      if (true) { // eslint-disable-line

                        //timeout for /orchestration/start-orchestration/${id}
                        // eslint-disable-next-line no-undef
                        new Promise(function (resolve, reject) {

                          const timeout3 = setTimeout(function () {
                            didTimeOut3 = true;
                            reject(new Error('Request timed out'));
                          }, 5000);

                          authAPI.fetch(`${API_URL}/orchestration/start-orchestration/${id}`, {
                            method: 'POST'
                          })
                            .then(() => {
                              clearTimeout(timeout3);
                              if (!didTimeOut3) {
                                resolve(response);
                                setShowConfirmation(false);
                                history.push('/job')
                              }
                            }).catch(() => {
                              showNotification("There was an error submitting the request for initial orchestration for this job to execute any prerequisites tasks. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                            });

                        })
                          .then(function () {
                          })
                          .catch(function () {
                            // Error: response error, request timeout or runtime error
                            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                          });

                      }
                    }

                  }).catch(() => {
                    showNotification("There was an error submitting the Deployment Request. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                  });

              })
                .then(function () {
                })
                .catch(function () {
                  // Error: response error, request timeout or runtime error
                  showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                });


            }
          }
        }).catch(() => {
          showNotification("There was an error submitting the Deployment Request. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });


  }

  //set data state to be seen on table
  //calling get_back_ref endpoint by specified group id to use relationships between inventory and deployment groups
  //get workflows for column dropdown
  useEffect(() => {
    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`${API_URL}/dbase/get_back_ref/deploy/id:${createDeploymentGroupId}`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          clearTimeout(timeout);
          if (!didTimeOut) {
            resolve(response);
            const devices = response.data[0].devices //we asked for a single ID. API returns a list of IDs so index 0 is all we care about
            const devices_data = devices.map(function (device) { //HACK to add workflow column, I don't know the correct way to do this.
              device.workflow = '';
              device.template = '';
              return device;
            })
            setData(devices_data);
          }
        }).catch(() => {
          showNotification("There was an error retrieving Deployment Group from database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
    let didTimeOut2 = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut2 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`${API_URL}/dbase/workflow_types`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          clearTimeout(timeout);
          if (!didTimeOut2) {
            resolve(response);
            let wf_types = []
            response.data.forEach(row => {
              if (row.type != "DA Validation") {
                wf_types.push(row.type);
              }
            });
            setDeviceList(wf_types);
          }
        }).catch(() => {
          showNotification("There was an error retrieving the workflow options. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });


  }, []);

  return (
    <React.Fragment>
      <MuiThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={"Choose Workflow(s) for each Device"}
          data={data}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      <ConfirmationPopUp
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        jobID={jobID}
        postJob={postJob}
      />
    </React.Fragment>
  );
}

export default withRouter(DeploymentRequestTable);