import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { TextField } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';
import PreviewPopUp from './PreviewPopUp';

const useStyles = makeStyles((theme) => ({
  rowExpand: {
    backgroundColor: '#f7f7f7',
  },
  table: {
    boxShadow: '0px 0px 0px 0px',
    border: '1px solid #e3e3e3',
    borderRadius: '5px',
  },
  textField: {
    width: '240px',
  },
  btn_primary: {
    marginLeft: '10px',
    marginRight: '25px',
  },
  edit_btn: {
    marginRight: '10px',
    padding: 6,
  },
  fabProgress: {
    color: '#949199',
    position: 'absolute',
    top: -2,
    left: -1,
    zIndex: 1,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
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


const SummaryTable = ({ steps, job }) => {
  const classes = useStyles();
  const authAPI = useAuthAPI();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [previewConfig, setPreviewConfig] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(-1);

  const handlePreviewConfig = (tableMeta) => {
    setPreviewIndex(tableMeta.rowIndex);
    setPreviewLoading(true);
    let jsonBody = {};
    if (steps[tableMeta.rowIndex].task_object) {
      const taskObj = steps[tableMeta.rowIndex].task_object;
      jsonBody = taskObj.formData;
      jsonBody.template = taskObj.template;
    }

    authAPI.post('/workflow/generate_config', jsonBody)
      .then((response) => {
        const { config } = response.data.data;
        setPreviewConfig(config);
        setPreviewLoading(false);
        setShowPreview(true);
      })
      .catch(() => {
        showNotification(
          'There was an error contacting the database. Please contact administrator.',
          'error', enqueueSnackbar,
          closeSnackbar,
        );
      });
  };

  //    useEffect(() => {
  //        console.log(previewConfig);
  //    }, [previewConfig]);

  const columns = [
    {
      name: 'target',
      label: 'Hostname',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'task_object.template',
      label: 'Template',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'Actions',
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRender: (value, tableMeta) => (
          <Tooltip title="Preview Config">
            <div className={classes.wrapper}>
              <IconButton
                aria-label="preview"
                onClick={() => { handlePreviewConfig(tableMeta); }}
                className={classes.edit_btn}
              >
                <VisibilityIcon />
              </IconButton>
              {(previewLoading && tableMeta.rowIndex === previewIndex) && (
                <CircularProgress size={39} className={classes.fabProgress} />
              )}
            </div>
          </Tooltip>
        ),
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
    customSort: (data, colIndex, order) => {
      if (order === 'asc') {
        return data.sort((a, b) => (a.data[colIndex] < b.data[colIndex] ? 1 : -1));
      } if (order === 'desc') {
        return data.sort((a, b) => (a.data[colIndex] < b.data[colIndex] ? -1 : 1));
      }
      throw new Error('Unexpected order value');
    },
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      let formData = {};
      // pull information from formdata for the specific step(which is a device)
      // this data is used to create expandable rows
      if (steps[rowMeta.dataIndex].task_object.formData) {
        // eslint-disable-next-line prefer-destructuring
        formData = steps[rowMeta.dataIndex].task_object.formData;
      }
      return (
        <TableRow className={classes.rowExpand} boxshadow={5}>
          <TableCell colSpan={colSpan}>
            <Grid container>
              {Object.keys(formData).map((key) => (
                <Grid item xs={4} key={key}>
                  <List key={key}>
                    <ListItem key={key}>
                      <TextField
                        name={key}
                        label={key}
                        value={
                            steps[rowMeta.dataIndex].task_object.formData[key]
                          }
                        InputProps={{
                          readOnly: true,
                        }}
                        className={classes.textField}
                      />
                    </ListItem>
                  </List>
                </Grid>
              ))}
            </Grid>
          </TableCell>
        </TableRow>
      );
    },
  };

  useEffect(() => {
    if (job !== 'undefined') {
      // only show snack bar if status is User Input
      if (job.status !== 'Ready' && job.status !== 'Complete' && job.status !== 'Active') {
        showNotification(
          'Job saved successfully. '
          + "You can review and deploy this job now or you can locate the job at a later time in 'My Jobs'.",
          'info', enqueueSnackbar, closeSnackbar,
        );
      }
    }
  }, []);

  const handleClose = () => {
    setShowPreview(false);
    setPreviewConfig(null);
  };

  return (
    <>
      <MuiThemeProvider theme={tableTheme}>
        <MUIDataTable
          className={classes.table}
          title="Review Deployment"
          data={steps}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      <PreviewPopUp
        previewConfig={previewConfig}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        handleClose={handleClose}
      />
    </>
  );
};

SummaryTable.propTypes = {

  job: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  steps: PropTypes.array.isRequired,
};

export default SummaryTable;
