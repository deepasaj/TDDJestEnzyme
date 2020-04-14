import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InventoryStatCards from 'components/features/inventory/InventoryStatCards';
import WorkflowStatCards from 'components/features/workflow/WorkflowStatCards';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    marginTop: '40px',
  },
  mainGrid: {
    justifyContent: 'center',
  },
}));

const HomeTab = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.mainGrid}>
        <InventoryStatCards />
        <WorkflowStatCards />
      </Grid>
    </div>
  );
};

export default HomeTab;
