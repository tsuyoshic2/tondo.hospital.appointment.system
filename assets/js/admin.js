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
    url: '../api/accounts/verify.php?ADMIN',
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
    })
  }
  if(currentPage.includes("index.html") || currentPage === ""){
    GetUserDetail();
    GetData();
    function GetData(){
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

  }
  else if(currentPage.includes("staff.html")){
    ShowStaff();
    GetUserDetail();
    $("#addStaff").click(function(){
      EmptyField();
      $("#modalHeader").html("Add New Staff");
      $("#staff_modal").modal('toggle');
      $("#staff_form").attr("data-form", "AddNewStaff");
      
    });
    $("#showPassword").click(function(){
      $(this).toggleClass("fa-eye-slash fa-eye");
      if($(this).hasClass("fa-eye-slash")){
        $("#staff_password").attr("type", "password");
      }else{
        $("#staff_password").attr("type", "text");
      }
    });
    $("#staff_form").submit(function(x){
      x.preventDefault();
      switch($(this).attr("data-form")){
        case 'AddNewStaff':
          AddNewStaff();
          break;
        case 'EditStaff':
          EditStaff($(this).attr("data-id"));
          break;
      }
    });
    function ShowStaff(){
      $.ajax({
        url: "../api/request/GetStaff.php?GetStaff",
        method: "GET",
        contentType: "application/json",
        success: function(data){
          $("#staff_view *").remove();
          data.forEach(child => {
            let disable = `<button class="col-5 btn btn-danger disable-staff" data-id="${child.ID}">Set Disable</button>`;
            let enable = `<button class="col-5 btn btn-success enable-staff" data-id="${child.ID}">Set Enable</button>`
            let showButton = child.UserStatus == 1 ? disable : enable;
            $div = `
            <tr>
              <td>${child.Fullname}</td>
              <td>${child.UserRole}</td>
              <td class="row gy-5 justify-content-around">
                <button class="col-5 btn btn-primary edit-staff" data-id="${child.ID}">Edit</button>
                ${showButton}
              </td>
            </tr>`;
            $("#staff_view").append($div);
          });
        }
      }).done(function(){
        $("#staffTable").dataTable({
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
    $("#staff_view").delegate('.edit-staff','click',function(){
      EmptyField();
      let ID = $(this).attr("data-id");
      $.ajax({
        url: `../api/request/GetStaff.php?GetSpecificStaff=${$(this).attr("data-id")}`,
        method: 'GET',
        contentType: "application/json",
        success: function(data){
          $("#staff_form").attr("data-form","EditStaff");
          $("#staff_form").attr("data-id", ID);
          $("#modalHeader").html("Edit Staff");
          $("#staff_firstname").val(data.Firstname);
          $("#staff_middlename").val(data.Middlename);
          $("#staff_lastname").val(data.Lastname);
          $("#staff_prefix").val(data.Prefix);
          $("#staff_email").val(data.Email);
          $("#staff_password").val(data.UserPassword);
          $("#staff_modal").modal('toggle');
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    });
    $("#staff_view").delegate('.disable-staff', 'click', function(){
      $.ajax({
        url: '../api/request/EditStaff.php',
        type: 'POST',
        data: {
          disable: $(this).attr("data-id")
        },
        success: function(){
          ToastFire("Successfully Disabled Staff", "success");
        }
      });
      $(this).toggleClass("disable-staff enable-staff");
      $(this).toggleClass("btn-danger btn-success");
      $(this).html("Set Enable");
    });
    $("#staff_view").delegate('.enable-staff', 'click', function(){
      $.ajax({
        url: '../api/request/EditStaff.php',
        type: 'POST',
        data: {
          enable: $(this).attr("data-id")
        },
        success: function(){
          ToastFire("Successfully Enabled Staff", "success");
        }
      });
      $(this).toggleClass("enable-staff disable-staff");
      $(this).toggleClass("btn-success btn-danger");
      $(this).html("Set Disable");
    });
    function EditStaff(ID){
      $.ajax({
        url: '../api/request/EditStaff.php',
        type: 'POST',
        data: {
          ID: ID,
          firstName: $("#staff_firstname").val(),
          middleName: $("#staff_middlename").val(),
          lastName: $("#staff_lastname").val(),
          prefix: $("#staff_prefix").val(),
          email: $("#staff_email").val(),
          password: $("#staff_password").val()
        },
        success: function(){
          $("#staffTable").dataTable().fnDestroy();
          ShowStaff();
          $("#staff_modal").modal('toggle');
          EmptyField();
          ToastFire("Staff Successfully Edited", "success");
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    }
    function AddNewStaff(){
      if(ValidateEmail($("#staff_email").val())){
        ToastFire("Email Exists", "error");
      }else{
        $.ajax({
          url: '../api/request/AddNewStaff.php',
          type: 'POST',
          data: {
            firstName: $("#staff_firstname").val(),
            middleName: $("#staff_middlename").val(),
            lastName: $("#staff_lastname").val(),
            prefix: $("#staff_prefix").val(),
            email: $("#staff_email").val(),
            password: $("#staff_password").val()
          },
          success: function(){
            $("#staffTable").dataTable().fnDestroy();
            ShowStaff();
            $("#staff_modal").modal('toggle');
            EmptyField();
            ToastFire("Staff Successfully Added", "success");
          },
          error: function(xhr, status, code){
            console.log(code);
          }
        });
      }
    }
    function ValidateEmail(email){
      let x = "";
      $.ajax({
        url: "../api/validation/emailValidation.php",
        type: 'POST',
        dataType: 'JSON',
        async: false,
        data: {
          user_email: email
        },
        success : function(data){
          x = data.IsExist;
        },
        error : function(xhs, error, code){
          console.log(xhs + " | " + error + " | " + code);
          swal.fire("Error Occured : Call Yoshi Imediately :) Sorry :)");
        }
      });
      return x;
    }
    function EmptyField(){
      $("#staff_firstname").val("");
      $("#staff_middlename").val("");
      $("#staff_lastname").val("");
      $("#staff_prefix").val("");
      $("#staff_email").val("");
      $("#staff_password").val("");
    }
  }
  // Doctor Function
  else if(currentPage.includes("doctor.html")){
    ShowStaff();
    GetUserDetail();
    $("#addDoctor").click(function(){
      EmptyField();
      $("#modalHeader").html("Add New Doctor");
      $("#staff_modal").modal('toggle');
      $("#staff_form").attr("data-form", "AddNewStaff");
      
    });
    $("#showPassword").click(function(){
      $(this).toggleClass("fa-eye-slash fa-eye");
      if($(this).hasClass("fa-eye-slash")){
        $("#staff_password").attr("type", "password");
      }else{
        $("#staff_password").attr("type", "text");
      }
    });
    $("#staff_form").submit(function(x){
      x.preventDefault();
      switch($(this).attr("data-form")){
        case 'AddNewStaff':
          AddNewStaff();
          break;
        case 'EditStaff':
          EditStaff($(this).attr("data-id"));
          break;
      }
    });
    function ShowStaff(){
      $.ajax({
        url: "../api/request/GetDoctor.php?GetStaff",
        method: "GET",
        contentType: "application/json",
        success: function(data){
          $("#doctor_view *").remove();
          data.forEach(child => {
            let disable = `<button class="col-5 btn btn-danger disable-staff" data-id="${child.ID}">Set Disable</button>`;
            let enable = `<button class="col-5 btn btn-success enable-staff" data-id="${child.ID}">Set Enable</button>`
            let showButton = child.UserStatus == 1 ? disable : enable;
            $div = `
            <tr>
              <td>${child.Fullname}</td>
              <td>${child.UserRole}</td>
              <td class="row gy-5 justify-content-around">
                <button class="col-5 btn btn-primary edit-staff" data-id="${child.ID}">Edit</button>
                ${showButton}
              </td>
            </tr>`;
            $("#doctor_view").append($div);
          });
        }
      }).done(function(){
        $("#staffTable").dataTable({
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
    $("#doctor_view").delegate('.edit-staff','click',function(){
      EmptyField();
      let ID = $(this).attr("data-id");
      $.ajax({
        url: `../api/request/GetDoctor.php?GetSpecificStaff=${$(this).attr("data-id")}`,
        method: 'GET',
        contentType: "application/json",
        success: function(data){
          $("#staff_form").attr("data-form","EditStaff");
          $("#staff_form").attr("data-id", ID);
          $("#modalHeader").html("Edit Staff");
          $("#staff_firstname").val(data.Firstname);
          $("#staff_middlename").val(data.Middlename);
          $("#staff_lastname").val(data.Lastname);
          $("#staff_prefix").val(data.Prefix);
          $("#staff_email").val(data.Email);
          $("#staff_password").val(data.UserPassword);
          $("#staff_modal").modal('toggle');
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    });
    $("#doctor_view").delegate('.disable-staff', 'click', function(){
      $.ajax({
        url: '../api/request/EditStaff.php',
        type: 'POST',
        data: {
          disable: $(this).attr("data-id")
        },
        success: function(){
          ToastFire("Successfully Disabled Staff", "success");
        }
      });
      $(this).toggleClass("disable-staff enable-staff");
      $(this).toggleClass("btn-danger btn-success");
      $(this).html("Set Enable");
    });
    $("#doctor_view").delegate('.enable-staff', 'click', function(){
      $.ajax({
        url: '../api/request/EditStaff.php',
        type: 'POST',
        data: {
          enable: $(this).attr("data-id")
        },
        success: function(){
          ToastFire("Successfully Enabled Staff", "success");
        }
      });
      $(this).toggleClass("enable-staff disable-staff");
      $(this).toggleClass("btn-success btn-danger");
      $(this).html("Set Disable");
    });
    function EditStaff(ID){
      $.ajax({
        url: '../api/request/EditStaff.php',
        type: 'POST',
        data: {
          ID: ID,
          firstName: $("#staff_firstname").val(),
          middleName: $("#staff_middlename").val(),
          lastName: $("#staff_lastname").val(),
          prefix: $("#staff_prefix").val(),
          email: $("#staff_email").val(),
          password: $("#staff_password").val()
        },
        success: function(){
          $("#staffTable").dataTable().fnDestroy();
          ShowStaff();
          $("#staff_modal").modal('toggle');
          EmptyField();
          ToastFire("Staff Successfully Edited", "success");
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    }
    function AddNewStaff(){
      if(ValidateEmail($("#staff_email").val())){
        ToastFire("Email Exists", "error");
      }else{
        $.ajax({
          url: '../api/request/AddNewDoctor.php',
          type: 'POST',
          data: {
            firstName: $("#staff_firstname").val(),
            middleName: $("#staff_middlename").val(),
            lastName: $("#staff_lastname").val(),
            prefix: $("#staff_prefix").val(),
            email: $("#staff_email").val(),
            password: $("#staff_password").val()
          },
          success: function(){
            $("#staffTable").dataTable().fnDestroy();
            ShowStaff();
            $("#staff_modal").modal('toggle');
            EmptyField();
            ToastFire("Staff Successfully Added", "success");
          },
          error: function(xhr, status, code){
            console.log(code);
          }
        });
      }
    }
    function ValidateEmail(email){
      let x = "";
      $.ajax({
        url: "../api/validation/emailValidation.php",
        type: 'POST',
        dataType: 'JSON',
        async: false,
        data: {
          user_email: email
        },
        success : function(data){
          x = data.IsExist;
        },
        error : function(xhs, error, code){
          console.log(xhs + " | " + error + " | " + code);
          swal.fire("Error Occured : Call Yoshi Imediately :) Sorry :)");
        }
      });
      return x;
    }
    function EmptyField(){
      $("#staff_firstname").val("");
      $("#staff_middlename").val("");
      $("#staff_lastname").val("");
      $("#staff_prefix").val("");
      $("#staff_email").val("");
      $("#staff_password").val("");
    }
  }
  else if(currentPage.includes("available-appointments.html")){
    GetUserDetail();
    ShowAppointment();
    function ShowAppointment(){
      $.ajax({
        url: '../api/request/GetAllAppointment.php?GetDoctorAvailableAppointment',
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          $("#availableView *").remove();
          data.forEach(child => {
            $div = `
            <tr>
              <td>${child.Fullname}</td>
              <td>${child.AppDate}</td>
              <td class="row gy-5 justify-content-around">
                <button class="col-5 btn btn-primary view-appointment" data-id="${child.AppointID}">View</button>
              </td>
            </tr>
            `;
            $("#availableView").append($div);
          });
        }
      }).done(function(){
        $("#availableTable").dataTable({
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
      $("#availableView").delegate('.view-appointment', 'click', function(){
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
            $("#modal_appointment").modal('toggle');
          }
        });
      });
      $("#btn_approve").click(function(){
        let ID = $(this).attr("data-id");
        $("#modal_appointment").modal('toggle');
        Swal.fire({
          title: 'Approve Appoinment ?',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.value) {
            $.ajax({
              url: '../api/request/UpdateAppointment.php',
              type: 'POST',
              data:{
                appointmentSet: ID
              },
              success: function(){
                $("#availableTable").dataTable().fnDestroy();
                ShowAppointment();
                Swal.fire('Appointment Set', '', 'success');
              },
              error: function(xhr, status, code){
                console.log(code);
              }
            });
          }
          else{
            $("#modal_appointment").modal('toggle');
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
  }
  else if(currentPage.includes("my-appointments.html")){
    GetUserDetail();
    ShowAppointment();
    function ShowAppointment(){
      $.ajax({
        url: '../api/request/GetAllAppointment.php?MyAppointment',
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          $("#myAppointmentView *").remove();
          data.forEach(child => {
            $div = `
            <tr>
              <td>${child.Fullname}</td>
              <td>${child.AppDate}</td>
              <td class="row gy-5 justify-content-around">
                <button class="col-5 btn btn-primary view-appointment" data-id="${child.AppointID}">View</button>
              </td>
            </tr>
            `;
            $("#myAppointmentView").append($div);
          });
        }
      }).done(function(){
        $("#myAppointmentTable").dataTable({
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
    $("#myAppointmentView").delegate('.view-appointment', 'click', function(){
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
          $("#btn_consulted").attr("data-id", data.AppointID);
          $("#modal_appointment").modal('toggle');
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
    $("#btn_consulted").click(function(){
      $.ajax({
        url: '../api/request/Consultation.php',
        type: 'POST',
        data: {
          startConsultation: $(this).attr('data-id')
        },
        success: function(){
          window.location.replace("consultation.html");
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    });
  }
  else if(currentPage.includes("consultation.html")){
    GetUserDetail();
    // TODO: PATIENT DETAILS
    $(window).bind('beforeunload', function(e){
      return 'Are you sure you want to leave?';
    });
    $("#consultationNotes").summernote({
      height: 300,
      tooltip: false,
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']]
      ]
    });
    $("#diagnosisForm").submit(function(x){
      x.preventDefault();
      Swal.fire({
        title: 'Finished Diagnosis ?',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.value) {
          FinishConsultation();
        }
        
      });
    });

    function FinishConsultation(){
      let data = new FormData();
      data.append("Notes", $("#consultationNotes").summernote('code'));
      data.append("CompleteConsultation", "Yes");
      let total = document.getElementById('uploadRecord').files.length;
      for(let z = 0; z < total; z++){
        console.log(z);
        data.append("files[]", document.getElementById('uploadRecord').files[z]);
      }
      $.ajax({
        url:'../api/request/Consultation.php',
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        success: function(){
          $(window).unbind('beforeunload');
          window.location.replace("my-appointments.html");
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
    }
  }
  else if(currentPage.includes("appointment-history.html")){
    GetUserDetail();
    ShowAppointment();
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
    function ShowAppointment(){
      $.ajax({
        url: '../api/request/GetAllAppointment.php?AppointmentHistory',
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          $("#myAppointmentView *").remove();
          data.forEach(child => {
            $div = `
            <tr>
              <td>${child.Fullname}</td>
              <td>${child.AppDate}</td>
              <td>${child.ConsultationTime}</td>
              <td>${child.AppStatus}</td>
              <td class="row gy-5 justify-content-around">
                <button class="col-5 btn btn-primary view-appointment" data-id="${child.AppointID}">View</button>
                <button class="col-5 btn btn-primary set-new-appointment" data-id="${child.AppointID}">Set Appointment</button>
              </td>
            </tr>
            `;
            $("#myAppointmentView").append($div);
          });
        }
      }).done(function(){
        $("#myAppointmentTable").dataTable({
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
    $("#myAppointmentView").delegate('.set-new-appointment', 'click', function(){
      EmptyModalAppointment();
      $.ajax({
        url: `../api/request/GetAllAppointment.php?GetSpecificAppointmentRecord=${$(this).attr("data-id")}`,
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          let salutation = data.Gender == "male" ? "Mr." : data.Gender == "female" ? "Ms." : "Mr./Ms.";
          $("#patient_fullname_2").html(data.Fullname);
          $("#patient_salutation_2").html(salutation);
          $("#btn_new_appointment").attr("data-id", data.PatientID);
          $("#modal_new_appointment").modal('toggle');
        }
      });
    });
    $("#myAppointmentView").delegate('.view-appointment', 'click', function(){
      EmptyModal();
      $.ajax({
        url: `../api/request/GetAllAppointment.php?GetSpecificAppointmentRecord=${$(this).attr("data-id")}`,
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
          $("#record_notes").html(data.Notes);
          let xdata = data.FilePath.slice(1,-1).split(",");
          xdata.forEach(child => {
            $div = `<div class="mb-3">Filename: ${child} 
                      <a href="../uploads/documents/${child.slice(1,-1).trim()}" target="_blank" class="btn btn-success btn-sm btn-download">
                        View
                      </a>`;
            $("#file").append($div);
          });
          $("#emergencyContact").html(emContact);
          $("#btn_consulted").attr("data-id", data.AppointID);
          $("#btn_consulted").attr("data-patient", data.PatientID);
          $("#modal_appointment").modal('toggle');
        }
      });
    });
    $("#btn_new_appointment").click(function(){
      if(HasAppointment($(this).attr("data-id"))){
        ToastFire("This Patient has Already had an Appointment", 'warning');
      }
      else if(ValidateAppointment()){
        $.ajax({
          url: "../api/appointment.php",
          type: "POST",
          data: {
            newAppointment: $(this).attr("data-id"),
            reason: $("#reason_for_visit").val(),
            date: $("#appointment").val()
          },
          success: function(){
            $("#modal_new_appointment").modal("toggle");
            ToastFire("Success fully created new Appointment", "success");
          }
        })
      }
    });
    function EmptyModal(){
      $("#patient_fullname").html("");
      $("#appointment_date").html("");
      $("#patient_salutation").html("");
      $("#reasonForVisit").html("");
      $("#contact").html("");
      $("#emergencyContact").html("");
      $("#record_notes").html("");
      $("#file").html("")
    }
    function ValidateAppointment(){
      if($("#appointment").val()){
        return true;
      }else{
        ToastFire("Date and Time of the appointment is Required","error");
        return false;
      }
    }
    function HasAppointment(ID){
      let x = "";
      $.ajax({
        url: "../api/validation/appointmentValidation.php",
        type: "POST",
        dataType: "JSON",
        async: false,
        data:{
          patientID: ID
        },
        success: function(data){
          x = data.IsExist;
          console.log(x);
        },
        error: function(xhr, status, code){
          console.log(code);
        }
      });
      return x;
    }

    function EmptyModalAppointment(){
      $("#reason_for_visit").val("");
      $("#appointment").val("");
    }
  }
});