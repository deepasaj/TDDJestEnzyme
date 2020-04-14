import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { showNotification } from 'utils/notifications';

import { useAuthAPI } from 'store/store';
import CustomToolbar from './CreateDeployGroupToolbar';
import DeploymentGroupCustomToolbarSelect from './DeploymentGroupCustomToolbarSelect';

const tableTheme = createMuiTheme({
  overrides: {
    // MUIDataTablesHead: {
    //   root: {
    //     padding: 0
    //   }
    // },
    // MUIDataTableBodyCell: {
    //   root: {
    //     padding: 0,
    //     backgroundColor: "#FF0000"
    //   }
    // },
    MuiTableCell: {
      root: {
        padding: '0px 16px 0px 16px',
      },
    },
  },
});

const DeploymentGroupTable = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [unlockedData, setUnlockedData] = useState();
  const [groupId, setGroupId] = useState('');
  const authAPI = useAuthAPI();

  const columns = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: true,
        display: 'false',
      },
    },
    {
      name: 'hostname',
      label: 'Host Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'mgmt_ip',
      label: 'Management IP',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'create_user.display_name',
      label: 'Created By',
      options: {
        filter: true,
        sort: true,
        display: 'true',
      },
    },
    {
      name: 'timestamp',
      label: 'Timestamp',
      options: {
        filter: true,
        sort: true,
        sortDirection: 'desc',
        filterOptions: {
          names: ['Last 7 days', 'Last 14 days', 'Last 30 days'],
          logic(timestamp, filterVal) {
            const pastWeekDate = new Date();
            pastWeekDate.setDate(pastWeekDate.getDate() - 7);
            const pastTwoWeeksDate = new Date();
            pastTwoWeeksDate.setDate(pastTwoWeeksDate.getDate() - 14);
            const pastMonthDate = new Date();
            pastMonthDate.setDate(pastMonthDate.getDate() - 30);
            const timestampDate = new Date(timestamp);

            const show = (filterVal.indexOf('Last 7 days') >= 0 && timestampDate.getTime() >= pastWeekDate.getTime())
              || (filterVal.indexOf('Last 14 days') >= 0 && timestampDate.getTime() >= pastTwoWeeksDate.getTime())
              || (filterVal.indexOf('Last 30 days') >= 0 && timestampDate.getTime() >= pastMonthDate.getTime());
            return !show;
          },
        },
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: 'multiple',
    filterType: 'dropdown',
    responsive: 'scrollFullHeight',
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    print: false,
    download: false,
    customSort: (data, colIndex, order) => {
      // sort differently if column is date or management ip
      if (colIndex === 2) {
        if (order === 'asc') {
          return data.sort((a, b) => {
            const num1 = Number(a.data[2].split('.').map((num) => (`000${num}`).slice(-3)).join(''));
            const num2 = Number(b.data[2].split('.').map((num) => (`000${num}`).slice(-3)).join(''));
            return (num1 > num2 ? 1 : -1);
          });
        } if (order === 'desc') {
          return data.sort((a, b) => {
            const num1 = Number(a.data[2].split('.').map((num) => (`000${num}`).slice(-3)).join(''));
            const num2 = Number(b.data[2].split('.').map((num) => (`000${num}`).slice(-3)).join(''));
            return (num1 < num2 ? 1 : -1);
          });
        }
      } else if (colIndex === 5) {
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
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <DeploymentGroupCustomToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        groupId={groupId}
        setGroupId={setGroupId}
      />
    ),
    customToolbar: () => (
      <CustomToolbar />
    ),
  };

  // pulls all inventory, not the data you see in the table
  useEffect(() => {
    authAPI.get('/workflow/unlocked_devices').then(({ data }) => {
      const unlockedDevices = data.data;
      setUnlockedData(unlockedDevices);
    }).catch(() => {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    });
  }, []);

  return (
    <>
      <MuiThemeProvider theme={tableTheme}>
        <MUIDataTable
          title="Select Device(s)"
          data={unlockedData}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>

    </>
  );
};

export default DeploymentGroupTable;
