import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import ApplicationTab from "./Applications";
import HomeTab from "./Home";

// eslint-disable-next-line no-unused-vars
const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8"
  },
  indicator: {
    backgroundColor: "#343a40"
  }
})(Tabs);

// eslint-disable-next-line no-unused-vars
const AntTab = withStyles(theme => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    "&:hover": {
      color: "#343a40",
      opacity: 1
    },
    "&$selected": {
      color: "#343a40",
      fontWeight: theme.typography.fontWeightMedium
    },
    "&:focus": {
      color: "#343a40"
    }
  },
  selected: {}
}))(props => <Tab disableRipple {...props} />);

const useStylesTabs = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  padding: {
    padding: theme.spacing(3)
  },
  demo1: {
    backgroundColor: theme.palette.background.paper
  },
  demo2: {
    backgroundColor: "#2e1534"
  }
}));

// eslint-disable-next-line no-unused-vars
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

const ProteusMain = () => {
  const tabClasses = useStylesTabs(); // eslint-disable-line no-unused-vars
  const [value, setValue] = React.useState(0); // eslint-disable-line no-unused-vars
  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
  }, [refresh]);


  // eslint-disable-next-line no-unused-vars
  const RefreshChart = () => {
    setTimeout(() => {
      if (refresh) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
    }, 20);
  };

  // eslint-disable-next-line no-unused-vars
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>

          <HomeTab />
          <ApplicationTab />

    </React.Fragment>
  );
};

export default ProteusMain;
