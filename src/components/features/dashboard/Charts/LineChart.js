import { makeStyles } from '@material-ui/core/styles';

const lineStyles = makeStyles(() => ({
  lineChart: {
    '& .ct-series-a .ct-bar, .ct-series-a .ct-line, .ct-series-a .ct-point, .ct-series-a .ct-slice-donut': {
      stroke: '#FFF',
    },
    '& .ct-grid': {
      stroke: '#FFF',
    },
    '& .ct-label': {
      color: '#FFF',
    },
  },
}));

export default lineStyles;
