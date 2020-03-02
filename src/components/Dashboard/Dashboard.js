import React from "react";
import { useSnackbar } from "notistack";
import ChartistGraph from "react-chartist";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import GridItem from "./Grid/GridItem.js";
import GridContainer from "./Grid/GridContainer.js";

import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardIcon from "./Card/CardIcon.js";
import CardBody from "./Card/CardBody.js";

import lineStyles from "./Charts/LineChart.js";

import Flippy, { FrontSide, BackSide } from "react-flippy";
import Switches from "./Switch.js";
import GraphTab from "./Charts/Tab.js";
import LoadingScreen from 'react-loading-screen';
import SwitchSnackBar from "./Snackbar";
import { showNotification } from 'utils/notifications';

import { dailyGraph, monthlyGraph } from "./variables/charts.js";

import styles from "./assets/jss/material-dashboard-react/views/dashboardStyle.js";
import SimplePieChart from "./Charts/PieChart.js";
import logoSrc from "assets/img/gen_icon.png";

import { useAuthAPI } from 'store/auth-store';;

const useStyles = makeStyles(styles);
const month_label = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", " "];
const week_label = ["M", "T", "W", "TH", "F", "S", "SN"]

export default function Dashboard() {
  const classes = useStyles();
  const lineClasses = lineStyles();
  const [flipped, setCardState] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Data States
  const [users, setUsers] = React.useState();
  const [activeJobs, setActiveJobs] = React.useState();
  const [completedJobs, setCompletedJobs] = React.useState();
  const [totalTasks, setTotalTasks] = React.useState();
  const [invDevices, setInvDevices] = React.useState();
  const [deployGroups, setDeployGroups] = React.useState();
  const [userTable, setUserTable] = React.useState([]); // eslint-disable-line no-unused-vars

  //Graph Data
  const [dailyJobs, setDailyJobs] = React.useState([]);
  const [monthlyJobs, setMonthlyJobs] = React.useState([]);
  const [dailyUsers, setDailyUsers] = React.useState([]);
  const [monthlyUsers, setMonthlyUsers] = React.useState([]);
  const [dailyTasks, setDailyTasks] = React.useState([]);
  const [monthlyTasks, setMonthlyTasks] = React.useState([]);
  //Personalized
  const [dailyJobsUser, setDailyJobsUser] = React.useState([]);
  const [monthlyJobsUser, setMonthlyJobsUser] = React.useState([]);
  const [dailyTasksUser, setDailyTasksUser] = React.useState([]);
  const [monthlyTasksUser, setMonthlyTasksUser] = React.useState([]);

  //Personalized Data States
  const [activeJobsUser, setActiveJobsUser] = React.useState();
  const [completedJobsUser, setCompletedJobsUser] = React.useState();
  const [totalTasksUser, setTotalTasksUser] = React.useState();
  const [deployGroupsUser, setDeployGroupsUser] = React.useState();

  //Pie Charts
  const [deviceTypes, setDeviceTypes] = React.useState([]); // eslint-disable-line no-unused-vars
  const [jobStatus, setJobStatus] = React.useState([]); // eslint-disable-line no-unused-vars
  const [jobStatusEmpty, setJobStatusEmpty] = React.useState(false);
  const [deviceTypesEmpty, setDeviceTypesEmpty] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const authAPI = useAuthAPI();

  const addUser = (id, display_name, email, username) => {
    var newUsers = {
      id: id,
      name: display_name,
      email: email,
      username: username
    };
    setUserTable(prevUsers => {
      var tempUsers = [];

      if (prevUsers[id] != undefined) {
        prevUsers[id] = newUsers;
        tempUsers = prevUsers;
      } else {
        tempUsers = [...prevUsers, newUsers];
      }
      return Object.create(tempUsers);
    });
  };

  const addDailyJob = (day, count) => {
    var newJob = {
      day: day,
      jobs: count
    };
    setDailyJobs(prevJobs => {
      var tempJobs = [];

      if (prevJobs[day] != undefined) {
        prevJobs[day] = newJob;
        tempJobs = prevJobs;
      } else {
        tempJobs = [...prevJobs, newJob];
      }
      return Object.create(tempJobs);
    });
  };

  const addMonthlyJob = (month, count) => {
    var newJob = {
      month_date: month,
      jobs: count
    };
    setMonthlyJobs(prevJobs => {
      var tempJobs = [];

      if (prevJobs[month] != undefined) {
        prevJobs[month] = newJob;
        tempJobs = prevJobs;
      } else {
        tempJobs = [...prevJobs, newJob];
      }
      return Object.create(tempJobs);
    });
  };

  const addDailyUser = (day, count) => {
    var newUser = {
      day: day,
      users: count
    };
    setDailyUsers(prevUsers => {
      var tempUsers = [];

      if (prevUsers[day] != undefined) {
        prevUsers[day] = newUser;
        tempUsers = prevUsers;
      } else {
        tempUsers = [...prevUsers, newUser];
      }
      return Object.create(tempUsers);
    });
  };

  const addMonthlyUser = (month, count) => {
    var newUser = {
      month_date: month,
      users: count
    };
    setMonthlyUsers(prevUsers => {
      var tempUsers = [];

      if (prevUsers[month] != undefined) {
        prevUsers[month] = newUser;
        tempUsers = prevUsers;
      } else {
        tempUsers = [...prevUsers, newUser];
      }
      return Object.create(tempUsers);
    });
  };

  const addDailyTask = (day, count) => {
    var newTask = {
      day: day,
      tasks: count
    };
    setDailyTasks(prevTasks => {
      var tempTasks = [];

      if (prevTasks[day] != undefined) {
        prevTasks[day] = newTask;
        tempTasks = prevTasks;
      } else {
        tempTasks = [...prevTasks, newTask];
      }
      return Object.create(tempTasks);
    });
  };

  const addMonthlyTask = (month, count) => {
    var newTask = {
      month_date: month,
      tasks: count
    };
    setMonthlyTasks(prevTasks => {
      var tempTasks = [];

      if (prevTasks[month] != undefined) {
        prevTasks[month] = newTask;
        tempTasks = prevTasks;
      } else {
        tempTasks = [...prevTasks, newTask];
      }
      return Object.create(tempTasks);
    });
  };

  //Personalized Graph Data
  const addDailyJobUser = (day, count) => {
    var newJob = {
      day: day,
      jobs: count
    };
    setDailyJobsUser(prevJobs => {
      var tempJobs = [];

      if (prevJobs[day] != undefined) {
        prevJobs[day] = newJob;
        tempJobs = prevJobs;
      } else {
        tempJobs = [...prevJobs, newJob];
      }
      return Object.create(tempJobs);
    });
  };

  const addMonthlyJobUser = (month, count) => {
    var newJob = {
      month_date: month,
      jobs: count
    };
    setMonthlyJobsUser(prevJobs => {
      var tempJobs = [];

      if (prevJobs[month] != undefined) {
        prevJobs[month] = newJob;
        tempJobs = prevJobs;
      } else {
        tempJobs = [...prevJobs, newJob];
      }
      return Object.create(tempJobs);
    });
  };


  const addDailyTaskUser = (day, count) => {
    var newTask = {
      day: day,
      tasks: count
    };
    setDailyTasksUser(prevTasks => {
      var tempTasks = [];

      if (prevTasks[day] != undefined) {
        prevTasks[day] = newTask;
        tempTasks = prevTasks;
      } else {
        tempTasks = [...prevTasks, newTask];
      }
      return Object.create(tempTasks);
    });
  };

  const addMonthlyTaskUser = (month, count) => {
    var newTask = {
      month_date: month,
      tasks: count
    };
    setMonthlyTasksUser(prevTasks => {
      var tempTasks = [];

      if (prevTasks[month] != undefined) {
        prevTasks[month] = newTask;
        tempTasks = prevTasks;
      } else {
        tempTasks = [...prevTasks, newTask];
      }
      return Object.create(tempTasks);
    });
  };

  const addJobStatus = (status, count) => {
    var newStatus = {
      status: status,
      count: count
    };
    setJobStatus(prevStatus => {
      var tempStatus = [];

      if (prevStatus[status] != undefined) {
        prevStatus[status] = newStatus;
        tempStatus = prevStatus;
      } else {
        tempStatus = [...prevStatus, newStatus];
      }
      return Object.create(tempStatus);
    });
  };
  const addDeviceType = (device, count) => {
    var newDevice = {
      device: device,
      count: count
    };
    setDeviceTypes(prevDevice => {
      var tempDevice = [];

      if (prevDevice[device] != undefined) {
        prevDevice[device] = newDevice;
        tempDevice = prevDevice;
      } else {
        tempDevice = [...prevDevice, newDevice];
      }
      return Object.create(tempDevice);
    });
  };



  React.useEffect(() => {

    // Loading Page
    setTimeout(() => {
      setLoading(false);
    }, 3000);

    let didTimeOut1 = false;
    let didTimeOut2 = false;
    let didTimeOut3 = false;
    let didTimeOut4 = false;
    let didTimeOut5 = false;
    let didTimeOut6 = false;
    let didTimeOut7 = false;
    let didTimeOut8 = false;
    let didTimeOut9 = false;
    let didTimeOut10 = false;
    let didTimeOut11 = false;
    let didTimeOut12 = false;
    let didTimeOut13 = false;
    let didTimeOut14 = false;
    let didTimeOut15 = false;
    let didTimeOut16 = false;
    let didTimeOut17 = false;
    let didTimeOut18 = false;
    let didTimeOut19 = false;
    let didTimeOut20 = false;
    let didTimeOut21 = false;
    let didTimeOut22 = false;

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout1 = setTimeout(function () {
        didTimeOut1 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/completed_jobs", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout1);
            if (!didTimeOut1) {
              resolve(responseData);
              setCompletedJobs(responseData.data[0].count);
            }

          });
        });


    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout2 = setTimeout(function () {
        didTimeOut2 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch for active jobs
      authAPI.fetch("/dashboard/active_jobs", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout2);
            if (!didTimeOut2) {
              resolve(responseData);
              setActiveJobs(responseData.data[0].count);
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout3 = setTimeout(function () {
        didTimeOut3 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch for total tasks
      authAPI.fetch("/dashboard/tasks", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout3);
            if (!didTimeOut3) {
              resolve(responseData);
              const rows = responseData.data[0].count;
              setTotalTasks(rows);
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout4 = setTimeout(function () {
        didTimeOut4 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch for inventory
      authAPI.fetch("/dbase/inventory", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout4);
            if (!didTimeOut4) {
              resolve(responseData);
              const rows = responseData.data.length;
              setInvDevices(rows);
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout5 = setTimeout(function () {
        didTimeOut5 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch for deployment groups
      authAPI.fetch("/dbase/deployment_group", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout5);
            if (!didTimeOut5) {
              resolve(responseData);
              const rows = responseData.data.length;
              setDeployGroups(rows);
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout6 = setTimeout(function () {
        didTimeOut6 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch for users
      authAPI.fetch("/dbase/user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout6);
            if (!didTimeOut6) {
              resolve(responseData);
              const rows = responseData.data.length;
              setUsers(rows);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addUser(obj.id, obj.display_name, obj.email, obj.username);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout7 = setTimeout(function () {
        didTimeOut7 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/daily_jobs", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout7);
            if (!didTimeOut7) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addDailyJob(obj.day, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout8 = setTimeout(function () {
        didTimeOut8 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/monthly_jobs", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout8);
            if (!didTimeOut8) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addMonthlyJob(obj.month, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout9 = setTimeout(function () {
        didTimeOut9 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/daily_tasks", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout9);
            if (!didTimeOut9) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addDailyTask(obj.day, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout10 = setTimeout(function () {
        didTimeOut10 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/monthly_tasks", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout10);
            if (!didTimeOut10) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addMonthlyTask(obj.month, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout11 = setTimeout(function () {
        didTimeOut11 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/daily_users", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout11);
            if (!didTimeOut11) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addDailyUser(obj.date, obj.user_count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout12 = setTimeout(function () {
        didTimeOut12 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/monthly_users", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout12);
            if (!didTimeOut12) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addMonthlyUser(obj.month, obj.user_count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout13 = setTimeout(function () {
        didTimeOut13 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      //Personalized Graph Data
      authAPI.fetch("/dashboard/daily_jobs_user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout13);
            if (!didTimeOut13) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addDailyJobUser(obj.day, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout14 = setTimeout(function () {
        didTimeOut14 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/monthly_jobs_user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout14);
            if (!didTimeOut14) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addMonthlyJobUser(obj.month, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout15 = setTimeout(function () {
        didTimeOut15 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/daily_tasks_user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout15);
            if (!didTimeOut15) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addDailyTaskUser(obj.day, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout16 = setTimeout(function () {
        didTimeOut16 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch("/dashboard/monthly_tasks_user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout16);
            if (!didTimeOut16) {
              resolve(responseData);
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addMonthlyTaskUser(obj.month, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout17 = setTimeout(function () {
        didTimeOut17 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // Fetch for personalized Data
      authAPI.fetch("/dashboard/completed_jobs_user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout17);
            if (!didTimeOut17) {
              resolve(responseData);
              const rows = responseData.data.length;
              setCompletedJobsUser(rows);
            }

          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout18 = setTimeout(function () {
        didTimeOut18 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch for active jobs
      authAPI.fetch("/dashboard/active_jobs_user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout18);
            if (!didTimeOut18) {
              resolve(responseData);
              const rows = responseData.data.length;
              setActiveJobsUser(rows);
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout19 = setTimeout(function () {
        didTimeOut19 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch for deployment groups
      authAPI.fetch("/dashboard/deployment_group_user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout19);
            if (!didTimeOut19) {
              resolve(responseData);
              setDeployGroupsUser(responseData.data[0].devices);
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout20 = setTimeout(function () {
        didTimeOut20 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch for tasks user
      authAPI.fetch("/dashboard/tasks_user", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout20);
            if (!didTimeOut20) {
              resolve(responseData);
              const rows = responseData.data[0].count;
              setTotalTasksUser(rows);
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout21 = setTimeout(function () {
        didTimeOut21 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      //     fetch device type for piechart
      authAPI.fetch("/dashboard/device_types", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout21);
            if (!didTimeOut21) {
              resolve(responseData);
              if (responseData.data.length === 0) {
                setDeviceTypesEmpty(true);
              }
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addDeviceType(obj.device, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout22 = setTimeout(function () {
        didTimeOut22 = true;
        reject(new Error('Request timed out'));
      }, 5000);

      // fetch job status for piechart
      authAPI.fetch("/dashboard/job_status_stats", {
        method: 'GET'
      })
        .then((response) => {
          response.json().then((responseData) => {
            clearTimeout(timeout22);
            if (!didTimeOut22) {
              resolve(responseData);
              if (responseData.data.length === 0) {
                setJobStatusEmpty(true);
              }
              for (var i = 0; i < responseData.data.length; i++) {
                var obj = responseData.data[i];
                addJobStatus(obj.status, obj.count);
              }
            }
          });
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });


  }, []);

  React.useEffect(() => {

  }, [flipped, refresh]);


  var a1 = [];
  // Graph data (overall)
  var djob_a = {
    labels: week_label,
    series: []
  };
  var mjob_a = {
    labels: month_label,
    series: []
  };
  var duser_a = {
    labels: week_label,
    series: []
  };
  var muser_a = {
    labels: month_label,
    series: []
  };
  var dtasks_a = {
    labels: week_label,
    series: []
  };
  var mtasks_a = {
    labels: month_label,
    series: []
  };

  // Personalized Graph Data
  var djob_u = {
    labels: week_label,
    series: []
  };
  var mjob_u = {
    labels: month_label,
    series: []
  };

  var dtasks_u = {
    labels: week_label,
    series: []
  };
  var mtasks_u = {
    labels: month_label,
    series: []
  };

  var status_piedata = []
  var device_piedata = [];

  // eslint-disable-next-line no-unused-vars
  function mappingTable(id, name, email, username) {
    var temp = [];
    temp = [String(id), name, email, username];
    a1[id - 1] = temp;
  }
  // eslint-disable-next-line no-unused-vars
  function mappingStatus(status, count) {
    var temp = {};
    temp = { name: status, value: count };
    status_piedata.push(temp);
  }
  // eslint-disable-next-line no-unused-vars
  function mappingDevice(device, count) {
    var temp = {};
    temp = { name: device, value: count };
    device_piedata.push(temp);
  }

  function mappingDates(day) {
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
    }
  }
  // Mapping variables
  userTable.map((item) =>
    mappingTable(item.id, item.name, item.email, item.username)
  );
  // eslint-disable-next-line no-unused-vars
  const mappedGraphs = () => {
    var temp = [0, 0, 0, 0, 0, 0, 0]
    dailyJobs.map((item) =>
      temp[mappingDates(item.day)] = item.jobs);
    djob_a['series'].push(temp);
    if (Math.max(...temp) != 0) {
      dailyGraph.job_options.high = Math.max(...temp);
    }

    var temp_month = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    monthlyJobs.map((item) =>
      temp_month[mappingMonths(item.month_date)] = item.jobs);
    mjob_a['series'].push(temp_month);
    if (Math.max(...temp_month) != 0) {
      monthlyGraph.job_options.high = Math.max(...temp_month);
    }

    var temp_daily_user = [0, 0, 0, 0, 0, 0, 0]
    dailyUsers.map((item) =>
      temp_daily_user[mappingDates(item.day)] = item.users);
    duser_a['series'].push(temp_daily_user);
    if (Math.max(...temp_daily_user) != 0) {
      dailyGraph.user_options.high = Math.max(...temp_daily_user);
    }

    var temp_month_user = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    monthlyUsers.map((item) =>
      temp_month_user[mappingMonths(item.month_date)] = item.users);
    muser_a['series'].push(temp_month_user);
    if (Math.max(...temp_month_user) != 0) {
      monthlyGraph.user_options.high = Math.max(...temp_month_user);
    }

    var temp_daily_task = [0, 0, 0, 0, 0, 0, 0]
    dailyTasks.map((item) =>
      temp_daily_task[mappingDates(item.day)] = item.tasks);
    dtasks_a['series'].push(temp_daily_task);
    if (Math.max(...temp_daily_task) != 0) {
      dailyGraph.task_options.high = Math.max(...temp_daily_task);
    }

    var temp_month_task = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    monthlyTasks.map((item) =>
      temp_month_task[mappingMonths(item.month_date)] = item.tasks);
    mtasks_a['series'].push(temp_month_task);
    if (Math.max(...temp_month_task) != 0) {
      monthlyGraph.task_options.high = Math.max(...temp_month_task);
    }

    //Personalized
    var temp_daily_job_user = [0, 0, 0, 0, 0, 0, 0]
    dailyJobsUser.map((item) =>
      temp_daily_job_user[mappingDates(item.day)] = item.jobs);
    djob_u['series'].push(temp_daily_job_user);
    if (Math.max(...temp_daily_job_user) != 0) {
      dailyGraph.job_user_options.high = Math.max(...temp_daily_job_user);
    }

    var temp_monthly_job_user = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    monthlyJobsUser.map((item) =>
      temp_monthly_job_user[mappingMonths(item.month_date)] = item.jobs);
    mjob_u['series'].push(temp_monthly_job_user);
    if (Math.max(...temp_monthly_job_user) != 0) {
      monthlyGraph.job_user_options.high = Math.max(...temp_monthly_job_user);
    }

    var temp_daily_task_user = [0, 0, 0, 0, 0, 0, 0]
    dailyTasksUser.map((item) =>
      temp_daily_task_user[mappingDates(item.day)] = item.tasks);
    dtasks_u['series'].push(temp_daily_task_user);
    if (Math.max(...temp_daily_task_user) != 0) {
      dailyGraph.task_user_options.high = Math.max(...temp_daily_task_user);
    }

    var temp_month_task_user = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    monthlyTasksUser.map((item) =>
      temp_month_task_user[mappingMonths(item.month_date)] = item.tasks);
    mtasks_u['series'].push(temp_month_task_user);
    if (Math.max(...temp_month_task_user) != 0) {
      monthlyGraph.task_user_options.high = Math.max(...temp_month_task_user);
    }
  };

  jobStatus.map((item) =>
      mappingStatus(item.status, item.count)
  );
  deviceTypes.map((item) =>
      mappingDevice(item.device, item.count)
  );

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

  const djobs = () => {
    return (
      <div>
        <CardHeader color="info">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={djob_a}
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
  };

  const mjobs = () => {
    return (
      <div>
        <CardHeader color="info">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={mjob_a}
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
  };

  const dusers = () => {
    return (
      <div>
        <CardHeader color="primary">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={duser_a}
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
  };

  const musers = () => {
    return (
      <div>
        <CardHeader color="primary">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={muser_a}
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
  };
  const dtasks = () => {
    return (
      <div>
        <CardHeader color="warning">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={dtasks_a}
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
  };

  const mtasks = () => {
    return (
      <div>
        <CardHeader color="warning">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={mtasks_a}
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
  };

  //Personalized
  const djobsUser = () => {
    return (
      <div>
        <CardHeader color="info">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={djob_u}
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
  };

  const mjobsUser = () => {
    return (
      <div>
        <CardHeader color="info">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={mjob_u}
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
  };

  const dtasksUser = () => {
    return (
      <div>
        <CardHeader color="warning">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={dtasks_u}
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
  };

  const mtasksUser = () => {
    return (
      <div>
        <CardHeader color="warning">
          <ChartistGraph
            className={lineClasses.lineChart}
            data={mtasks_u}
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
  };

  return (
    <div>
      <SwitchSnackBar />
      <LoadingScreen
        loading={loading}
        bgColor='#343a40'
        spinnerColor='#9ee5f8'
        textColor='#f8f9fa'
        logoSrc={logoSrc}
        text='Loading Proteus Metrics'
      >
        <Switches flipCard={flipCard} RefreshChart={RefreshChart} flipped={flipped}
        />
        <GridContainer spacing={5}>
          <GridItem xs={12} sm={3}>
            {/* <GridItem> */}
            <Flippy
              isFlipped={flipped}
              flipDirection="horizontal" // horizontal or vertical
              style={{
                width: "auto",
                 paddingBottom: "30px",
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
                      style={{ fontSize: "25px" }}
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
              <BackSide style={{ backgroundColor: "lightblue" }}>
                <Card>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Icon>content_copy</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: "25px" }}
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
            <Flippy isFlipped={flipped} style={{
              width: "auto",
               paddingBottom: "30px",
              // minHeight: "225px"
            }}>
              <FrontSide>
                <Card>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Icon>verified_user</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: "25px" }}
                    >
                      Completed Jobs
          </p>
                    <h3 className={classes.cardTitle}>{completedJobs}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: "lightblue" }}>
                <Card>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Icon>verified_user</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: "25px", marginLeft: "100px" }}
                    >
                      Your Completed Jobs
          </p>
                    <h3 className={classes.cardTitle}>{completedJobsUser}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </BackSide>
            </Flippy>
            <Flippy isFlipped={flipped}
              style={{
                width: "auto",
                 paddingBottom: "30px",
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
                      style={{ fontSize: "25px" }}
                    >
                      Tasks
          </p>
                    <h3 className={classes.cardTitle}>{totalTasks}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: "#FFB266" }}>
                <Card>
                  <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                      <Icon>build</Icon>
                    </CardIcon>
                    <p
                      className={classes.cardCategory}
                      style={{ fontSize: "25px" }}
                    >
                      Your Tasks
          </p>
                    <h3 className={classes.cardTitle}>{totalTasksUser}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </BackSide>
            </Flippy>
            <Flippy isFlipped={flipped} style={{
              width: "auto",
               paddingBottom: "30px",
              // minHeight: "225px"
            }}>
              <FrontSide>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <Icon>double_arrow</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory} style={{ fontSize: "25px" }}>
                      Deployment Groups
        </p>
                    <h3 className={classes.cardTitle}>{deployGroups}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
              <BackSide style={{ backgroundColor: "#9CE2A0" }}>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <Icon>double_arrow</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory} style={{ fontSize: "25px" }}>
                      Your Deployment Groups
        </p>
                    <h3 className={classes.cardTitle}>{deployGroupsUser}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </BackSide>
            </Flippy>
            <Flippy isFlipped={false}
              style={{
                width: "auto",
                 paddingBottom: "30px",
                // minHeight: "225px"
              }}
            >
              <FrontSide>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <Icon>storage</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory} style={{ fontSize: "25px" }}>
                      Inventory
        </p>
                    <h3 className={classes.cardTitle}>{invDevices}</h3>
                  </CardHeader>
                  {/* <CardFooter stats /> */}
                </Card>
              </FrontSide>
            </Flippy>
            <Flippy isFlipped={false}
              style={{
                width: "auto",
                 paddingBottom: "30px",
                // minHeight: "225px"
              }}
            >
              <FrontSide>
                <Card>
                  <CardHeader color="primary" stats icon>
                    <CardIcon color="primary">
                      <Icon>people</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory} style={{ fontSize: "25px" }}>
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
            <Flippy isFlipped={flipped} style={{
              width: "auto",
//                             paddingBottom: "30px",
//                             minHeight: "350px"
            }}>
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
              <BackSide style={{ backgroundColor: "lightblue" }}>
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
              <BackSide style={{ backgroundColor: "#FFB266" }}>
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
            <Flippy isFlipped={false} style={{
//                            minwidth: "150px",
              width: "100%",
               paddingBottom: "30px",
            }}>
              <FrontSide>
                {jobStatusEmpty ? (
                  <Card style={{ minHeight: "100%" }}>
                    <CardHeader color="info">
                      <h4 className={classes.cardTitleWhite}>Job Status</h4>
                      <p
                        className={classes.cardCategoryWhite}
                        style={{ fontSize: "12px" }}
                      >
                        Job Status by type
                      </p>
                    </CardHeader>
                    <p style={{ fontSize: "20px", textAlign: "center", paddingTop: "180px" }}>There are currently no job status to be shown</p>

                  </Card>
                ) : (
                    <Card pie>
                      <CardHeader color="info">
                        <h4 className={classes.cardTitleWhite}>Job Status</h4>
                        <p
                          className={classes.cardCategoryWhite}
                          style={{ fontSize: "12px" }}
                        >
                          Job Status by type
                         </p>
                      </CardHeader>
                      <SimplePieChart piedata={status_piedata} />
                    </Card>
                  )}
              </FrontSide>
            </Flippy>
            <Flippy isFlipped={false} style={{
//                            minwidth: "150px",
//                             paddingTop: "15px",
            }}>
              <FrontSide>
                {deviceTypesEmpty ? (
                  <Card style={{ minHeight: "460px" }}>
                    <CardHeader color="info">
                      <h4 className={classes.cardTitleWhite}>Device Types</h4>
                      <p
                        className={classes.cardCategoryWhite}
                        style={{ fontSize: "14px" }}
                      >
                        Device types distributions in inventory
        </p>
                    </CardHeader>
                    <p
                      style={{ fontSize: "20px" }}
                    >
                      There are currently no devices in inventory
        </p>
                  </Card>
                ) : (
                    <Card pie>
                      <CardHeader color="info">
                        <h4 className={classes.cardTitleWhite}>Device Types</h4>
                        <p
                          className={classes.cardCategoryWhite}
                          style={{ fontSize: "14px" }}
                        >
                          Device types distributions in inventory
        </p>
                      </CardHeader>
                      <SimplePieChart piedata={device_piedata} />

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
