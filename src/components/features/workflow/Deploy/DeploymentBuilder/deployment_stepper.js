import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import StepConnector from "@material-ui/core/StepConnector";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "70%",
    minWidth: 480
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  saveIcon: {
    marginRight: theme.spacing(1),
    fontSize: 24
  },
  stepContent: {
    width: "100%",
    borderLeft: props =>
      props.steps && props.activeStep === props.steps.length - 1
        ? "0px solid #FFFFFF"
        : "3px solid #CCC"
  },
  stepLabel: {
    fontWeight: "bold",
    fontSize: "18px"
  }
}));

const ColorlibConnector = withStyles({
  active: {
    "& $line": {
      backgroundColor: "#3f51b5"
    }
  },
  completed: {
    "& $line": {
      backgroundColor: "#25b037"
    }
  },
  line: {
    width: 3,
    backgroundColor: "#CCC"
  }
})(StepConnector);

const useColorlibStepIconStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 35,
    height: 35,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -4
  },
  active: {
    backgroundColor: "#3f51b5",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)"
  },
  completed: {
    backgroundColor: green[500],
    marginTop: 8
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative"
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -8,
    left: -15,
    zIndex: 1
  }
}));

const DeploymentStepper = props => {
  const classes = useStyles(props);
  const {
    steps,
    activeStep,
    setActiveStep,
    loading,
  } = props;

  const getStepContent = step => {
    return `${steps[step].task_object["target"]}`;
  };

  const getLabel = step => {
    return `${steps[step].task_object["action_name"]}`;
  };

  const handleNext = () => {
    document.getElementById("DynamicFormsButton").click();
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => {
      return prevActiveStep - 1;
    });
  };

  function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed
        })}
      >
        <div className={classes.wrapper}>
          {completed ? (
            <Check className={classes.completed} />
          ) : (
            <div> {props.icon} </div>
          )}
          {active && loading && (
            <CircularProgress size={39} className={classes.fabProgress} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index) => (
          <Step key={getLabel(index)}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <Typography variant="subtitle1" className={classes.stepLabel}>{getStepContent(index)}</Typography>
            </StepLabel>
            <StepContent className={classes.stepContent}>
              <Typography variant="body1" >{getLabel(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="contained"
                    color="default"
                    className={classes.button}
                  >
                    Previous Step
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    <SaveIcon className={classes.saveIcon} />
                    {activeStep === steps.length - 1
                      ? "Save and Review"
                      : "Save and Continue"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <CheckCircleIcon color="primary" fontSize="large" />
          <Typography>Complete</Typography>
        </Paper>
      )}
    </div>
  );
};

export default DeploymentStepper;
