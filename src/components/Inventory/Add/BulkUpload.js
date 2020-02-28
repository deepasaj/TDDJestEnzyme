import LinearProgress from "@material-ui/core/LinearProgress";
import { useState, useEffect } from "react";
import { FilePond } from "react-filepond";
import React from 'react';
import Papa from 'papaparse'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import { API_URL } from 'config';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { getAuthHeader } from 'utils/auth';
import { useStateValue } from 'store/store';


function BulkUpload(props) {
  const [state] = useStateValue();
  const { history } = props;
  const authHeader = getAuthHeader(state.token);

  const goToManageInventory = () => {
    history.push('/inventory/manage')
  }

  var rowValidate = true;
  const message = {
    success: ": Content successfully validated and updated to database.",
    error: ": The file format is incorrect.",
    info: ": File format is valid, now validating the contents.",

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

  function csvCallBack(results) {
    const maxCount = 50;
    if (results.data.length <= maxCount) {
      return true;
    }
    return false;
  }

  const pondOptions = {
    revert: null,
    process: (fieldName, file, metadata, load, error, progress, abort) => {

      const pond = document.querySelector('.filepond--root');
      pond.addEventListener('FilePond:removefile', () => {
        updateValue(0, file.name, index, false)
      })
      var abortController = new AbortController();
      var controller_signal = abortController.signal;
      //var cancel = abortController.abort.bind(abortController);
      const formData = new FormData();
      formData.append(fieldName, file, file.name);
      var job_id = "";
      var user_id = 1;
      const index = getId();
      /*
      function status(response) {
        if (response.status >= 200 && response.status < 300) {
          // eslint-disable-next-line no-undef
          return Promise.resolve(response)
        }
        else {
          // eslint-disable-next-line no-undef
          return Promise.reject(new Error(response.statusText))
        }
      }
      */
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        chunk: function (results) {
          rowValidate = csvCallBack(results);
        },
        complete: function () {
          if (!rowValidate) {
            error("too big");
            showNotification(file.name + ": Cannot exceed 50 entries.", 'error', enqueueSnackbar, closeSnackbar);
            return;
            //parser.abort();
          }

          let didTimeOut1 = false;
          let didTimeOut2 = false;
          let didTimeOut3 = false;
          // eslint-disable-next-line no-undef
          new Promise(function (resolve, reject) {

            const timeout1 = setTimeout(function () {
              didTimeOut1 = true;
              reject(new Error('Request timed out'));
            }, 6000);


            //fetch for bulk upload
            fetch(API_URL + "/bulk_upload", {
              method: 'POST',
              body: formData,
              signal: controller_signal,
              headers: authHeader
            })
              //then for bulk upload
              .then((response) => {
                response.json().then((responseData) => {
                  clearTimeout(timeout1);
                  if (!didTimeOut1) {
                    resolve(responseData);
                    job_id = responseData.data;
                    if (responseData.status != 'success') {
                      showNotification(file.name + ': ' + responseData.data, 'error', enqueueSnackbar, closeSnackbar);
                      error("invalid format");
                      return;
                    }
                    showNotification(file.name + ' ' + message.info, 'error', enqueueSnackbar, closeSnackbar);
                    setTimeout(() => {
                      updateValue(33, file.name, index, true);
                      function getStatus(url) {

                        // eslint-disable-next-line no-undef
                        new Promise(function (resolve, reject) {

                          const timeout2 = setTimeout(function () {
                            didTimeOut2 = true;
                            reject(new Error('Request timed out'));
                          }, 7000);

                          //fetch for url
                          fetch(url, {
                            method: 'GET',
                            signal: controller_signal
                          })
                            //then for url
                            .then((response2) => {
                              response2.json().then((responseData2) => {
                                clearTimeout(timeout2);
                                if (!didTimeOut2) {
                                  resolve(responseData2);
                                  if (responseData2.code == 102) {
                                    setTimeout(() => {
                                      return getStatus(url)
                                    }, 5000);
                                  }
                                  else if (responseData2.code != 200 && responseData2.code != 102) {
                                    var msg = JSON.parse(responseData2.data);
                                    showNotification(file.name + ": " + msg.detail, 'error', enqueueSnackbar, closeSnackbar);
                                    error("status error");
                                    updateValue(0, file.name, index, true)
                                    return;
                                  }
                                  else {
                                    setTimeout(() => {
                                      updateValue(66, file.name, index, true);

                                      // eslint-disable-next-line no-undef
                                      new Promise(function (resolve, reject) {

                                        const timeout3 = setTimeout(function () {
                                          didTimeOut3 = true;
                                          reject(new Error('Request timed out'));
                                        }, 15000);

                                        //fetch for /bulk_insert/?job_id=
                                        fetch(API_URL + "/bulk_insert/?job_id=" + job_id + "&user_id=" +
                                          user_id, {
                                          method: 'POST',
                                          body: formData,
                                          signal: controller_signal,
                                          headers: authHeader
                                        })
                                          //then for /bulk_insert/?job_id=
                                          .then((response3) => {
                                            response3.json().then((responseData3) => {
                                              clearTimeout(timeout3);
                                              if (!didTimeOut3) {
                                                resolve(responseData3);
                                                if (responseData3.code < 200 | responseData3.code > 300) {
                                                  var msgInsert = JSON.parse(responseData3.data);
                                                  showNotification(file.name + ": " + msgInsert.detail.error, 'error', enqueueSnackbar, closeSnackbar);
                                                  updateValue(0, file.name, index, true)
                                                  error("database error");
                                                  return;
                                                }
                                                else {
                                                  showNotification(file.name + message.success,
                                                    'success', enqueueSnackbar, closeSnackbar);
                                                  updateValue(100, file.name, index, true)
                                                  setStatus(true);
                                                  load(file);
                                                  return;
                                                }
                                              }
                                            });
                                          })
                                          // catch for /bulk_insert/?job_id=
                                          .catch((err) => {
                                            if (err.name === 'AbortError') {
                                              return;
                                            }
                                          });
                                      })
                                        //then catch for /bulk_insert/?job_id= promise
                                        .then(function () {
                                        })
                                        .catch(function () {
                                          // Error: response error, request timeout or runtime error
                                          showNotification("An error occurred connecting to VAPI.", 'error', enqueueSnackbar, closeSnackbar);
                                          error("connection timeout");
                                          return;
                                        })
                                    }, 3000);
                                  }
                                }
                              });

                            })
                            //catch for url
                            .catch((err) => {
                              if (err.name === 'AbortError') {
                                return;
                              }
                            });
                        })
                          //then catch for url promise
                          .then(function () {
                          })
                          .catch(function () {
                            // Error: response error, request timeout or runtime error
                            showNotification("CAn error occurred connecting to VAPI.", 'error', enqueueSnackbar, closeSnackbar);
                            error("connection timeout");
                            return;
                          })
                      }
                      getStatus(API_URL + "/bulk_status/" + job_id);
                    }, 2000);
                  }
                });
              })
              //catch for bulk upload
              .catch((err) => {
                if (err.name === 'AbortError') {
                  return;
                }
              });
          })
            //then catch for bulk upload promise
            .then(function () {
            })
            .catch(function () {
              // Error: response error, request timeout or runtime error
              showNotification("Currently unable to connect to VAPI.", 'error', enqueueSnackbar, closeSnackbar);
              error("connection timeout");
              return;
            })
        }
      })
      //Should expose an abort method so the request can be cancelled
      return {
        abort: () => {
          error("abort")
          showNotification(file.name + ": Process has been cancelled.", 'error', enqueueSnackbar, closeSnackbar);
          updateValue(0, file.name, index, false)
          abortController.abort();
          abort();
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