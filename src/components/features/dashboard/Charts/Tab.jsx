import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #FFF',
  },
  indicator: {
    backgroundColor: '#343a40',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    '&:hover': {
      color: '#343a40',
      opacity: 1,
    },
    '&$selected': {
      color: '#343a40',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#343a40',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const useStylesTabs = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: '#2e1534',
  },
}));

function TabPanel(props) {
  const {
    children, value, index,
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const GraphTab = (props) => {
  const tabClasses = useStylesTabs();
  const [value, setValue] = useState(0);

  const {
    g1, g2, refreshChart, flipped,
  } = props;
  React.useEffect(() => {
    setValue(0);
  }, [flipped]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <>
      <div className={tabClasses.root}>
        <div className={tabClasses.demo1}>
          <AntTabs
            value={value}
            onChange={handleChange}
            aria-label="ant example"
            onClick={refreshChart}
            centered
            TabIndicatorProps={{ style: { background: 'white' } }}
          >
            <AntTab label="Daily" />
            <AntTab label="Monthly" />
          </AntTabs>
          <Typography className={tabClasses.padding} />
        </div>
        <TabPanel value={value} index={0}>
          {g1}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {g2}
        </TabPanel>
      </div>
    </>
  );
};

GraphTab.propTypes = {
  g1: PropTypes.func.isRequired,
  g2: PropTypes.func.isRequired,
  refreshChart: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
};

export default GraphTab;
