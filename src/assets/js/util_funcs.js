/* eslint-disable */
function onSubmit(ev) {
  if ($("#deviceform")[0].checkValidity()) {
    ev.preventDefault(); // This prevents the post back action of the form
    $('#exampleModal').modal('show');
  } else {
    $("#deviceform")[0].reportValidity();
  }
}

function onOK(url) {
  window.location.replace(url);
}

function onConfirmDeploy(ev, devicetype, referrer) {
  $('#exampleModal').modal('hide');
  let json = {};
  var formData = new FormData(document.getElementById("deviceform"));
  formData.forEach(function (value, key) {
    if (value.length < 1) {
      // This needs to be handled as an error instead
      console.log(`For form key: ${key}, no value was found, using empty string instead`);
      value = "";
    }
    json[key] = value;

  });
  json["template"] = devicetype;
  var api_data = JSON.stringify(json);

  console.log(api_data);
  console.dir(json);

  var localproxy = "/get_config";
  // var url = "http://10.253.182.9:8098/base_config_gen/api/";
  const controller = new AbortController();
  const signal = controller.signal;

  window.fetch(localproxy, {
    signal,
    method: 'POST',
    body: api_data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(
      response => {
        if (response.status !== 200) {
          console.log('Error performing POST: Status Code ' + response.status);
          // $('#errorModal').find('.modal-body').text('ERROR: ' + response);
          $('#errorModal').modal('show');
          return;
        }
        response.json().then(function (data) {
          // debugger;
          console.log(data);
          redirectURL =`/jobs/${data.uuid}`
//                    redirectURL = `onOK('/jobs/${data.uuid}')`;
          console.log(redirectURL);
//                    $('#successModal').find('.modal-body').text('Request ID: ' + data.uuid);
//                    $('#successButton').attr("onclick", redirectURL);
//                    $('#successModal').modal('show');
//                    window.location.href(redirectURL)
          window.location.replace(redirectURL)
        });
      }
    )
    .catch(error => {
      if (error.name === 'AbortError') {
        console.error('Fetch was aborted');
        $('#errorModal').find('.modal-body').text('ERROR: ' + error);
        $('#errorModal').modal('show');
        return;
      } else {
        console.log('Error performing POST: ' + error);
        $('#errorModal').find('.modal-body').text('ERROR: ' + error);
        $('#errorModal').modal('show');
        return;
      }
    })

  // This causes the POST to the base config generator to abort after 3 seconds
  // setTimeout(() => controller.abort(), 3 * 1000);
}

function testvalues() {
  var formData = new FormData(document.getElementById("deviceform"));
  formData.forEach(function (value, key) {
    if (value.length < 1) {
      var field = document.getElementById(key);
      field.value = field.placeholder;
    }
  });
}

function chequeForMatches(selector1, selector2){
  var element1 = document.getElementById(selector1)
  var element2 = document.getElementById(selector2)

  if (element1.value != '' || element2.value != '') {
  // neither values can be empty

    if (element1.value === element2.value){
      element1.setCustomValidity('Fields must not match')
      element2.setCustomValidity('Fields must not match')


      element1.classList.add("is-invalid")
      element2.classList.add("is-invalid")

    } else {
      element1.setCustomValidity('')
      element2.setCustomValidity('')

      element1.classList.remove("is-invalid")
      element2.classList.remove("is-invalid")
    }
  }
}
