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
  }else if(currentPage.includes("consultation.html")){
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