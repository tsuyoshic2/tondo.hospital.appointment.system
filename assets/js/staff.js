$(function(){
  let currentPage = $(location).attr("href").split("/").pop();
  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000
  });
  function ToastFire(message, type){
    Toast.fire({
      title: message,
      type: type
    });
  }
  const editModal = `<div id="edit_modal" class="modal fade effect-scale">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content bd-0 tx-14">
          <div class="modal-header pd-y-20 pd-x-25">
            <h3 class="tx-14 mg-b-0 tx-uppercase tx-inverse tx-bold">Edit Profile</h3>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="edit_form" class="modal-body form-layout form-layout-1">
            <div class="row mg-b-25">
              <div class="col-lg-4">
                <div class="form-group">
                  <label class="form-control-label">Firstname: <span class="tx-danger">*</span></label>
                  <input class="form-control" type="text" id="user_firstname" placeholder="Enter firstname" required>
                </div>
              </div><!-- col-4 -->
              <div class="col-lg-3">
                <div class="form-group">
                  <label class="form-control-label">Middlename: </label>
                  <input class="form-control" type="text" id="user_middlename" placeholder="Enter middlename">
                </div>
              </div><!-- col-4 -->
              <div class="col-lg-3">
                <div class="form-group">
                  <label class="form-control-label">Lastname: <span class="tx-danger">*</span></label>
                  <input class="form-control" type="text" id="user_lastname" placeholder="Enter lastname" required>
                </div>
              </div><!-- col-4 -->
              <div class="col-lg-2">
                <div class="form-group">
                  <label class="form-control-label">Prefix:</label>
                  <input class="form-control" type="text" id="user_prefix" placeholder="Enter Prefix">
                </div>
              </div><!-- col-4 -->
              <div class="col-lg-6">
                <div class="form-group">
                  <label class="form-control-label">Email address: <span class="tx-danger">*</span></label>
                  <input class="form-control" type="email" id="user_email" placeholder="Enter email address" required>
                </div>
              </div><!-- col-4 -->
              <div class="col-lg-6">
                <div class="form-group mg-b-10-force">
                  <label class="form-control-label">Password: <span class="tx-danger">*</span></label>
                  <div class="input-group">
                    <input type="password" id="user_password" class="form-control" placeholder="Enter Password" required>
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        <label class="ckbox wd-16 mg-b-0">
                          <i id="editShowPassword" class="fa fa-eye-slash"></i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-layout-footer">
              <button class="btn btn-info">Submit</button>
              <button class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
  $(editModal).insertAfter(".br-mainpanel");
  $("#editProfile").click(function(){
    EmptyEditModal();
    $.ajax({
      url: '../api/request/EditProfile.php?GetUserInfo',
      method: 'GET',
      contentType: 'application/JSON',
      success: function(data){
        $("#user_firstname").val(data.FirstName);
        $("#user_middlename").val(data.MiddleName);
        $("#user_lastname").val(data.LastName);
        $("#user_prefix").val(data.Prefix);
        $("#user_email").val(data.Email);
        $("#user_password").val(data.UserPassword);
        $("#edit_modal").modal('toggle');
      },
      error: function(xhr, status, code){
        console.log(code)
      }
    })
  });
  $("#editShowPassword").click(function(){
    $(this).toggleClass("fa-eye-slash fa-eye");
    if($(this).hasClass("fa-eye-slash")){
      $("#user_password").attr("type", "password");
    }else{
      $("#user_password").attr("type", "text");
    }
  });
  $("#edit_form").submit(function(x){
    x.preventDefault();
    if(ValidateUserEmail($("#user_email").val())){
      ToastFire("Email Already Exist", "error");
    }else{
      $.ajax({
        url: '../api/request/EditProfile.php',
        type: 'POST',
        data:{
          UpdateUserStaff: 0,
          firstName: $("#user_firstname").val(),
          middleName: $("#user_middlename").val(),
          lastName: $("#user_lastname").val(),
          prefix: $("#user_prefix").val(),
          email: $("#user_email").val(),
          password: $("#user_password").val()
        },
        success: function(){
          ToastFire("Profile Updated", 'success');
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    }
  });
  function ValidateUserEmail(email){
    let x = "";
    $.ajax({
      url: "../api/validation/emailValidation.php",
      type: 'POST',
      dataType: 'JSON',
      async: false,
      data: {
        existingUser: email
      },
      success : function(data){
        x = data.IsExist;
      },
      error : function(xhs, error, code){
        console.log(xhs + " | " + error + " | " + code);
        console.log(email);
        swal.fire("Error Occured : Call Yoshi Imediately :) Sorry :)");
      }
    });
    return x;
  }
  function EmptyEditModal(){
    $("#user_firstname").val("");
    $("#user_middlename").val("");
    $("#user_lastname").val("");
    $("#user_prefix").val("");
    $("#user_email").val("");
    $("#user_password").val("");
  }
  $.ajax({
    url: '../api/accounts/verify.php?STAFF',
    method: 'GET',
    contentType: 'application/JSON',
    success: function(data){ 
      if(!data.IsExist){
        window.location.replace("../api/accounts");
      }
    }
  });
  function GetUserDetail(){
    $.ajax({
      url: '../api/request/GetUserDetail.php',
      method: 'GET',
      contentType: 'application/JSON',
      success: function(data){
        $("#userName").html(data.fullname);
        $("#userEmail").html(data.email);
        $("#userFirstName").html(data.firstname);
      },
      error: function(xhr, status, code){
        console.log(code);
      }
    });
  }
  if(currentPage.includes("index.html") || currentPage === ""){
    GetUserDetail();
    $.ajax({
      url: "../api/request/GetData.php",
      method: 'GET',
      contentType: 'application/JSON',
      success: function(data){
        let ctr = 0;
        for(let i = 0; 9> i;){
          ctr++;
          $parentDiv = `<div class="card-deck card-deck-sm mg-x-0 mb-5" id="row-${ctr}"></div>`;
          $("#article").append($parentDiv);
          for(let j = 0; j < 3 && i < 9;i++,j++){
            $child = data[i];
            let href = $child.Href.replace('\\', '');
            let type = $child.Type.replace('\\','');
            let image = $child.Image.replace('\\','');
            let header = $child.Heading.replace('\\','');
            let timestamp = $child.Timestamp.replace('\\', '');
            $el = `<div class="card shadow-base bd-0 mg-0 ">
                <figure class="card-item-img bg-mantle rounded-top">
                  <img class="img-fluid rounded-top" src="${image}" alt="Image">
                </figure>
                <div class="card-body pd-25">
                  <p class="tx-11 tx-uppercase tx-mont tx-semibold tx-info">${type + " | " + timestamp}</p>
                  <h5 class="tx-normal tx-roboto lh-3 mg-b-15"><a href="${href}" class="tx-inverse hover-info" target="_blank">${header}</a></h5>
                </div><!-- card-body -->
              </div><!-- card -->`;
            $('#row-' + ctr).prepend($el);
          }
        } 
      }
    });

  }
  else if(currentPage.includes("appointment-management.html")){
    GetUserDetail();
    ShowAppointment();
    function ShowAppointment(){
      $.ajax({
        url: '../api/request/GetAllAppointment.php?GetAppointment',
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          $("#appointmentView *").remove();
          data.forEach(child => {
            $div = `
            <tr>
              <td>${child.Fullname}</td>
              <td>${child.AppDate}</td>
              <td class="row gy-5 justify-content-around">
                <button class="col-5 btn btn-primary view-appointment" data-id="${child.AppointID}">View</button>
                <button class="col-5 btn btn-danger delete-appointment" data-id="${child.AppointID}">Delete</button>
              </td>
            </tr>
            `;
            $("#appointmentView").append($div);
          });
        }
      }).done(function(){
        $("#appointmentTable").dataTable({
          bLengthChange: false,
          searching: true,
          responsive: false,
          ordering: false,
          pageLength: 10,
          language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
          }
        });
      });
    }
    $("#appointmentView").delegate('.view-appointment', 'click', function(){
      EmptyModal();
      $.ajax({
        url: `../api/request/GetAllAppointment.php?GetSpecificAppointment=${$(this).attr("data-id")}`,
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          let salutation = data.Gender == "male" ? "Mr." : data.Gender == "female" ? "Ms." : "Mr./Ms.";
          let contact = data.PatientContact !== "" ? `Contact: ${data.PatientContact}` : "";
          let emContact = data.EmPatientContact !== "" ? `Emergency Contact: ${data.EmPatientContact}` : "";
          $("#patient_fullname").html(data.Fullname);
          $("#appointment_date").html(data.AppointDate);
          $("#patient_salutation").html(salutation);
          $("#reasonForVisit").html(data.Reason);
          $("#contact").html(contact);
          $("#emergencyContact").html(emContact);
          $("#btn_approve").attr("data-id", data.AppointID);
          $("#btn_decline").attr("data-id", data.AppointID);
          $("#modal_appointment").modal('toggle');
        }
      });
    });
    $("#appointmentView").delegate('.delete-appointment', 'click', function(){
      let ID = $(this).attr("data-id");
      Swal.fire({
        title: 'Decline Appointment?',
        showCancelButton: true,
        confirmButtonText: 'Move to archive?'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.value) {
          $.ajax({
            url: '../api/request/UpdateAppointment.php',
            type: 'POST',
            data:{
              update: ID
            },
            success: function(){
              $("#appointmentTable").dataTable().fnDestroy();
              ShowAppointment();
              Swal.fire('Moved to archive!', '', 'success');
            },
            error: function(xhr, status, code){
              console.log(code);
            }
          });
        } 
      });
    });
    $("#btn_approve").click(function(){
      $.ajax({
        url: '../api/request/UpdateAppointment.php',
        type: 'POST',
        data:{
          approved: $(this).attr("data-id")
        },
        success: function(){
          $("#appointmentTable").dataTable().fnDestroy();
          ShowAppointment();
          $("#modal_appointment").modal('toggle');
          Swal.fire('Appointment approved', '', 'success');
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    });
    $("#btn_decline").click(function(){
      $.ajax({
        url: '../api/request/UpdateAppointment.php',
        type: 'POST',
        data:{
          update: $(this).attr("data-id")
        },
        success: function(){
          $("#appointmentTable").dataTable().fnDestroy();
          ShowAppointment();
          $("#modal_appointment").modal('toggle');
          Swal.fire('Appointment moved to archive!', '', 'success');
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    });
    function EmptyModal(){
      $("#patient_fullname").html("");
      $("#appointment_date").html("");
      $("#patient_salutation").html("");
      $("#reasonForVisit").html("");
      $("#contact").html("");
      $("#emergencyContact").html("");
    }
  }
  else if(currentPage.includes("archived-appointment.html")){
    GetUserDetail();
    ShowAppointment();
    function ShowAppointment(){
      $.ajax({
        url: '../api/request/GetAllAppointment.php?ArchivedAppointments',
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          $("#archivedView *").remove();
          data.forEach(child => {
            let Undo = child.IsExpired ? `<button class="col-5 btn btn-success disabled">UNDO</button>` : `<button class="col-5 btn btn-success undo-appointment" data-id="${child.AppointID}">UNDO</button>`;
            $div = `
            <tr>
              <td>${child.Fullname}</td>
              <td></td>
              <td>${child.AppDate}</td>
              <td>${child.AppStatus}</td>
              <td class="row gy-5 justify-content-around">
                <button class="col-5 btn btn-primary view-appointment" data-id="${child.AppointID}">View</button>
                ${Undo}
              </td>
            </tr>
            `;
            $("#archivedView").append($div);
          });
        }
      }).done(function(){
        $("#archivedTable").dataTable({
          bLengthChange: false,
          searching: true,
          responsive: false,
          ordering: false,
          pageLength: 10,
          language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
          }
        });
      });
    }
    $("#archivedView").delegate('.view-appointment', 'click', function(){
      EmptyModal();
      $.ajax({
        url: `../api/request/GetAllAppointment.php?GetSpecificAppointment=${$(this).attr("data-id")}`,
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          let salutation = data.Gender == "male" ? "Mr." : data.Gender == "female" ? "Ms." : "Mr./Ms.";
          let contact = data.PatientContact !== "" ? `Contact: ${data.PatientContact}` : "";
          let emContact = data.EmPatientContact !== "" ? `Emergency Contact: ${data.EmPatientContact}` : "";
          $("#patient_fullname").html(data.Fullname);
          $("#appointment_date").html(data.AppointDate);
          $("#patient_salutation").html(salutation);
          $("#reasonForVisit").html(data.Reason);
          $("#contact").html(contact);
          $("#emergencyContact").html(emContact);
          $("#modal_appointment").modal('toggle');
        }
      });
    });
    $("#archivedView").delegate('.undo-appointment', 'click', function(){
      let ID = $(this).attr("data-id");
      Swal.fire({
        title: 'Undo Changes?',
        showCancelButton: true,
        confirmButtonText: 'Yes Plith?'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.value) {
          $.ajax({
            url: '../api/request/UpdateAppointment.php',
            type: 'POST',
            data:{
              undo: ID
            },
            success: function(){
              $("#archivedTable").dataTable().fnDestroy();
              ShowAppointment();
              Swal.fire('Moved to Pending!', '', 'success');
            },
            error: function(xhr, status, code){
              console.log(code);
            }
          });
        } 
      });
    });
    function EmptyModal(){
      $("#patient_fullname").html("");
      $("#appointment_date").html("");
      $("#patient_salutation").html("");
      $("#reasonForVisit").html("");
      $("#contact").html("");
      $("#emergencyContact").html("");
    }
  } // End archived
// END Script
});