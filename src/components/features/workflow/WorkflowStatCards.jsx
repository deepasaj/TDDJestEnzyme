import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Grid from "@material-ui/core/Grid";
import { useAuthAPI } from 'store/store';
import StatsCard from 'components/StatsCard'
import { useFeaturePermission } from './hooks';

const WorkflowStatCards = () => {
  const history = useHistory()
  const authAPI = useAuthAPI()
  const [hasReadAccess] = useFeaturePermission()
  const [activeJobs, setActiveJobs] = React.useState(0);
  const [completedJobs, setCompletedJobs] = React.useState(0);
  const [deployGroups, setDeployGroups] = React.useState(0);
  useEffect(() => {
    if(hasReadAccess) {
      authAPI.get(`/workflow/number_of_active_jobs`)
        .then(({ data }) => {
          const count = data.data;
          setActiveJobs(count);
        })
        .catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
      authAPI.get(`/workflow/number_of_completed_jobs`)
        .then(({ data }) => {
          var count = data.data;
          setCompletedJobs(count);
        })
        .catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
      authAPI.get(`/workflow/number_of_deployment_groups`)
        .then(({ data }) => {
          const numberOfDeploymentGroups = data.data;
          setDeployGroups(numberOfDeploymentGroups);
        })
        .catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
    }
  })
  return hasReadAccess && (
    <>
      <Grid item xs={3}>
        <StatsCard
          num={deployGroups} text="Deployment Groups"
          handleQuickLink={() => history.push('/workflow/deploy/deployment_groups')}
        />
      </Grid>
      <Grid item xs={3}>
        <StatsCard
          num={activeJobs} text="Active Jobs"
          handleQuickLink={() => history.push('/workflow/job?job_status=Active')}
        />
      </Grid>
      <Grid item xs={3}>
        <StatsCard
          num={completedJobs} text="Completed Jobs"
          handleQuickLink={() => history.push('/workflow/job?job_status=Complete')}
        />
      </Grid>
    </>
  )
}

export default WorkflowStatCards