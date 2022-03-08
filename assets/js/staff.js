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