import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import ChartistGraph from 'react-chartist';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

import Flippy, { FrontSide, BackSide } from 'react-flippy';
import LoadingScreen from 'react-loading-screen';
import styles from 'material-dashboard-react/src/assets/jss/material-dashboard-react/views/dashboardStyle';
import { showNotification } from 'utils/notifications';
import logoSrc from 'assets/img/gen_icon.png';
import { useAuthAPI } from 'store/store';

import GridItem from 'material-dashboard-react/src/components/Grid/GridItem';
import GridContainer from 'material-dashboard-react/src/components/Grid/GridContainer';

import Card from 'material-dashboard-react/src/components/Card/Card';
import CardHeader from 'material-dashboard-react/src/components/Card/CardHeader';
import CardIcon from 'material-dashboard-react/src/components/Card/CardIcon';
import CardBody from 'material-dashboard-react/src/components/Card/CardBody';

import lineStyles from './Charts/LineChart';
import SimplePieChart from './Charts/PieChart';

import Switches from './Switch';
import GraphTab from './Charts/Tab';
import SwitchSnackBar from './Snackbar';

import { dailyGraph, monthlyGraph } from './charts';


const useStyles = makeStyles(styles);
const monthLabel = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ' '];
const weekLabel = ['M', 'T', 'W', 'TH', 'F', 'S', 'SN'];

export default function Dashboard() {
  const classes = useStyles();
  const lineClasses = lineStyles();
  const [flipped, setCardState] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Data States
  // TODO: fix me
  const users = [];
  const userTable = [];
  const [activeJobs, setActiveJobs] = useState();
  const [completedJobs, setCompletedJobs] = useState();
  const [totalTasks, setTotalTasks] = useState();
  const [invDevices, setInvDevices] = useState();
  const [deployGroups, setDeployGroups] = useState();
  // const [userTable, setUserTable] = useState([]);

  // Graph Data
  const [dailyJobs, setDailyJobs] = useState([]);
  const [monthlyJobs, setMonthlyJobs] = useState([]);
  const [dailyUsers, setDailyUsers] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [monthlyTasks, setMonthlyTasks] = useState([]);
  // Personalized
  const [dailyJobsUser, setDailyJobsUser] = useState([]);
  const [monthlyJobsUser, setMonthlyJobsUser] = useState([]);
  const [dailyTasksUser, setDailyTasksUser] = useState([]);
  const [monthlyTasksUser, setMonthlyTasksUser] = useState([]);

  // Personalized Data States
  const [activeJobsUser, setActiveJobsUser] = useState();
  const [completedJobsUser, setCompletedJobsUser] = useState();
  const [totalTasksUser, setTotalTasksUser] = useState();
  const [deployGroupsUser, setDeployGroupsUser] = useState();

  // Pie Charts
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [jobStatus, setJobStatus] = useState([]);
  const [jobStatusEmpty, setJobStatusEmpty] = useState(false);
  const [deviceTypesEmpty, setDeviceTypesEmpty] = useState(false);

  const [loading, setLoading] = useState(true);
  const authAPI = useAuthAPI();

  async function getData() {
    try {
      const [
        completedJobsResponse,
        activeJobsResponse,
        tasksResponse,
        numberOfDevicesResponse,
        numberOfDeploymentGroupsResponse,
        dailyJobsResponse,
        monthlyJobsResponse,
        dailyTasksResponse,
        monthlyTasksResponse,
        dailyUsersResponse,
        monthlyUsersResponse,

        dailyJobsUserResponse,
        monthlyJobsUserResponse,
        dailyTasksUserResponse,
        monthlyTasksUserResponse,

        completedJobsUserResponse,
        activeJobsUserResponse,
        deploymentGroupUserResponse,
        tasksUserResponse,

        deviceTypesResponse,
        jobStatusStatsResponse,
      ] = await Promise.all([
        authAPI.get('/dashboard/completed_jobs'),
        authAPI.get('/dashboard/active_jobs'),
        authAPI.get('/dashboard/tasks'),
        authAPI.get('/dashboard/number_of_devices'),
        authAPI.get('/dashboard/number_of_deployment_groups'),
        authAPI.get('/dashboard/daily_jobs'),
        authAPI.get('/dashboard/monthly_jobs'),
        authAPI.get('/dashboard/daily_tasks'),
        authAPI.get('/dashboard/monthly_tasks'),
        authAPI.get('/dashboard/daily_users'),
        authAPI.get('/dashboard/monthly_users'),

        authAPI.get('/dashboard/daily_jobs_user'),
        authAPI.get('/dashboard/monthly_jobs_user'),
        authAPI.get('/dashboard/daily_tasks_user'),
        authAPI.get('/dashboard/monthly_tasks_user'),

        authAPI.get('/dashboard/completed_jobs_user'),
        authAPI.get('/dashboard/active_jobs_user'),
        authAPI.get('/dashboard/deployment_group_user'),
        authAPI.get('/dashboard/tasks_user'),

        authAPI.get('/dashboard/device_types'),
        authAPI.get('/dashboard/job_status_stats'),
      ]);
      setCompletedJobs(completedJobsResponse.data.data[0].count);
      setActiveJobs(activeJobsResponse.data.data[0].count);
      setTotalTasks(tasksResponse.data.data[0].count);
      setInvDevices(numberOfDevicesResponse.data.data);
      setDeployGroups(numberOfDeploymentGroupsResponse.data.data);

      setDailyJobs(dailyJobsResponse.data.data.map((obj) => ({ day: obj.day, jobs: obj.count })));
      setMonthlyJobs(monthlyJobsResponse.data.data.map((obj) => ({ month_date: obj.month, jobs: obj.count })));
      setDailyTasks(dailyTasksResponse.data.data.map((obj) => ({ day: obj.day, tasks: obj.count })));
      setMonthlyTasks(monthlyTasksResponse.data.data.map((obj) => ({ month_date: obj.month, tasks: obj.count })));
      setDailyUsers(dailyUsersResponse.data.data.map((obj) => ({ day: obj.day, users: obj.user_count })));
      setMonthlyUsers(monthlyUsersResponse.data.data.map((obj) => ({ month_date: obj.month, users: obj.user_count })));

      setDailyJobsUser(dailyJobsUserResponse.data.data.map((obj) => ({ day: obj.day, jobs: obj.count })));
      setMonthlyJobsUser(monthlyJobsUserResponse.data.data.map((obj) => ({ month_date: obj.month, jobs: obj.count })));
      setDailyTasksUser(dailyTasksUserResponse.data.data.map((obj) => ({ day: obj.day, tasks: obj.count })));
      setMonthlyTasksUser(
        monthlyTasksUserResponse.data.data.map((obj) => ({ month_date: obj.month, tasks: obj.count })),
      );

      setCompletedJobsUser(completedJobsUserResponse.data.data.length);
      setActiveJobsUser(activeJobsUserResponse.data.data.length);
      setDeployGroupsUser(deploymentGroupUserResponse.data.data[0].devices);
      setTotalTasksUser(tasksUserResponse.data.data[0].count);

      if (deviceTypesResponse.data.data.length === 0) {
        setDeviceTypesEmpty(true);
      } else {
        setDeviceTypes(deviceTypesResponse.data.data);
      }

      if (jobStatusStatsResponse.data.data.length === 0) {
        setJobStatusEmpty(true);
      } else {
        setJobStatus(jobStatusStatsResponse.data.data);
      }
    } catch (err) {
      console.error(err);
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    }

    setLoading(false);
  }

  React.useEffect(() => {
    // Loading Page
    getData();
  }, []);

  React.useEffect(() => {

  }, [flipped, refresh]);


  const a1 = [];
  // Graph data (overall)
  const dailyJobsChartData = {
    labels: weekLabel,
    series: [],
  };
  const monthlyJobsChartData = {
    labels: monthLabel,
    series: [],
  };
  const dailyUsersChartData = {
    labels: weekLabel,
    series: [],
  };
  const monthlyUsersChartData = {
    labels: monthLabel,
    series: [],
  };
  const dailyTasksChartData = {
    labels: weekLabel,
    series: [],
  };
  const monthlyTasksChartData = {
    labels: monthLabel,
    series: [],
  };

  // Personalized Graph Data
  const usersDailyJobsChartData = {
    labels: weekLabel,
    series: [],
  };
  const usersMonthlyJobsChartData = {
    labels: monthLabel,
    series: [],
  };

  const usersDailyTasksChartData = {
    labels: weekLabel,
    series: [],
  };
  const usersMonthlyTasksChartData = {
    labels: monthLabel,
    series: [],
  };

  const statusPiedata = [];
  const devicePiedata = [];


  function mappingTable(id, name, email, username) {
    let temp = [];
    temp = [String(id), name, email, username];
    a1[id - 1] = temp;
  }

  function mappingStatus(status, count) {
    let temp = {};
    temp = { name: status, value: count };
    statusPiedata.push(temp);
  }

  function mappingDevice(device, count) {
    let temp = {};
    temp = { name: device, value: count };
    devicePiedata.push(temp);
  }

  function mappingDays(day) {
    switch (day) {
      case 'Monday':
        return 0;
      case 'Tuesday':
        return 1;
      case 'Wednesday':
        return 2;
      case 'Thursday':
        return 3;
      case 'Friday':
        return 4;
      case 'Saturday':
        return 5;
      case 'Sunday':
        return 6;
      default:
        return undefined;
    }
  }
  function mappingMonths(month) {
    switch (month) {
      case 'January':
        return 0;
      case 'February':
        return 1;
      case 'March':
        return 2;
      case 'April':
        return 3;
      case 'May':
        return 4;
      case 'June':
        return 5;
      case 'July':
        return 6;
      case 'August':
        return 7;
      case 'September':
        return 8;
      case 'October':
        return 9;
      case 'November':
        return 10;
      case 'December':
        return 11;
      default:
        return undefined;
    }
  }
  // Mapping variables
  userTable.map((item) => mappingTable(item.id, item.name, item.email, item.username));

  const mappedGraphs = () => {
    const temp = [0, 0, 0, 0, 0, 0, 0];
    dailyJobs.forEach((item) => {
      temp[mappingDays(item.day)] = item.jobs;
    });
    dailyJobsChartData.series.push(temp);
    if (Math.max(...temp) !== 0) {
      dailyGraph.job_options.high = Math.max(...temp);
    }

    const tempMonthlyJobs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthlyJobs.forEach((item) => {
      tempMonthlyJobs[mappingMonths(item.month_date)] = item.jobs;
    });
    monthlyJobsChartData.series.push(tempMonthlyJobs);
    if (Math.max(...tempMonthlyJobs) !== 0) {
      monthlyGraph.job_options.high = Math.max(...tempMonthlyJobs);
    }

    const tempDailyUser = [0, 0, 0, 0, 0, 0, 0];
    dailyUsers.forEach((item) => {
      tempDailyUser[mappingDays(item.day)] = item.users;
    });
    dailyUsersChartData.series.push(tempDailyUser);
    if (Math.max(...tempDailyUser) !== 0) {
      dailyGraph.user_options.high = Math.max(...tempDailyUser);
    }

    const tempMonthUser = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthlyUsers.forEach((item) => {
      tempMonthUser[mappingMonths(item.month_date)] = item.users;
    });
    monthlyUsersChartData.series.push(tempMonthUser);
    if (Math.max(...tempMonthUser) !== 0) {
      monthlyGraph.user_options.high = Math.max(...tempMonthUser);
    }

    const tempDailyTasks = [0, 0, 0, 0, 0, 0, 0];
    dailyTasks.forEach((item) => {
      tempDailyTasks[mappingDays(item.day)] = item.tasks;
    });
    dailyTasksChartData.series.push(tempDailyTasks);
    if (Math.max(...tempDailyTasks) !== 0) {
      dailyGraph.task_options.high = Math.max(...tempDailyTasks);
    }

    const tempMonthlyTasks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthlyTasks.forEach((item) => {
      tempMonthlyTasks[mappingMonths(item.month_date)] = item.tasks;
    });
    monthlyTasksChartData.series.push(tempMonthlyTasks);
    if (Math.max(...tempMonthlyTasks) !== 0) {
      monthlyGraph.task_options.high = Math.max(...tempMonthlyTasks);
    }

    // Personalized
    const tempUsersDailyJobs = [0, 0, 0, 0, 0, 0, 0];
    dailyJobsUser.forEach((item) => {
      tempUsersDailyJobs[mappingDays(item.day)] = item.jobs;
    });
    usersDailyJobsChartData.series.push(tempUsersDailyJobs);
    if (Math.max(...tempUsersDailyJobs) !== 0) {
      dailyGraph.job_user_options.high = Math.max(...tempUsersDailyJobs);
    }

    const tempUsersMonthlyJobs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthlyJobsUser.forEach((item) => {
      tempUsersMonthlyJobs[mappingMonths(item.month_date)] = item.jobs;
    });
    usersMonthlyJobsChartData.series.push(tempUsersMonthlyJobs);
    if (Math.max(...tempUsersMonthlyJobs) !== 0) {
      monthlyGraph.job_user_options.high = Math.max(...tempUsersMonthlyJobs);
    }

    const tempUsersDailyTasks = [0, 0, 0, 0, 0, 0, 0];
    dailyTasksUser.forEach((item) => {
      tempUsersDailyTasks[mappingDays(item.day)] = item.tasks;
    });
    usersDailyTasksChartData.series.push(tempUsersDailyTasks);
    if (Math.max(...tempUsersDailyTasks) !== 0) {
      dailyGraph.task_user_options.high = Math.max(...tempUsersDailyTasks);
    }

    const tempUsersMonthlyTasks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthlyTasksUser.forEach((item) => {
      tempUsersMonthlyTasks[mappingMonths(item.month_date)] = item.tasks;
    });
    usersMonthlyTasksChartData.series.push(tempUsersMonthlyTasks);
    if (Math.max(...tempUsersMonthlyTasks) !== 0) {
      monthlyGraph.task_user_options.high = Math.max(...tempUsersMonthlyTasks);
    }
  };

  jobStatus.map((item) => mappingStatus(item.status, item.count));
  deviceTypes.map((item) => mappingDevice(item.device, item.count));

  mappedGraphs();

  const flipCard = () => {
    setTimeout(() => {
      if (flipped) {
        setCardState(false);
      } else {
        setCardState(true);
      }
    }, 0);
  };

  const RefreshChart = () => {
    setTimeout(() => {
      if (refresh) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
    }, 500);
  };

  const djobs = () => (
    <div>
      <CardHeader color="info">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={dailyJobsChartData}
          type="Line"
          options={dailyGraph.job_options}
          listener={dailyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Daily Jobs</h3>
        {/* <p className={classes.cardCategory}>
            <span className={classes.successText}>

            </span>
          </p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  const mjobs = () => (
    <div>
      <CardHeader color="info">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={monthlyJobsChartData}
          type="Bar"
          options={monthlyGraph.job_options}
          responsiveOptions={monthlyGraph.responsiveOptions}
          listener={monthlyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Monthly Jobs</h3>
        {/* <p className={classes.cardCategory}> </p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  const dusers = () => (
    <div>
      <CardHeader color="primary">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={dailyUsersChartData}
          type="Line"
          options={dailyGraph.user_options}
          listener={dailyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Daily Users</h3>
        {/* <p className={classes.cardCategory}></p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  const musers = () => (
    <div>
      <CardHeader color="primary">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={monthlyUsersChartData}
          type="Bar"
          options={monthlyGraph.user_options}
          responsiveOptions={monthlyGraph.responsiveOptions}
          listener={monthlyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Monthly Users</h3>
        {/* <p className={classes.cardCategory}></p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );
  const dtasks = () => (
    <div>
      <CardHeader color="warning">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={dailyTasksChartData}
          type="Line"
          options={dailyGraph.task_options}
          listener={dailyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Daily Tasks</h3>
        {/* <p className={classes.cardCategory}></p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  const mtasks = () => (
    <div>
      <CardHeader color="warning">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={monthlyTasksChartData}
          type="Bar"
          options={monthlyGraph.task_options}
          listener={monthlyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Monthly Tasks</h3>
        {/* <p className={classes.cardCategory}></p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  // Personalized
  const djobsUser = () => (
    <div>
      <CardHeader color="info">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={usersDailyJobsChartData}
          type="Line"
          options={dailyGraph.job_user_options}
          listener={dailyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Your Daily Jobs</h3>
        {/* <p className={classes.cardCategory}>
            <span className={classes.successText}>
            </span>
          </p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  const mjobsUser = () => (
    <div>
      <CardHeader color="info">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={usersMonthlyJobsChartData}
          type="Bar"
          options={monthlyGraph.job_user_options}
          responsiveOptions={monthlyGraph.responsiveOptions}
          listener={monthlyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Your Monthly Jobs</h3>
        {/* <p className={classes.cardCategory}></p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  const dtasksUser = () => (
    <div>
      <CardHeader color="warning">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={usersDailyTasksChartData}
          type="Line"
          options={dailyGraph.task_user_options}
          listener={dailyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Your Daily Tasks</h3>
        {/* <p className={classes.cardCategory}></p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  const mtasksUser = () => (
    <div>
      <CardHeader color="warning">
        <ChartistGraph
          className={lineClasses.lineChart}
          data={usersMonthlyTasksChartData}
          type="Bar"
          options={monthlyGraph.task_user_options}
          listener={monthlyGraph.animation}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle}>Your Monthly Tasks</h3>
        {/* <p className={classes.cardCategory}></p> */}
      </CardBody>
      {/* <CardFooter chart>
          <div className={classes.stats}>
          </div>
        </CardFooter> */}
    </div>
  );

  return (
    <div>
      <SwitchSnackBar />
      <LoadingScreen
        loading={loading}
        bgColor="#343a40"
        spinnerColor="#9ee5f8"
        textColor="#f8f9fa"
        logoSrc={logoSrc}
        text="Loading Proteus Metrics"
      >
        <Switches
          flipCard={flipCard}
          RefreshChart={RefreshChart}
          flipped={flipped}
        />
        <GridContainer spacing={5}>
          <GridItem xs={12} sm={3}>
            {/* <GridItem> */}
            <Flippy
              isFlipped={flipped}
              flipDirection="horizontal" // horizontal or vertical
              style={{
                width: 'auto',
                paddingBottom: '30px',
                // minHeight: "225px"
              }}
            >
              <FrontSide>
                <Card>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Icon>content_copy</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: '25px' }}
                    >
                      Active Jobs
                    </p>
                    <h3 className={classes.cardTitle}>
                      {activeJobs}
                      <small />
                    </h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: 'lightblue' }}>
                <Card>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Icon>content_copy</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: '25px' }}
                    >
                      Your Active Jobs
                    </p>
                    <h3 className={classes.cardTitle}>
                      {activeJobsUser}
                      <small />
                    </h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </BackSide>
            </Flippy>
            <Flippy
              isFlipped={flipped}
              style={{
                width: 'auto',
                paddingBottom: '30px',
                // minHeight: "225px"
              }}
            >
              <FrontSide>
                <Card>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Icon>verified_user</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: '25px' }}
                    >
                      Completed Jobs
                    </p>
                    <h3 className={classes.cardTitle}>{completedJobs}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: 'lightblue' }}>
                <Card>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Icon>verified_user</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: '25px', marginLeft: '100px' }}
                    >
                      Your Completed Jobs
                    </p>
                    <h3 className={classes.cardTitle}>{completedJobsUser}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </BackSide>
            </Flippy>
            <Flippy
              isFlipped={flipped}
              style={{
                width: 'auto',
                paddingBottom: '30px',
                // minHeight: "225px"
              }}
            >
              <FrontSide>
                <Card>
                  <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                      <Icon>build</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: '25px' }}
                    >
                      Tasks
                    </p>
                    <h3 className={classes.cardTitle}>{totalTasks}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: '#FFB266' }}>
                <Card>
                  <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                      <Icon>build</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: '25px' }}
                    >
                      Your Tasks
                    </p>
                    <h3 className={classes.cardTitle}>{totalTasksUser}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </BackSide>
            </Flippy>
            <Flippy
              isFlipped={flipped}
              style={{
                width: 'auto',
                paddingBottom: '30px',
                // minHeight: "225px"
              }}
            >
              <FrontSide>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <Icon>double_arrow</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory} style={{ fontSize: '25px' }}>
                      Deployment Groups
                    </p>
                    <h3 className={classes.cardTitle}>{deployGroups}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: '#9CE2A0' }}>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <Icon>double_arrow</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory} style={{ fontSize: '25px' }}>
                      Your Deployment Groups
                    </p>
                    <h3 className={classes.cardTitle}>{deployGroupsUser}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </BackSide>
            </Flippy>
            <Flippy
              isFlipped={false}
              style={{
                width: 'auto',
                paddingBottom: '30px',
                // minHeight: "225px"
              }}
            >
              <FrontSide>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <Icon>storage</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory} style={{ fontSize: '25px' }}>
                      Inventory
                    </p>
                    <h3 className={classes.cardTitle}>{invDevices}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
            </Flippy>
            <Flippy
              isFlipped={false}
              style={{
                width: 'auto',
                paddingBottom: '30px',
                // minHeight: "225px"
              }}
            >
              <FrontSide>
                <Card>
                  <CardHeader color="primary" stats icon>
                    <CardIcon color="primary">
                      <Icon>people</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory} style={{ fontSize: '25px' }}>
                      Users
                    </p>
                    <h3 className={classes.cardTitle}>{users}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
            </Flippy>
          </GridItem>
          <GridItem xs={12} sm={4}>
            <Flippy
              isFlipped={flipped}
              style={{
                width: 'auto',
                //                             paddingBottom: "30px",
                //                             minHeight: "350px"
              }}
            >
              <FrontSide>
                <Card chart>
                  <GraphTab
                    g1={djobs}
                    g2={mjobs}
                    refreshChart={RefreshChart}
                    flipped={flipped}
                    state={refresh}
                    flipCard={flipCard}
                  />
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: 'lightblue' }}>
                <Card chart>
                  <GraphTab
                    g1={djobsUser}
                    g2={mjobsUser}
                    refreshChart={RefreshChart}
                    flipped={flipped}
                    flipCard={flipCard}
                    state={refresh}
                  />
                </Card>
              </BackSide>
            </Flippy>
            <Flippy isFlipped={flipped}>
              <FrontSide>
                <Card chart>
                  <GraphTab
                    g1={dtasks}
                    g2={mtasks}
                    refreshChart={RefreshChart}
                    flipped={flipped}
                    state={refresh}
                    flipCard={flipCard}
                  />
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: '#FFB266' }}>
                <Card chart>
                  <GraphTab
                    g1={dtasksUser}
                    g2={mtasksUser}
                    refreshChart={RefreshChart}
                    flipped={flipped}
                    state={refresh}
                    flipCard={flipCard}
                  />
                </Card>
              </BackSide>
            </Flippy>
            <Flippy isFlipped={false}>
              <FrontSide>
                <Card chart>
                  <GraphTab
                    g1={dusers}
                    g2={musers}
                    refreshChart={RefreshChart}
                    flipped={flipped}
                    state={refresh}
                    flipCard={flipCard}
                  />
                </Card>
              </FrontSide>
            </Flippy>
          </GridItem>
          <GridItem xs={12} sm={5}>
            <Flippy
              isFlipped={false}
              style={{
                //                            minwidth: "150px",
                width: '100%',
                paddingBottom: '30px',
              }}
            >
              <FrontSide>
                {jobStatusEmpty ? (
                  <Card style={{ minHeight: '100%' }}>
                    <CardHeader color="info">
                      <h4 className={classes.cardTitleWhite}>Job Status</h4>
                      <p
                        className={classes.cardCategoryWhite}
                        style={{ fontSize: '12px' }}
                      >
                        Job Status by type
                      </p>
                    </CardHeader>
                    <p style={{ fontSize: '20px', textAlign: 'center', paddingTop: '180px' }}>
                      There are currently no job status to be shown
                    </p>

                  </Card>
                ) : (
                  <Card>
                    <CardHeader color="info">
                      <h4 className={classes.cardTitleWhite}>Job Status</h4>
                      <p
                        className={classes.cardCategoryWhite}
                        style={{ fontSize: '12px' }}
                      >
                        Job Status by type
                      </p>
                    </CardHeader>
                    <SimplePieChart piedata={statusPiedata} />
                  </Card>
                )}
              </FrontSide>
            </Flippy>
            <Flippy
              isFlipped={false}
              style={{
                //                            minwidth: "150px",
                //                             paddingTop: "15px",
              }}
            >
              <FrontSide>
                {deviceTypesEmpty ? (
                  <Card style={{ minHeight: '460px' }}>
                    <CardHeader color="info">
                      <h4 className={classes.cardTitleWhite}>Device Types</h4>
                      <p
                        className={classes.cardCategoryWhite}
                        style={{ fontSize: '14px' }}
                      >
                        Device types distributions in inventory
                      </p>
                    </CardHeader>
                    <p
                      style={{ fontSize: '20px' }}
                    >
                      There are currently no devices in inventory
                    </p>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader color="info">
                      <h4 className={classes.cardTitleWhite}>Device Types</h4>
                      <p
                        className={classes.cardCategoryWhite}
                        style={{ fontSize: '14px' }}
                      >
                        Device types distributions in inventory
                      </p>
                    </CardHeader>
                    <SimplePieChart piedata={devicePiedata} />

                  </Card>
                )}
              </FrontSide>
            </Flippy>
          </GridItem>
        </GridContainer>
      </LoadingScreen>
    </div>
  );
}
