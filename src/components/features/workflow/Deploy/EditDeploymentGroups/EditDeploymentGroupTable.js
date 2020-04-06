import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CustomToolbarSelect from "./EditDeploymentToolbar";
import CustomToolbar from './EditDeployTableToolbar';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';

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
    padding: "0px 6px 0px 6px"
    }
  }
  }
});

const EditDeploymentsTable = (props) => {
  const { groupId } = props;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = React.useState([]);
  const [currentGroup, setCurrentGroup] = React.useState([]);
  const [rowSelect, setRowSelect] = React.useState([]);
  const [currentTitle, setCurrentTitle] = React.useState("");
  const [unlockedData, setUnlockedData] = React.useState();
  const authAPI = useAuthAPI();

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
        display: 'false',
      }
    },
    {
      name: "hostname",
      label: "Host Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "mgmt_ip",
      label: "Management IP",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "create_user.display_name",
      label: "Created By",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "locked_by",
      label: "Locked By",
      options: {
        filter: true,
        sort: true,
        display: 'false',
      }
    },
    {
      name: "timestamp",
      label: "Timestamp",
      options: {
        filter: true,
        sort: true,
        sortDirection: "desc",
        filterOptions: {
          names: ['Last 7 days', 'Last 14 days', 'Last 30 days'],
          logic(timestamp, filterVal) {
             var pastWeekDate = new Date();
             pastWeekDate.setDate(pastWeekDate.getDate() - 7);
             var pastTwoWeeksDate = new Date();
             pastTwoWeeksDate.setDate(pastTwoWeeksDate.getDate() - 14);
             var pastMonthDate = new Date();
             pastMonthDate.setDate(pastMonthDate.getDate() - 30);
             var timestampDate = new Date(timestamp);

             const show =
            (filterVal.indexOf('Last 7 days') >= 0 && timestampDate.getTime() >= pastWeekDate.getTime()) ||
            (filterVal.indexOf('Last 14 days') >= 0 && timestampDate.getTime() >= pastTwoWeeksDate.getTime()) ||
            (filterVal.indexOf('Last 30 days') >= 0 && timestampDate.getTime() >= pastMonthDate.getTime());
            return !show;
          }
        }
      }
    }
  ]

  const options = {
    filter: true,
    selectableRows: "multiple",
    filterType: "dropdown",
    responsive: "scrollFullHeight",
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    download: false,
    print: false,
    rowsSelected: rowSelect,
    onRowsSelect(currentRowsSelected, allRowsSelected) {
      setRowSelect(allRowsSelected.map(({ dataIndex }) => dataIndex))
    },
    customSort: (data, colIndex, order) => {
      //sort differently if mgmt_ip or timestamp
      if (colIndex === 2) {
        if (order === 'asc') {
          return data.sort((a, b) => {
            const num1 = Number(a.data[2].split(".").map((num) => (`000${num}`).slice(-3) ).join(""));
            const num2 = Number(b.data[2].split(".").map((num) => (`000${num}`).slice(-3) ).join(""));
            return (num1 > num2 ? 1: -1 );
          } )
        } else if (order === 'desc') {
          return data.sort((a, b) => {
            const num1 = Number(a.data[2].split(".").map((num) => (`000${num}`).slice(-3) ).join(""));
            const num2 = Number(b.data[2].split(".").map((num) => (`000${num}`).slice(-3) ).join(""));
            return (num1 < num2 ? 1: -1 );
          });
        }
      } else if (colIndex === 5) {
        if (order === 'asc') {
          return data.sort((a, b) => {
              return new Date(a.data[colIndex]) - new Date(b.data[colIndex]);
          } )
        } else if (order === 'desc') {
          return data.sort((a, b) => {
            return new Date(b.data[colIndex]) - new Date(a.data[colIndex])
          });
        }
      } else {
        if (order === 'asc') {
          return data.sort((a, b) => {
              return (a.data[colIndex] < b.data[colIndex] ? 1: -1 );
          } )
        } else if (order === 'desc') {
          return data.sort((a, b) => {
            return (a.data[colIndex] < b.data[colIndex] ? -1: 1 );
          });
        }
      }
    },
    customToolbarSelect: (selectedRows, displayData) => {
      return (
        <CustomToolbarSelect
          groupId={groupId}
          selectedRows={selectedRows}
          displayData={displayData}
          currentTitle={currentTitle}
          setCurrentTitle={setCurrentTitle}
        />
      );
    },
    customToolbar: () => {
      return (
        <CustomToolbar />
      );
    }
  };

  //set rowSelect state with ids that correlate to the table according to device ids in currentGroup
  //rowSelect passed into options rowsSelected
  const deviceSelections = () => {
    var rowsToSelect = [];
    for (var device in currentGroup) {
      for (var row in unlockedData) {
        if (unlockedData[row].id == currentGroup[device]) {
          rowsToSelect.push(parseInt(row));
        }
      }
    }
    setRowSelect(rowsToSelect);
  }

  useEffect(() => {
    deviceSelections();
  }, [currentGroup]);

  //getting array of devices that need to be selected by their db id (currentGroup)
  useEffect(() => {
    deviceSelections();

    authAPI.get(`/workflow/get_back_ref/deploy/id:${groupId}`).then(({ data }) => {
      const rows = data.data[0];
      var groupSelect = [];

      for (var idx in rows.devices) {
        groupSelect.push(rows.devices[idx].id);
      }

      setCurrentTitle(rows.name);
      setCurrentGroup(groupSelect);
    }).catch(() => {
      showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar)
    });

  }, [unlockedData]);

  async function getData() {
    const { data: unlockedDevices } = await authAPI.get(`/workflow/unlocked_devices`)
    const { data: deploymentGroupDevices } = await authAPI.get(`/workflow/deployment_group_devices/${groupId}`)
    setUnlockedData([...deploymentGroupDevices.data, ...unlockedDevices.data])
  }

  //pull all devices in inventory to sort through
  useEffect(() => {
    getData().catch(() => {
      showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar)
    });
  }, []);

  return (
    <MuiThemeProvider theme={tableTheme}>
      <MUIDataTable
        title={"Select Device(s)"}
        data={unlockedData}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
}

export default EditDeploymentsTable;
