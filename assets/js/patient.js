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
                  <label class="form-control-label">Contact #: <span class="tx-danger">*</span></label>
                  <input class="form-control" type="number" id="user_contact" placeholder="Enter contact number" required>
                </div>
              </div><!-- col-4 -->
              <div class="col-lg-6">
                <div class="form-group">
                  <label class="form-control-label">Secondary Contact #: <span class="tx-danger">*</span></label>
                  <input class="form-control" type="number" id="user_em_contact" placeholder="Enter secondary contact" required>
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
        $("#user_contact").val(data.PrimaryContact);
        $("#user_em_contact").val(data.SecondaryContact);
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
          UpdatePatient: 0,
          firstName: $("#user_firstname").val(),
          middleName: $("#user_middlename").val(),
          lastName: $("#user_lastname").val(),
          prefix: $("#user_prefix").val(),
          email: $("#user_email").val(),
          password: $("#user_password").val(),
          contact: $("#user_contact").val(),
          emContact: $("#user_em_contact").val()
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
    $("#user_contact").val("");
    $("#user_em_contact").val("");
  }
  $.ajax({
    url: '../api/accounts/verify.php?PATIENT',
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
  function GetNotification(){
    $.ajax({
      url: "../api/request/Notification.php?checkNotification",
      method: 'GET',
      contentType: "application/JSON",
      success: function(data){
        let $element = $("#notification_set");
        if(data.hasNotification && $element.hasClass("d-none")){
          $element.removeClass("d-none");
        }
        else if(!$element.hasClass("d-none") && !data.hasNotification){
          $element.addClass("d-none")
        }
      }
    });
  }
  $("#notification_area").click(function(){
    GetNotification();
    $.ajax({
      url: "../api/request/Notification.php?GetNotification",
      method: 'GET',
      contentType: 'application/JSON',
      success: function(data){
        $el = $("#notification_list");
        $("#notification_list *").remove();
        data.forEach(child => {
          let status = child.NotificationStatus == 'NEW' ? "read" : "";
          $div = `<a href="" class="media-list-link ${status}">
              <div class="media">
                <div class="media-body">
                  <p class="noti-text"><strong>${child.Title}</strong></p>
                  <span>${child.TimeReceived}</span>
                </div>
              </div>
            </a>`; 
          $el.append($div);
        });
      }
    });
  });
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
  else if(currentPage.includes("appointment.html")){
    GetUserDetail();
    GetCurrentAppointment();
    GetAppointmentHistory();
    $.fn.datetimepicker.Constructor.Default = $.extend({},
    $.fn.datetimepicker.Constructor.Default,
      { icons:
              { time: 'fas fa-clock',
                  date: 'fas fa-calendar',
                  up: 'fas fa-arrow-up',
                  down: 'fas fa-arrow-down',
                  previous: 'fas fa-arrow-circle-left',
                  next: 'fas fa-arrow-circle-right',
                  today: 'far fa-calendar-check-o',
                  clear: 'fas fa-trash',
                  close: 'far fa-times' } });
    $("#appointment_timestamp").datetimepicker({
      fontAwesome: 'font-awesome'
    });
    function GetCurrentAppointment(){
      $("#appointment_status *").remove();
      $.ajax({
        url: '../api/request/GetAllAppointment.php?GetCurrentAppointment',
        method: 'GET',
        contentType: 'application/JSON',
        success: function(data){
          $("#appointment_status *").remove();
          if(data){
            let status = "";
            let second = "";
            switch(data.AppointmentStatus){
              case 'APPOINTMENTSET':
                status = " set ";
                second = " with " + ReadyDoctor(data.DocID);
                break;
              case 'PENDING':
                status = " on ";
                second = " pending ";
                break;
              case 'APPROVED':
                status = " already ";
                second = " approved ";
            }
            $div = `<h4>Your Current Appointment is ${status + second}on ${data.AppointDate} </h4>`;
          }else{
            $div = `<h4>You Have no Appointment</h4>
                    <div class="row justify-content-center">
                      <div class="col-6">
                        <button class="btn btn-success btn-lg btn-block new-appointment">New Appointment</button>
                      </div>
                      </div>`;
          }
          $("#appointment_status").append($div);
        }
      })
    }
    function GetAppointmentHistory(){
      $.ajax({
        url: "../api/request/GetAllAppointment.php?GetAppointmentHistory",
        method: "GET",
        contentType: "application/JSON",
        success: function(data){
          $("#appointmentView *").remove();
          data.forEach(child => {
            let button = child.RecordID > 0 ? `<button class="col-5 btn btn-primary btn-sm view-record" data-id="${child.RecordID}">View</button>` : "";
            $div = `<tr>
              <td>${child.DoctorFullname}</td>
              <td>${child.AppointDate}</td>
              <td>${child.ConsultDate}</td>
              <td>${child.AppointStatus}</td>
              <td>
                ${button}
              </td>
            </tr>`;
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
    $("#btn_new_appointment").click(function(){
      $.ajax({
        url: "../api/appointment.php",
        type: "POST",
        data: {
          setNewPatientAppointment: $("#reason_for_visit").val(),
          date: $("#appointment").val()
        },
        success: function(){
          GetCurrentAppointment();
          $("#modal_new_appointment").modal("toggle");
          ToastFire("Success fully created new Appointment", "success");
        }
      });
    });
    $("#appointment_status").delegate(".new-appointment", "click", function(){
      EmptyAppointment();
      $("#modal_new_appointment").modal("toggle");
    });
    $("#appointmentView").delegate(".view-record", "click", function(){
      EmptyModal();
      let ID = $(this).attr("data-id");
      $.ajax({
        url: `../api/request/GetAllAppointment.php?GetRecord=${ID}`,
        method: "GET",
        contentType: "application/JSON",
        success: function(data){
          let xdata = data.RecordURL.slice(1,-1).split(",");
          $("#appointmentDate").html(data.AppointmentDate);
          $("#consultDate").html(data.ConsultDate);
          $("#doctorName").html(data.Fullname);
          $("#recordNotes").html(data.RecordNote);
          xdata.forEach(child => {
            $div = `<div class="mb-3">Filename: ${child} 
                      <a href="../uploads/documents/${child.slice(1,-1).trim()}" target="_blank" class="btn btn-success btn-sm btn-download">
                        View
                      </a>`;
            $("#file").append($div);
          });
          $("#modal_record").modal("toggle");
        }
      });
    });
    function ReadyDoctor(ID){
      let doctor = "";
      $.ajax({
        url: `../api/request/GetStaff.php?GetDoctor=${ID}`,
        method: 'GET',
        contentType: 'application/JSON',
        async: false,
        success: function(data){
          doctor = data.Fullname;
        }
      });
      return doctor;
    }
    function EmptyModal(){
      $("#appointmentDate").html("");
      $("#consultDate").html("");
      $("#doctorName").html("");
      $("#recordNotes").html("");
      $("#file *").remove();
    }
    function EmptyAppointment(){
      $("#appointment_timestamp").val("");
      $("#reason_for_visit").val("");
    }
  }
  
  setInterval(GetNotification,5000);
});