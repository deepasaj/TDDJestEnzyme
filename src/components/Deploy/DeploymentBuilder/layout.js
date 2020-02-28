import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import DeploymentStepper from "./deployment_stepper";
import DynamicForm from "./dynamic_form";

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: "center",
    margin: theme.spacing(1, 1, 1, 0),
    border: "solid 1px #ccc"
  },
  paperform: {
    padding: theme.spacing(2),
    margin: props =>
      props.steps && props.activeStep < props.steps.length
        ? theme.spacing(1, 0, 1, 1)
        : "auto",
    border: "solid 1px #ccc",
    width: props =>
      props.steps && props.activeStep < props.steps.length ? "100%" : "90%",
    minWidth: props =>
      props.steps && props.activeStep < props.steps.length ? "250px" : "700px"
  }
}));

/////////////////////////////////////////////////////////////// There was an attempt
// Define a custom component for handling the root position object
// class EnhancedTextField extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { ...formData };
//     console.log(this.state);
//   }

//   onChange(name) {
//     return event => {
//       this.setState(
//         {
//           [name]: parseFloat(event.target.value)
//         },
//         () => this.onChange(this.state)
//       );
//     };
//   }

//   render() {
//     // const {lat, lon} = this.state;
//     console.log("render");
//     return (
//       <TextField
//         id={this.state.id}
//         label={this.statelabel}
//         // type="email"
//         name={this.state.id}
//         margin="normal"
//         variant="outlined"
//       />
//     );
//   }
// }

// // Define the custom field component to use for the root object
// const uiSchema = { "ui:field": "etf" };

// // Define the custom field components to register; here our "geo"
// // custom field component
// const fields = { etf: EnhancedTextField };
///////////////////////////////////////////////////////////////

const Layout = props => {
  const classes = useStyles(props);
  const {
    state,
    setState,
    rows,
    setRows,
    steps,
    setSteps,
    activeStep,
    setActiveStep,
    showErrorList,
    showConfirmation,
    setShowConfirmation,
    loading,
    setLoading,
    taskDataLoading,
    setTaskDataLoadingDone,
    success,
    setSuccess,
    job,
    disableBtn,
    setDisableBtn
  } = props;



  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={true} style={{ paddingRight: 10 }}>
          <Paper className={classes.paperform}>
            <DynamicForm
              schema={
                steps && activeStep < steps.length
                  ? steps[activeStep].task_object.input.schema
                  : {}
              }
              uiSchema={
                steps && activeStep < steps.length
                  ? steps[activeStep].task_object.input.uiSchema
                  : {}
              }
              formData={
                steps && activeStep < steps.length
                  ? steps[activeStep].task_object.formData
                  : {}
              }
              displayForm={steps && activeStep < steps.length ? true : false}
              showErrorList={showErrorList}
              steps={steps}
              setSteps={setSteps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              showConfirmation={showConfirmation}
              setShowConfirmation={setShowConfirmation}
              taskDataLoading={taskDataLoading}
              loading={loading}
              setLoading={setLoading}
              setTaskDataLoadingDone={setTaskDataLoadingDone}
              success={success}
              setSuccess={setSuccess}
              job={job}
              disableBtn={disableBtn}
              setDisableBtn={setDisableBtn}
            />
          </Paper>
        </Grid>
        <Grid
          item
          xs={false}
          hidden={steps && activeStep < steps.length ? false : true}
        >
          <Paper className={classes.paper}>
            <DeploymentStepper
              state={steps ? state : {}}
              setState={setState}
              rows={rows ? rows : []}
              setRows={setRows}
              steps={steps ? steps : []}
              setSteps={setSteps}
              activeStep={activeStep ? activeStep : 0}
              setActiveStep={setActiveStep}
              loading={loading}
              setLoading={setLoading}
              success={success}
              setSuccess={setSuccess}
            />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Layout;
