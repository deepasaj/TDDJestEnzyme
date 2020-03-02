import React, { useEffect, useState } from "react";
import Layout from "./layout";
import LoadingPage from './LoadingPage';
import { useParams } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';


const Builder = () => {
  const { job_id } = useParams()
  const [state, setState] = useState();
  const [rows, setRows] = useState();
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState();
  const [review, setReview] = useState();
  const [jobId, setJobId] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskDataLoading, setTaskDataLoadingDone] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [job, setJob] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const authAPI = useAuthAPI();

  const cleanLabel = str => { // eslint-disable-line no-unused-vars
    return str.replace(/_/g, " ");
  };

  var IP = {}
  const getIpData = () => {
    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`/deploy/get_mgmt_ip`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          clearTimeout(timeout);
          if (!didTimeOut) {
            resolve(response);
            for (var i = 0; i < response.data.length; i++) {
              var obj = response.data[i];
              IP[obj.hostname] = obj.mgmt_ip
            }
          }
        }).catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

  }

  const getTaskData = () => {

    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`/deploy/get_tasks/${job_id}`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          clearTimeout(timeout);
          if (!didTimeOut) {
            resolve(response);
            const rows = response.data;
            for (var row in rows) {
              rows[row].task_object = JSON.parse(rows[row].task_object)
              if (rows[row].task_object.formData == null) {
                rows[row].mgmt_ip = IP[rows[row].target];
                rows[row].task_object.formData = { "hostname": rows[row].target, "mgmt_ip": rows[row].mgmt_ip };
              }
              if (rows[row].task_object.uiSchema == null) {
                rows[row].task_object.uiSchema = {}
              }
              if (rows[row].task_object.input.uiSchema != undefined) {
                if (rows[row].task_object.input.uiSchema.mgmt_ip != undefined) {
                  rows[row].task_object.input.uiSchema.mgmt_ip['ui:readonly'] = true;
                }
                if (rows[row].task_object.input.uiSchema.hostname != undefined) {
                  rows[row].task_object.input.uiSchema.hostname['ui:readonly'] = true;
                }
               }
            }
            setTasks(rows);
            setTaskDataLoadingDone(true)
          }
        }).catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

  }

  useEffect(() => {

    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`/dbase/job/${job_id}`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          clearTimeout(timeout);
          if (!didTimeOut) {
            resolve(response);
            const jobObject = response.data;
            setJob(jobObject)
            getIpData()
            setTimeout(() => {
              getTaskData()
            }, 3000);
          }
        }).catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });


  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      // Update database using CRUD endpoint
      setJobId(job_id);
      setRows(tasks);
      const userInputSteps = () => {
        var userinput_required_tasks = [];
        for (var task in tasks) {
          if (tasks[task].userinput_required) {
            userinput_required_tasks.push(tasks[task]);
          }
        }
        //                console.log(userinput_required_tasks)
        ////////////Removing Clean Labels in order to make validation work ////////////////////////////////////////////////
        //        for (var config in userinput_required_tasks) {
        //          console.log(userinput_required_tasks[config].task_object.action_data.properties)
        //          var tempSteps = userinput_required_tasks[config].task_object.action_data.properties;
        //          for (var key in tempSteps) {
        //            var temp;
        //            if (tempSteps.hasOwnProperty(key)) {
        //              temp = tempSteps[key];
        //              delete tempSteps[key];
        //              tempSteps[key.replace(/_/g, " ")] = temp;
        //            }
        //          }
        //          userinput_required_tasks[config].task_object.action_data.properties = tempSteps;
        //          for (var currTask in userinput_required_tasks[config].task_object.action_data.properties) {
        //            var fieldLabel =
        //              userinput_required_tasks[config].task_object.action_data.properties[
        //                currTask
        //              ].title;
        //            var cleanTitle = cleanLabel(fieldLabel);
        //            var cleanConfigTitle = cleanLabel(
        //              userinput_required_tasks[config].task_object.action_data.title
        //            );
        //            userinput_required_tasks[
        //              config
        //            ].task_object.action_data.title = cleanConfigTitle;
        //            userinput_required_tasks[config].task_object.action_data.properties[
        //              currTask
        //            ].title = cleanTitle;
        //          }
        //        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (job.status == 'User Input') {
          setActiveStep(0)
        } else {
          setActiveStep(userinput_required_tasks.length)
        }
        return userinput_required_tasks;
      };
      var theSteps = userInputSteps();
      setSteps(theSteps ? theSteps : []);
    }
  }, [tasks]);

  return (
    <React.Fragment>
      {taskDataLoading ? (
        <Layout
          state={state ? state : []}
          setState={setState}
          rows={rows ? rows : []}
          setRows={setRows}
          steps={steps}
          setSteps={setSteps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          review={review}
          setReview={setReview}
          showErrorList={false}
          jobId={jobId}
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          loading={loading}
          setLoading={setLoading}
          taskDataLoading={taskDataLoading}
          setTaskDataLoadingDone={setTaskDataLoadingDone}
          success={success}
          setSuccess={setSuccess}
          job={job}
          disableBtn={disableBtn}
          setDisableBtn={setDisableBtn}
        />
      ) : (
          <LoadingPage />
        )}
    </React.Fragment>
  );
};

export default Builder;
