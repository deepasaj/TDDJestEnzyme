import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import MenuCard from 'components/MenuCard';
import { useFeaturePermission } from './hooks';

const WorkflowHomeCards = ({ classes }) => {
  const [hasReadAccess] = useFeaturePermission();
  const history = useHistory();

  return hasReadAccess && (
    <>
      <Grid item xs={6}>
        <MenuCard
          title="Take action now and start configuring devices for T-Mobile's production network"
          cardIcon={
            <DoubleArrowIcon className={classes.icon} fontSize="large" />
          }
          onClick={() => history.push('/workflow/deploy')}
          btnText="Deployments"
          isDisabled={false}
          height={175}
        />
      </Grid>
      <Grid item xs={6}>
        <MenuCard
          title="Check your jobs, their status, and their individual tasks status here"
          cardIcon={
            <AssignmentIcon className={classes.icon} fontSize="large" />
          }
          onClick={() => history.push('/workflow/job')}
          btnText="Jobs"
          isDisabled={false}
          height={160}
        />
      </Grid>
    </>
  );
};

WorkflowHomeCards.propTypes = {
  classes: PropTypes.shape({
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

export default WorkflowHomeCards;
