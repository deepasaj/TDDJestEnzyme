import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Grid from '@material-ui/core/Grid';
import { useAuthAPI } from 'store/store';
import StatsCard from 'components/StatsCard';
import { showNotification } from 'utils/notifications';
import { useFeaturePermission } from './hooks';

const WorkflowStatCards = () => {
  const history = useHistory();
  const authAPI = useAuthAPI();
  const [hasReadAccess] = useFeaturePermission();
  const [activeJobs, setActiveJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [deployGroups, setDeployGroups] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (hasReadAccess) {
      authAPI.get('/workflow/number_of_active_jobs')
        .then(({ data }) => {
          const count = data.data;
          setActiveJobs(count);
        })
        .catch(() => {
          showNotification(
            'There was an error contacting the database. Please contact administrator.',
            'error', enqueueSnackbar,
            closeSnackbar,
          );
        });
      authAPI.get('/workflow/number_of_completed_jobs')
        .then(({ data }) => {
          const count = data.data;
          setCompletedJobs(count);
        })
        .catch(() => {
          showNotification(
            'There was an error contacting the database. Please contact administrator.',
            'error', enqueueSnackbar,
            closeSnackbar,
          );
        });
      authAPI.get('/workflow/number_of_deployment_groups')
        .then(({ data }) => {
          const numberOfDeploymentGroups = data.data;
          setDeployGroups(numberOfDeploymentGroups);
        })
        .catch(() => {
          showNotification(
            'There was an error contacting the database. Please contact administrator.',
            'error', enqueueSnackbar,
            closeSnackbar,
          );
        });
    }
  });
  return hasReadAccess && (
    <>
      <Grid item xs={3}>
        <StatsCard
          num={deployGroups}
          text="Deployment Groups"
          onClick={() => history.push('/workflow/deploy/deployment_groups')}
        />
      </Grid>
      <Grid item xs={3}>
        <StatsCard
          num={activeJobs}
          text="Active Jobs"
          onClick={() => history.push('/workflow/job?job_status=Active')}
        />
      </Grid>
      <Grid item xs={3}>
        <StatsCard
          num={completedJobs}
          text="Completed Jobs"
          onClick={() => history.push('/workflow/job?job_status=Complete')}
        />
      </Grid>
    </>
  );
};

export default WorkflowStatCards;
