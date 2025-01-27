import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TimelineIcon from '@material-ui/icons/Timeline';
import MenuCard from 'components/MenuCard';
import { useFeaturePermission } from './hooks';

const DashboardHomeCards = ({ classes }) => {
  const [hasReadAccess] = useFeaturePermission();
  const history = useHistory();

  return hasReadAccess && (
    <Grid item xs={6}>
      <MenuCard
        title="View metrics about jobs, deployment groups, and users here"
        cardIcon={
          <TimelineIcon className={classes.icon} fontSize="large" />
        }
        onClick={() => history.push('/dashboard')}
        btnText="Dashboard"
        isDisabled={false}
        height={160}
      />
    </Grid>
  );
};

DashboardHomeCards.propTypes = {
  classes: PropTypes.shape({
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

export default DashboardHomeCards;
