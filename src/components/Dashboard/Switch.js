import React from "react";
import Switch from "@material-ui/core/Switch";

export default function Switches(props) {
  const [state, setState] = React.useState({
    checkedA: false
  });


  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const { flipCard } = props;
  const { RefreshChart } = props;
  const {flipped} = props;

  React.useEffect(() => {
  }, [flipCard, flipped]);

  const refreshAll = () => {
    flipCard();
    setTimeout(() => {
      RefreshChart();
    }, 8);
  }

  return (
    <div>
      <Switch
        checked={state.checkedA}
        onChange={handleChange("checkedA")}
        value="checkedA"
        color="primary"
        inputProps={{ "aria-label": "primary checkbox" }}
        onClick={refreshAll}
      />
      Metric Switch
    </div>
  );
}
