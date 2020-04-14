import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import MenuCard from 'components/MenuCard';
import { useFeaturePermission } from './hooks';

const InventoryHomeCards = ({ classes }) => {
  const [hasReadAccess] = useFeaturePermission();
  const history = useHistory();

  return hasReadAccess && (
    <Grid item xs={6}>
      <MenuCard
        title="What devices you would like to integrate into the production
        network? Get started here by adding devices"
        cardIcon={(
          <FormatListBulletedIcon
            className={classes.icon}
            fontSize="large"
          />
        )}
        onClick={() => history.push('/inventory')}
        btnText="Inventory"
        isDisabled={false}
        height={175}
      />
    </Grid>
  );
};

InventoryHomeCards.propTypes = {
  classes: PropTypes.shape({
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

export default InventoryHomeCards;
