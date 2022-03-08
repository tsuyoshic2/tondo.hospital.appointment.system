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