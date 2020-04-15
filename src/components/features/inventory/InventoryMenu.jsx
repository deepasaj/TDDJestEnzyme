import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BuildIcon from '@material-ui/icons/Build';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import MenuCard from 'components/MenuCard';
import './styles.css';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  mainGrid: {
    justifyContent: 'center',
  },
  icon: {
    fontSize: '70px',
    margin: '7px ',
  },
}));

const InventoryMenu = () => {
  const history = useHistory();
  const classes = useStyles();
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Inventory', path: '/inventory' },
  ];

  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="Inventory">
          <div className={classes.root}>
            <Grid container spacing={3} className={classes.mainGrid}>
              <Grid item xs={5}>
                <MenuCard
                  title="Before we can automate we need something to automate, so let's start by adding devices"
                  cardIcon={
                    <AddCircleIcon className={classes.icon} fontSize="large" />
                  }
                  onClick={() => history.push('/inventory/bulk')}
                  btnText="Bulk Add Devices"
                  isDisabled={false}
                  height={180}
                />
              </Grid>
              <Grid item xs={5}>
                <MenuCard
                  title="Need to view, update, delete, or add a few devices in your inventory?"
                  cardIcon={<BuildIcon className={classes.icon} fontSize="large" />}
                  onClick={() => history.push('/inventory/manage')}
                  btnText="Manage"
                  isDisabled={false}
                  height={180}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </main>
    </>
  );
};

export default InventoryMenu;
