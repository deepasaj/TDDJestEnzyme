//import React from "react";
// ##############################
// // // javascript library for creating charts
// #############################
var Chartist = require("chartist");

// ##############################
// // // variables used to create animation on charts
// #############################
var delays = 80,
  durations = 500;
var delays2 = 80,
  durations2 = 500;


// ##############################
// // // Daily Graph
// #############################

const dailyGraph = {
  data: {
    labels: ["M", "T", "W", "TH", "F", "S", "S"],
    series: [[12, 17, 7, 17, 23, 18, 38]]
  },
  job_options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0.2
    }),
    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    stretch: true,
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  job_user_options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0.2
    }),
    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  user_options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0.2
    }),
    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  task_options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0.2
    }),
    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  task_user_options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0.2
    }),
    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },

  animation: {
    draw: function(data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

// ##############################
// // // Monthly Graph
// #############################

const monthlyGraph = {
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    series: [[542, 443, 365, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
  },
  options: {
    low: 0,
    high: 5,
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
    job_options: {
    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  job_user_options: {

    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  user_options: {

    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  task_options: {

    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  task_user_options: {
    low: 0,
    high: 5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 0
    },
    width: "750px",
    height: '190px',
    offset: 0,
    scaleMinSpace: 17,

    fullWidth: true,
    fullHeight: true
  },
  responsiveOptions: [
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function(value) {
            return value[0];
          }
        }
      }
    ]
  ],
  animation: {
    draw: function(data) {
      if (data.type === "bar") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

module.exports = {
  dailyGraph,
  monthlyGraph
};
