import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import DeploymentStepper from './DeploymentStepper';
import DynamicForm from './DynamicForm';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    margin: theme.spacing(1, 1, 1, 0),
    border: 'solid 1px #ccc',
  },
  paperform: {
    padding: theme.spacing(2),
    margin: (props) => (props.steps && props.activeStep < props.steps.length
      ? theme.spacing(1, 0, 1, 1)
      : 'auto'),
    border: 'solid 1px #ccc',
    width: (props) => (props.steps && props.activeStep < props.steps.length ? '100%' : '90%'),
    minWidth: (props) => (props.steps && props.activeStep < props.steps.length ? '250px' : '700px'),
  },
}));

// ///////////////////////////////////////////////////////////// There was an attempt
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
// /////////////////////////////////////////////////////////////

const Layout = (props) => {
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
    success,
    setSuccess,
    job,
    disableBtn,
    setDisableBtn,
  } = props;


  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs style={{ paddingRight: 10 }}>
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
              displayForm={!!(steps && activeStep < steps.length)}
              showErrorList={showErrorList}
              steps={steps}
              setSteps={setSteps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              showConfirmation={showConfirmation}
              setShowConfirmation={setShowConfirmation}
              loading={loading}
              setLoading={setLoading}
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
          hidden={!(steps && activeStep < steps.length)}
        >
          <Paper className={classes.paper}>
            <DeploymentStepper
              state={steps ? state : {}}
              setState={setState}
              rows={rows || []}
              setRows={setRows}
              steps={steps || []}
              setSteps={setSteps}
              activeStep={activeStep || 0}
              setActiveStep={setActiveStep}
              loading={loading}
              setLoading={setLoading}
              success={success}
              setSuccess={setSuccess}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

Layout.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  steps: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,

  activeStep: PropTypes.number.isRequired,
  showConfirmation: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  showErrorList: PropTypes.bool.isRequired,
  disableBtn: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  setSteps: PropTypes.func.isRequired,
  setActiveStep: PropTypes.func.isRequired,
  setShowConfirmation: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  setSuccess: PropTypes.func.isRequired,
  setDisableBtn: PropTypes.func.isRequired,
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default Layout;
