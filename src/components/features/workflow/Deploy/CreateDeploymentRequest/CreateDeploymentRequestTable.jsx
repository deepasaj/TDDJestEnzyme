import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';
import ConfirmationPopUp from './JobConfirmationModal';
import CustomToolbar from './CustomToolbar';
import CustomToolbarSelectWorkflow from './CustomToolbarSelectWorkflow';


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
    fontSize: '35px',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: '15px',
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

const DeploymentRequestTable = () => {
  const history = useHistory();
  const classes = useStyles();
  const { createDeploymentGroupId } = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [jobID, setJobID] = useState(-1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const authAPI = useAuthAPI();

  // adds template to templateList when workflow chosen in header
  // templateList will return an array
  // the template column rendering is determined by the length of this array
  // each time it is called, the templateList state adds to the object another key, value pair
  // key will be "deviceList{hostname}" value will be templateList array
  const captureWorkflows = (rowList, row, body) => {
    if (!templateList[rowList]) {
      authAPI.post('/workflow/list_templates', body).then(({ data }) => {
        if (data.error) {
          showNotification('Currently unable to connect to BCG.', 'error', enqueueSnackbar, closeSnackbar);
        } else if (data.data.length === 0) {
          showNotification(
            `There was no template found related to the given hostname: ${data[row].hostname}.`,
            'error',
            enqueueSnackbar,
            closeSnackbar,
          );
        } else {
          setTemplateList((prevState) => ({
            ...prevState,
            [rowList]: data.data,
          }));
        }
      }).catch(() => {
        showNotification('Currently unable to connect to BCG.', 'error', enqueueSnackbar, closeSnackbar);
      });
    }
  };

  // set Templates columns of all selected rows assigned a workflow in the header
  const updateBulkWorkflows = (val, selectedRows, setSelectedRows) => {
    Object.entries(selectedRows.data).forEach(([key, row]) => {
      const tableIdx = row.index;
      const rowList = `deviceList${data[tableIdx].hostname}`;
      const body = { hostname: data[tableIdx].hostname };
      setData(data.map((row, index) => {
        if (tableIdx === index) {
          return {
            ...row,
            workflow: val,
          };
        }

        return row;
      }));
      captureWorkflows(rowList, key, body);
    });
    setSelectedRows([]);
  };

  // workflow dropdown change
  const updateData = (e, idx) => {
    data[idx].workflow = e.target.value;
    setData(data);
  };

  // if templateList is one item long, we automatically populate the template with the option
  const presetTemplate = (val, idx) => {
    data[idx].template = val;
    setData(data);
  };

  // if templateList > 1, wait for selection then set template
  const setTemplate = (e, idx) => {
    data[idx].template = e.target.value;
    setData(data);
  };

  // fills template list with an object per row
  // if workflow is chosen in table row
  // each time it is called, the templateList state adds to the object another key, value pair
  // key will be "deviceList{hostname}" value will be templateList array
  const updateTemplate = (e, tdm) => {
    const body = { hostname: tdm.rowData[1] };
    const rowList = `deviceList${data[tdm.rowIndex].hostname}`;
    // may be an issue if there is more than one option in the workflows drop down
    if (!templateList[rowList]) {
      authAPI.post('/workflow/list_templates', body).then(({ data }) => {
        if (data.error) {
          showNotification('Currently unable to connect to BCG.', 'error', enqueueSnackbar, closeSnackbar);
        } else if (data.data.length === 0) {
          showNotification(
            `There was no template found related to the given hostname: ${tdm.rowData[1]}.`,
            'error',
            enqueueSnackbar,
            closeSnackbar,
          );
        } else {
          setTemplateList({
            ...templateList,
            [rowList]: data.data,
          });
        }
      }).catch(() => {
        showNotification('Currently unable to connect to BCG.', 'error', enqueueSnackbar, closeSnackbar);
      });
    }
  };

  // kick off job creation orchestration
  // called in JobConfirmationModal
  const postJob = async (title) => {
    const jobCreationBody = { data: { user_selections: data, name: title } };

    try {
      const { data } = await authAPI.post('/workflow/job_create', jobCreationBody);
      const jobId = data.data.job_id;
      setJobID(jobId);
      await authAPI.post(`/workflow/start-orchestration/${jobId}`);
      setShowConfirmation(false);
      history.push('/workflow/job');
    } catch (e) {
      console.error(e);
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    }
  };

  // check for all template fields in table being filled out
  const checkForCompletion = () => {
    let allTemplatesSelected = true;

    for (let i = 0; i < data.length; i++) {
      if (data[i].template === '') {
        // there is still a template field blank
        allTemplatesSelected = false;
      }
    }

    if (allTemplatesSelected) {
      setButtonDisable(false);
    }
  };

  const columns = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: true,
        display: 'false',
      },
    },
    {
      name: 'hostname',
      label: 'Host Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'mgmt_ip',
      label: 'Management IP',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'workflow',
      label: 'Choose Workflow',
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          let mapList = [];
          if (deviceList) {
            mapList = deviceList;
          }

          return (
            <TextField
              className={classes.workflow_dropdown}
              name="workflow"
              label="Workflow"
              placeholder="Workflow"
              value={value || ''}
              onChange={(e) => {
                updateValue(e.target.value);
                updateData(e, tableMeta.rowIndex);
                updateTemplate(e, tableMeta);
              }}
              select
            >
              {mapList.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          );
        },
      },
    },
    {
      name: 'base_config_choice',
      label: 'Template',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let showTemplateField = true;
          let dropDown = false;
          let templateObject;
          let dropDownList = [];
          let template;

          // only set variables when tableMeta data has been filled
          if (data[tableMeta.rowIndex]) {
            // eslint-disable-next-line prefer-destructuring
            template = data[tableMeta.rowIndex].template;
            templateObject = `deviceList${data[tableMeta.rowIndex].hostname}`;
          }

          // do not show template drop down until workflow has been selected
          if (tableMeta.rowData) {
            if (tableMeta.rowData[8] !== '') {
              showTemplateField = false;
            }
          }

          // capture the correct templates to match for each row
          // dropDownList is array containing the specific hostname template choices
          // if dropDownList has more than one choice, signal that a drop down must be rendered
          if (templateList[templateObject]) {
            dropDownList = templateList[templateObject];
            if (dropDownList.length > 1) {
              dropDown = true;
            } else {
              // addresses when template field is autofilled
              presetTemplate(dropDownList[0], tableMeta.rowIndex);
              checkForCompletion();
            }
          } else {
            showTemplateField = true; // only show template field if there is a template to show
          }

          // check to make sure dropDownList available to avoid front end errors
          // will appear as emtpy drop down if dropDownList is undefined
          let mapList = [];
          if (dropDownList) {
            mapList = dropDownList;
          }

          return (
            <>
              {dropDown ? (
                <TextField
                  className={classes.template_dropdown}
                  name="base_config_choice"
                  label="Choose Template"
                  placeholder="Choose Template"
                  value={template || ''}
                  hidden={showTemplateField}
                  onChange={(e) => {
                    updateValue(template);
                    setTemplate(e, tableMeta.rowIndex);
                    checkForCompletion();
                  }}
                  select
                >
                  {mapList.map((option) => (
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
                />
              )}
            </>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'scrollMaxHeight',
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    print: false,
    customSort: (data, colIndex, order) => {
      // sort differently if column is date or management ip
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
      } else if (colIndex === 7) {
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
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <CustomToolbarSelectWorkflow
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        deviceList={deviceList}
        updateBulkWorkflows={updateBulkWorkflows}
      />
    ),
    customToolbar: () => (
      <CustomToolbar
        postJob={postJob}
        disableButton={buttonDisable}
        setShowConfirmation={setShowConfirmation}
      />
    ),
  };


  // set data state to be seen on table
  // calling get_back_ref endpoint by specified group id to use relationships between inventory and deployment groups
  // get workflows for column dropdown
  useEffect(() => {
    authAPI.get(`/workflow/get_back_ref/deploy/id:${createDeploymentGroupId}`).then(({ data }) => {
      // we asked for a single ID. API returns a list of IDs so index 0 is all we care about
      const { devices } = data.data[0];

      const deviceData = devices.map((device) => ({
        ...device,
        workflow: '',
        template: '',
      }));

      setData(deviceData);
    }).catch(() => {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    });

    authAPI.get('/workflow/workflow_types').then(({ data }) => {
      const workflowTypes = data.data
        .map((workflow) => workflow.type)
        .filter((workflowType) => workflowType !== 'DA Validation');

      setDeviceList(workflowTypes);
    }).catch(() => {
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
          title="Choose Workflow(s) for each Device"
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
    </>
  );
};

export default DeploymentRequestTable;
