import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import LoadingPage from 'components/LoadingPage';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';


const separator = {
  '------------------------------------': '------------------------------------',
};

const useStyles = makeStyles(() => ({
  rowExpand: {
    backgroundColor: '#f7f7f7',
  },
  table: {
    boxShadow: '0px 0px 0px 0px',
    border: '1px solid #e3e3e3',
    borderRadius: '5px',
  },
  btn_primary: {
    marginLeft: '10px',
    marginRight: '25px',
  },
  edit_btn: {
    marginRight: '10px',
    padding: 6,
  },
  titleField: {
    width: '200px',
  },
  boldness: {
    fontWeight: '50px',
  },
  emptyRow: {
    textAlign: 'center',
    backgroundColor: '#F5F5F5',
  },
}));

const tableTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '6px 16px 6px 16px',
      },
    },
    MUIDataTableHeadCell: {
      root: {
        '&:nth-child(2)': {
          width: 350,
        },
      },
    },
    //        MUIDataTableBodyCell: {
    //            root: {
    //                backgroundColor: "#FFF",
    //                width: "150px"
    //            }
    //        }
  },
});

const Validation = () => {
  const classes = useStyles();
  const { jobId } = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [systems, setSystems] = useState();
  const [tasks, setTasks] = useState([]);
  const [loadingDone, setLoadingDone] = useState(false);
  const authAPI = useAuthAPI();

  const getReportData = () => {
    authAPI.get(`/workflow/get_tasks/${jobId}`).then(({ data }) => {
      const rows = data.data;
      setTasks(rows);
    }).catch(() => {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    });
  };

  useEffect(() => {
    setLoadingDone(false);
    getReportData();
  }, []);

  useEffect(() => {
    const systemsReportsList = [];

    tasks.forEach((task) => {
      const taskObject = JSON.parse(task.task_object);
      const systemReport = taskObject.output;

      const hostSystem = `${task.target} | ${task.tool}`;

      const keyValue = [];

      // Create List of Objects
      const resultObject = systemReport.result;

      if (resultObject && systemReport.result.length > 1) {
        for (let i = 0; i < resultObject.length; i++) {
          if (typeof resultObject[i] === 'object') {
            Object.entries(resultObject[i]).forEach(([key, value]) => {
              keyValue.push({ [key]: value });
            });
          } else {
            keyValue.push({ ' ': resultObject[i] });
          }
          keyValue.push(separator);
        }
      } else if (resultObject && typeof resultObject[0] === 'object') {
        Object.entries(resultObject[0]).forEach(([key, value]) => {
          keyValue.push({ [key]: value });
        });
      } else if (resultObject) {
        keyValue.push({ ' ': resultObject[0] });
      }

      // Push the results into a temporary array
      systemsReportsList.push([
        hostSystem,
        systemReport.status,
        systemReport.error,
        keyValue,
      ]);
    });

    if (systemsReportsList.length) {
      setSystems(systemsReportsList);
      setLoadingDone(true);
    }
  }, [tasks]);

  const columns = [
    {
      name: 'Systems',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'Status',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'Error',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'Results',
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      },
    },
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'scrollFullHeight',
    selectableRows: 'none',
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    print: false,
    expandableRows: true,
    customSort: (data, colIndex, order) => {
      // sort differently if column is date
      if (colIndex === 3) {
        if (order === 'asc') {
          return data.sort((a, b) => new Date(a.data[colIndex]) - new Date(b.data[colIndex]));
        } if (order === 'desc') {
          return data.sort((a, b) => new Date(b.data[colIndex]) - new Date(a.data[colIndex]));
        }
      } else {
        if (order === 'asc') {
          return data.sort((a, b) => (a.data[colIndex] < b.data[colIndex] ? 1 : -1));
        } if (order === 'desc') {
          return data.sort((a, b) => (a.data[colIndex] < b.data[colIndex] ? -1 : 1));
        }
      }
      throw new Error('Unexpected order value');
    },
    renderExpandableRow: (rowData) => {
      const colSpan = rowData.length + 1;
      let emptyRow = false;
      // if no results, display message
      if (systems.length <= 0) {
        emptyRow = true;
      }

      return (
        <>
          {emptyRow ? (
            <TableRow>
              <TableCell colSpan={colSpan} className={classes.emptyRow}>
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            <TableRow tabIndex={-1} className={classes.rowExpand}>
              <TableCell colSpan={colSpan} align="center">
                <Table>
                  <TableHead style={{ fontWeight: '500px' }}>
                    <TableRow>
                      <TableCell align="left">Key</TableCell>
                      <TableCell alight="left">Result</TableCell>
                    </TableRow>
                  </TableHead>
                  {rowData[3].map((row, index) => {
                    const key = Object.keys(row)[0];
                    // Check for array of results and seperate with comma for easy read
                    const result = Array.isArray(row[key]) ? row[key].join(', ') : row[key];

                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableBody key={index} className={classes.rowExpand}>
                        <TableRow className={classes.rowExpand}>
                          <TableCell alight="left">
                            {key}
                          </TableCell>

                          <TableCell alight="left">
                            {result}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    );
                  })}
                </Table>
              </TableCell>
            </TableRow>
          )}
        </>
      );
    },
  };

  return (
    <>
      {loadingDone ? (
        <MuiThemeProvider theme={tableTheme}>
          <MUIDataTable
            title="Reports Table"
            data={systems}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default Validation;
