import React from "react";
import { PieChart, Pie, Cell } from "recharts";

import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

// core components
import styles from "../assets/jss/material-dashboard-react/components/pieStyle.js";

//values
var data;
const useStyles = makeStyles(styles);

const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#E20074", "#800080", "PINK", "#00dce4", "#E10043"];

const RADIAN = Math.PI / 180;

export default function SimplePieChart(props) {

  const classes = useStyles();
  const { className, ...rest } = props;

  const { piedata } = props;
  const pieClasses = classNames({
    [classes.pieChart]: true,
    [className]: className !== undefined
  });
  data=piedata;

  const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      index
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.28;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          style={{ fontSize: "15px"}}
        >
          {piedata[index].name} {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };
  return (
    <div className={pieClasses} {...rest}>
      <PieChart width={450} height={450} fontSize={20}>
        <Pie
          data={data}
          cx={225}
          cy={225}
          labelLine={false}
          label={renderCustomizedLabel}
          isAnimationActive={false}
          outerRadius={210}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}