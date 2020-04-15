import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';
import LoadingPage from 'components/LoadingPage';
import Layout from './Layout';


const Builder = () => {
  const jobId = useParams().job_id;
  const [state, setState] = useState();
  const [rows, setRows] = useState();
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [review, setReview] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskDataLoading, setTaskDataLoadingDone] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [job, setJob] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const authAPI = useAuthAPI();


  const getIpData = async () => {
    const { data } = await authAPI.get('/workflow/get_mgmt_ip');
    const IPData = {};
    for (let i = 0; i < data.data.length; i++) {
      const obj = data.data[i];
      IPData[obj.hostname] = obj.mgmt_ip;
    }
    return IPData;
  };

  const getTaskData = async (IPData) => {
    const { data } = await authAPI.get(`/workflow/get_tasks/${jobId}`);
    const rows = data.data;

    // console.log()

    const tasks = rows.map((row) => {
      const taskObject = JSON.parse(row.task_object);

      if (!taskObject.formData) {
        taskObject.formData = {
          hostname: row.target,
          mgmt_ip: IPData[row.target],
        };
      }

      if (!taskObject.uiSchema) {
        taskObject.uiSchema = {};
      }

      if (taskObject.input.uiSchema) {
        if (taskObject.input.uiSchema.mgmt_ip) {
          taskObject.input.uiSchema.mgmt_ip['ui:readonly'] = true;
        }

        if (taskObject.input.uiSchema.hostname) {
          taskObject.input.uiSchema.hostname['ui:readonly'] = true;
        }
      }

      return {
        mgmt_ip: IPData[row.target],
        ...row,
        task_object: taskObject,
      };
    });

    setTasks(tasks);
    setTaskDataLoadingDone(true);
  };

  const getData = async () => {
    try {
      const { data } = await authAPI.get(`/workflow/get_job/${jobId}`);
      const jobObject = data.data;
      setJob(jobObject);
      const IPData = await getIpData();
      await getTaskData(IPData);
    } catch (err) {
      console.error(err);
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      // Update database using CRUD endpoint
      setRows(tasks);
      const userInputSteps = () => {
        const userinputRequiredTasks = tasks.filter((task) => task.userinput_required);

        if (job.status === 'User Input') {
          setActiveStep(0);
        } else {
          setActiveStep(userinputRequiredTasks.length);
        }
        return userinputRequiredTasks;
      };
      const theSteps = userInputSteps();
      setSteps(theSteps || []);
    }
  }, [tasks]);

  return (
    <>
      {taskDataLoading ? (
        <Layout
          state={state || []}
          setState={setState}
          rows={rows || []}
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
          success={success}
          setSuccess={setSuccess}
          job={job}
          disableBtn={disableBtn}
          setDisableBtn={setDisableBtn}
        />
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default Builder;
