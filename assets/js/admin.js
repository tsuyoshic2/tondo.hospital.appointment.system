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
    })
  }
  if(currentPage.includes("index.html") || currentPage === ""){
    GetUserDetail();
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
});