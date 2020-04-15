import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

function Switches({ flipCard, RefreshChart }) {
  const [state, setState] = useState({
    checkedA: false,
  });


  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const refreshAll = () => {
    flipCard();
    setTimeout(() => {
      RefreshChart();
    }, 8);
  };

  return (
    <div>
      <Switch
        checked={state.checkedA}
        onChange={handleChange('checkedA')}
        value="checkedA"
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
        onClick={refreshAll}
      />
      Metric Switch
    </div>
  );
}

Switches.propTypes = {
  flipCard: PropTypes.func.isRequired,
  RefreshChart: PropTypes.func.isRequired,
};

export default Switches;
