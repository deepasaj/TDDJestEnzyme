import React from 'react';
import { useHistory } from 'react-router-dom'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import MenuCard from 'components/MenuCard';

const useStyles = makeStyles(() => ({
  icon: {
    fontSize: "70px",
    margin: "7px "
  },
}));

const AdminMenu = () => {
  const classes = useStyles()
  const history = useHistory()
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Admin', path: '/admin'},
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="d-flex justify-content-center">
          <MenuCard
            title="Manage roles. Associate groups, users and features with them"
            cardIcon={
              <SupervisedUserCircleIcon
                className={classes.icon}
                fontSize="large"
              />
            }
            handleBtn={() => history.push('/admin/role_management')}
            btnText="Manage Roles"
            isDisabled={false}
            height={175}
          />
        </div>
      </main>
    </>
  );
}

export default AdminMenu;