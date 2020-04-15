/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'react-jsonschema-form-bs4';
// import { withTheme } from "react-jsonschema-form";
// import { Theme as MuiTheme } from "rjsf-material-ui";
import SendIcon from '@material-ui/icons/Send';
import HomeIcon from '@material-ui/icons/Home';
import EditIcon from '@material-ui/icons/Edit';
import ViewListIcon from '@material-ui/icons/ViewList';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';
import ConfirmationPopUp from './ConfirmationPopUp';
import SummaryTable from './SummaryTable';

// const Form = withTheme(MuiTheme);

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '90%',
    margin: 'auto',
  },
  buttonDeployLater: {
    margin: '20px 20px 0px 0px',
  },
  buttonDeployNow: {
    margin: '20px 0px 0px 20px',
    float: 'right',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  title: {
    margin: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  btn_primary: {
    margin: '25px 0px 0px 25px',
  },
  btn_secondary: {
    marginTop: '25px',
  },
  resetBtn: {
    marginTop: 8,
  },
}));

const DynamicForm = (props) => {
  const classes = useStyles();
  const authAPI = useAuthAPI();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  const {
    displayForm,
    showErrorList,
    schema,
    uiSchema,
    formData,
    fields,
    onChange,
    onError,
    activeStep,
    setSteps,
    setActiveStep,
    steps,
    showConfirmation,
    setShowConfirmation,
    loading,
    setLoading,
    setSuccess,
    job,
    disableBtn,
    setDisableBtn,
  } = props;
  //  const timer = React.useRef();

  const handleHome = () => {
    history.push('/');
  };

  const handleMyJobs = () => {
    history.push('/workflow/job');
  };

  const confirmDeploy = () => authAPI.post(`/workflow/start-orchestration/${job.id}`)
    .then(() => {
    }).catch(() => {
      showNotification(
        'There was an error submitting the request for initial orchestration'
        + ' for this job to execute any prerequisites tasks. Please contact administrator.',
        'error',
        enqueueSnackbar,
        closeSnackbar,
      );
    });

  const handleConfirmDeploy = () => {
    setShowConfirmation(false);
    history.push('/workflow/job');
    confirmDeploy();
  };

  // eslint-disable-next-line react/prop-types, object-curly-newline
  const FieldTemplate = ({ id, description, required, label, errors, children }) => (
    <div className="myfield">
      <label htmlFor={id}>
        {label}
        {required ? '*' : null}
      </label>
      <div
        // eslint-disable-next-line react/prop-types
        className={errors.props.errors ? 'fielderror' : 'noerror'}
        // eslint-disable-next-line react/prop-types
        title={errors.props.errors ? errors.props.errors : 'meets validations'}
      >
        {children}
      </div>
      <div>
        {description}
      </div>
    </div>
  );

  const updateDatabase = (step) => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      const body = { data: { task_object: step.task_object } };
      if (activeStep === steps.length - 1) {
        authAPI.patch(
          `/workflow/update_job/${job.id}`,
          { data: { status: 'Ready', status_details: 'Ready for Deployment' } },
        )
          .then(() => {
            setSuccess(true);
            setLoading(false);
            authAPI.patch(`/workflow/update_task/${step.id}`, body)
              .then(() => {
                setSuccess(true);
                setLoading(false);
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
              }).catch(() => {
                showNotification(
                  'There was an error contacting the database. Please contact administrator.',
                  'error', enqueueSnackbar,
                  closeSnackbar,
                );
              });
          }).catch(() => {
            showNotification(
              'There was an error contacting the database. Please contact administrator.',
              'error', enqueueSnackbar,
              closeSnackbar,
            );
          });
      } else {
        authAPI.patch(`/workflow/update_task/${step.id}`, body)
          .then(() => {
            setSuccess(true);
            setLoading(false);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          }).catch(() => {
            showNotification(
              'There was an error contacting the database. Please contact administrator.',
              'error', enqueueSnackbar,
              closeSnackbar,
            );
          });
      }
    }
  };

  const handleOnSubmit = (fD) => {
    setSteps((prevValues) => {
      const updatedStep = {
        ...prevValues[activeStep],
        task_object: {
          ...prevValues[activeStep].task_object,
          formData: fD.formData,
        },
      };
      updateDatabase(updatedStep);

      return {
        ...prevValues,
        [activeStep]: updatedStep,
      };
    });
  };

  const handleDeployNow = () => {
    setShowConfirmation(true);
  };

  const handleReturnToWizard = () => {
    setActiveStep(0);
  };

  const handleClose = () => {
    setShowConfirmation(false);
  };

  const handleResetOnClick = () => {
    // set all field values to null by setting formData to and empty object {}
    setSteps((prevValues) => {
      const updatedStep = {
        ...prevValues[activeStep],
        task_object: {
          ...prevValues[activeStep].task_object,
          formData: {
            hostname: prevValues[activeStep].target,
            mgmt_ip: prevValues[activeStep].mgmt_ip,
          },
        },
      };

      return {
        ...prevValues,
        [activeStep]: updatedStep,
      };
    });
  };

  React.useEffect(() => {
    if (job.status === 'Active' || job.status === 'Complete') {
      setDisableBtn(true);
    }
  }, []);

  // Define some default actions if nothing is passed via props
  return (
    <>
      {displayForm && (
        <Form
          id="deviceform"
          liveValidate
          noHtml5Validate={false}
          noValidate={false}
          showErrorList={showErrorList}
          schema={schema || {}}
          formData={formData || {}}
          uiSchema={uiSchema || {}}
          FieldTemplate={FieldTemplate}
          fields={fields}
          onChange={onChange}
          onSubmit={handleOnSubmit}
          onError={onError}
        >
          <Button
            color="default"
            variant="contained"
            onClick={handleResetOnClick}
            className={classes.resetBtn}
          >
            Reset
          </Button>
          <Button
            id="DynamicFormsButton"
            color="default"
            variant="contained"
            // onClick={processSubmit}
            type="submit"
            hidden
          >
            Submit
          </Button>
        </Form>
      )}
      {!displayForm && (
        <Paper square elevation={0}>
          <SummaryTable
            steps={steps}
            job={job}
          />
          <Button
            onClick={handleReturnToWizard}
            className={classes.buttonDeployLater}
            variant="contained"
            color="primary"
            disabled={disableBtn}
          >
            <EditIcon className={classes.extendedIcon} />
            Edit Job
          </Button>
          <Button
            onClick={handleMyJobs}
            variant="contained"
            color="primary"
            className={classes.buttonDeployLater}
          >
            <ViewListIcon className={classes.extendedIcon} />
            View Jobs
          </Button>
          <Button
            onClick={handleHome}
            variant="contained"
            color="primary"
            className={classes.buttonDeployLater}
          >
            <HomeIcon className={classes.extendedIcon} />
            Home
          </Button>
          <Button
            onClick={handleDeployNow}
            className={classes.buttonDeployNow}
            variant="contained"
            color="primary"
            disabled={disableBtn}
          >
            <SendIcon className={classes.extendedIcon} />
            Deploy Now
          </Button>
          <ConfirmationPopUp
            showConfirmation={showConfirmation}
            setShowConfirmation={setShowConfirmation}
            handleConfirmDeploy={handleConfirmDeploy}
            handleClose={handleClose}
          />
        </Paper>
      )}
    </>
  );
};

DynamicForm.propTypes = {
  displayForm: PropTypes.bool.isRequired,

  steps: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  fields: PropTypes.object,

  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
  showErrorList: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  setSteps: PropTypes.func.isRequired,
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  showConfirmation: PropTypes.bool.isRequired,
  setShowConfirmation: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  disableBtn: PropTypes.bool.isRequired,
  setDisableBtn: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
};

export default DynamicForm;
