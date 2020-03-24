import LinearProgress from "@material-ui/core/LinearProgress";
import { useState, useEffect } from "react";
import { FilePond } from "react-filepond";
import React from 'react';
import axios from 'axios'
import Papa from 'papaparse'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import { API_URL } from 'config';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useStateValue, useAuthAPI, useUser } from 'store/store';

function validateCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function ({ errors, data }) {
        if(errors.length) {
          const errorMessages = errors.map(
            ({ row, message }) => `Row: ${row + 1}, ${message}`
          )
          reject(new Error(`${file.name}:\n${errorMessages.join('\n')}`))
        } else if(data.length > 50) {
          reject(new Error(`${file.name}: Cannot exceed 50 entries.`))
        } else {
          resolve()
        }
      }
    })
  })
}

function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

function BulkUpload(props) {
  const [state] = useStateValue();
  const { history } = props;
  const authAPI = useAuthAPI();
  const user = useUser();

  const goToManageInventory = () => {
    history.push('/inventory/manage')
  }

  const message = {
    success: "Content successfully validated and updated to database.",
    error: "The file format is incorrect.",
    info: "File format is valid, now validating the contents.",
  };

  let ID = -1;
  function getId() {
    ID++;
    return ID;
  }

  const [form, setValues] = useState([{id: 0, filename: "", progress: 0, display: false}]);
  const [done, setStatus] = useState(false);

  useEffect(() => {
  }, [form, done]);


  const updateValue = (set_progress, in_filename, index, setDisplay) => {

    var newValues = {
      id: index,
      filename: in_filename,
      progress: set_progress,
      display: setDisplay
    };

    setValues(prevValues => {
      var tempValues = [];
      if (prevValues[index] != undefined) {
        prevValues[index] = newValues;
        tempValues = prevValues;
      } else {
        tempValues = [...prevValues, newValues];
      }
      return Object.create(tempValues);
    });
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const pondOptions = {
    revert: null,
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      let isCancelledByUser = false
      const cancellationController = axios.CancelToken.source()

      const index = getId();

      const pond = document.querySelector('.filepond--root');
      pond.addEventListener('FilePond:removefile', () => {
        updateValue(0, file.name, index, false)
      })

      const formData = new FormData();
      formData.append(fieldName, file, file.name);

      async function process() {
        try {
          await validateCSV(file)

          const { data: bulkUploadResponse } = await authAPI.post(
            "/bulk_upload",
            formData,
            {
              cancelToken: cancellationController.token,
              timeout: 15000,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          if (bulkUploadResponse.status != 'success')
            throw new Error(`${file.name}: ${bulkUploadResponse.data}`)
          
          const jobId = bulkUploadResponse.data
            
          showNotification(`${file.name}: ${message.info}`, 'info', enqueueSnackbar, closeSnackbar);
          updateValue(33, file.name, index, true);

          let bulkStatus = {
            code: 102
          };

          while(bulkStatus.code === 102) {
            await sleep(3000)

            bulkStatus = (await authAPI.get(`/bulk_status/${jobId}`, {
              cancelToken: cancellationController.token
            })).data
          }

          if (bulkStatus.code != 200) {
            var msg = JSON.parse(bulkStatus.data);
            throw new Error(`${file.name}: ${msg.detail}`)
          }

          updateValue(66, file.name, index, true);

          const { data: bulkInsertResponse } = await authAPI.post(
            `/bulk_insert/?job_id=${jobId}&user_id=${user.id}`,
            formData,
            {
              cancelToken: cancellationController.token,
              timeout: 15000,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )

          if (bulkInsertResponse.code < 200 | bulkInsertResponse.code > 300) {
            var msgInsert = JSON.parse(bulkInsertResponse.data);
            throw new Error(`${file.name}: ${msgInsert.detail.error}`)
          }

          showNotification(`${file.name}: ${message.success}`,
            'success', enqueueSnackbar, closeSnackbar);
          updateValue(100, file.name, index, true)
          setStatus(true);
          load(file);

        } catch (err) {
          if(axios.isCancel(err)) {
            if(!isCancelledByUser) {
              error("connection timeout");
              showNotification("An error occurred connecting to VAPI.", 'error', enqueueSnackbar, closeSnackbar);
            }
          } else {
            console.error(err)
            error("Upload Error")
            showNotification(err.message, 'error', enqueueSnackbar, closeSnackbar);
          }
          updateValue(0, file.name, index, true)
        }
      }
      process()

      //Should expose an abort method so the request can be cancelled
      return {
        abort: () => {
          error("abort")
          isCancelledByUser = true
          cancellationController.cancel();
          abort();
          
          showNotification(file.name + ": Process has been cancelled.", 'error', enqueueSnackbar, closeSnackbar);
          updateValue(0, file.name, index, false)
        }
      };
    }
  }

  return (
    <React.Fragment>
      <div style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto', }}>
        <h3>Instructions</h3>
        <div>Download the template using the button provided below and edit the file adding one or more devices
        as needed. Then drag and drop the resulting file(s) on to the drop area below or click browse to use
        the file explorer to locate and select your file(s).</div>
        <div style={{ textAlign: 'right', marginTop: '20px', }}>
          <a className="btn btn-primary" href={`${API_URL}/static/inventory_add_template.csv`}>Template</a>
        </div>
        <hr />
        <br />
        <br />
        <FilePond
          name="infile"
          server={pondOptions}
          allowMultiple={true}
          maxFiles={3}
          labelFileProcessing="Validating against API"
        />
        <br />
        <ul style= {{listStyle: "none", paddingLeft: 0 }}>
          {form.map(item => {
            // eslint-disable-next-line
            if (item.display == true && form[item.id].hasOwnProperty('progress')) {
              return (
                <div key={item.id}>
                  <React.Fragment>
                    {item.filename}
                    <LinearProgress
                      style={{ width: '100%' }}
                      variant="determinate"
                      value={form[item.id].progress ? form[item.id].progress : 0}
                    />
                  </React.Fragment>
                </div>
              )
            }
          })}
        </ul>
        {done ?
          <div>
            <Tooltip title="Click to view recently added devices in inventory">
              <IconButton aria-label="navigate to manage inventory" style={{left:"92%"}} onClick={() => goToManageInventory()}>
                <ExitToAppIcon style={{fontSize: "3rem"}} />
              </IconButton></Tooltip></div>: " "}

      </div>
    </React.Fragment>
  );
}

export default withRouter(BulkUpload);