import React from "react";
import { Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Form from "react-jsonschema-form-bs4";
//import { withTheme } from "react-jsonschema-form";
//import { Theme as MuiTheme } from "rjsf-material-ui";
import SummaryTable from "./SummaryTable";
import SendIcon from "@material-ui/icons/Send";
import HomeIcon from "@material-ui/icons/Home";
import EditIcon from "@material-ui/icons/Edit";
import ViewListIcon from "@material-ui/icons/ViewList";
import ConfirmationPopUp from "./confirmation_modal";
import axios from "axios";
import { API_URL } from 'config';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { getAuthHeader } from 'utils/auth';
import { useStateValue } from 'store/store';
import { useAuthAPI } from 'store/auth-store'

//const Form = withTheme(MuiTheme);

const useStyles = makeStyles(theme => ({
  formControl: {
    width: "90%",
    margin: "auto"
  },
  buttonDeployLater: {
    margin: "20px 20px 0px 0px"
  },
  buttonDeployNow: {
    margin: "20px 0px 0px 20px",
    float: "right"
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  title: {
    margin: 20,
    fontSize: 20,
    fontWeight: "bold"
  },
  btn_primary: {
    margin: "25px 0px 0px 25px"
  },
  btn_secondary: {
    marginTop: "25px"
  },
  resetBtn: {
    marginTop: 8
  }
}));

const DynamicForm = props => {
  const classes = useStyles();
  const [state] = useStateValue();
  const authAPI = useAuthAPI();
  
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    history,
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
    taskDataLoading,
    setTaskDataLoadingDone,
    setSuccess,
    job,
    disableBtn,
    setDisableBtn
  } = props;
  //  const timer = React.useRef();

  const handleHome = () => {
    history.push('/');
  };

  const handleMyJobs = () => {
    history.push('/job');
  };

  const confirmDeploy = () => {
    return authAPI.post(API_URL + `/orchestration/start-orchestration/${job.id}`, {}, {
      timeout: 5000
    })
      .then(() => {
      }).catch(() => {
        showNotification("There was an error submitting the request for initial orchestration for this job to execute any prerequisites tasks. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }

  const handleConfirmDeploy = () => {
    setShowConfirmation(false);
    history.push('/job');
    confirmDeploy()
  };

  const FieldTemplate = props => {
    const {
      id,
      description,
      required,
      label,
      errors,
      children
    } = props;
    return (
      <div className="myfield">
        <label htmlFor={id}>
          {label}
          {required ? "*" : null}
        </label>
        <div className={errors.props.errors ? "fielderror" : "noerror"} title={errors.props.errors ? errors.props.errors : "meets validations"}>
            {children}
        </div>
        {description}
      </div>
    );
  };

  const updateDatabase = (step) => {
    if (!loading) {
      setSuccess(false)
      setLoading(true)
      var body = { "data": { "task_object": step.task_object } }
      if (activeStep === steps.length - 1) {
        authAPI.patch(`${API_URL}/dbase/job/${job.id}`, { "data": { "status": "Ready", "status_details": "Ready for Deployment" } }, { timeout: 5000 })
          .then(() => {
            setSuccess(true)
            setLoading(false)
            authAPI.patch(`${API_URL}/dbase/tasks/${step.id}`, body, {
              timeout: 5000
            })
              .then(() => {
                setSuccess(true)
                setLoading(false)
                setActiveStep(prevActiveStep => {
                  return prevActiveStep + 1;
                });
              }).catch(() => {
                showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
              });
          }).catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
          });
      } else {
        authAPI.patch(`${API_URL}/dbase/tasks/${step.id}`, body, {
          timeout: 5000
        })
          .then(() => {
            setSuccess(true)
            setLoading(false)
            setActiveStep(prevActiveStep => {
              return prevActiveStep + 1;
            });
          }).catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
          });
      }
    }
  }

  const handleOnSubmit = (fD) => {
    setSteps(prevValues => {
      var tempValues = [];
      prevValues[activeStep].task_object.formData = fD.formData;
      updateDatabase(prevValues[activeStep])
      tempValues = prevValues;
      return Object.create(tempValues);
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
    //set all field values to null by setting formData to and empty object {}
    setSteps(prevValues => {
      prevValues[activeStep].task_object.formData = {"hostname": prevValues[activeStep].target, "mgmt_ip": prevValues[activeStep].mgmt_ip};
      return Object.create(prevValues);
    });
  };

  React.useEffect(() => {
    if(job.status == 'Active' || job.status == 'Complete') {
        setDisableBtn(true);
    }
  }, [])

  //Define some default actions if nothing is passed via props
  return (
    <React.Fragment>
      {displayForm && (
        <Form
          id="deviceform"
          liveValidate={true}
          noHtml5Validate={false}
          noValidate={false}
          showErrorList={showErrorList}
          schema={schema ? schema : {}}
          formData={formData ? formData : {}}
          uiSchema={uiSchema ? uiSchema : {}}
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
            hidden={true}
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
            taskDataLoading={taskDataLoading}
            setTaskDataLoadingDone={setTaskDataLoadingDone}
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
    </React.Fragment>
  );
};

export default withRouter(DynamicForm);
