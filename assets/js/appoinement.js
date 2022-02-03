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
$(document).ready(function(){
  $("#appointment_timestamp").datetimepicker({
    fontAwesome: 'font-awesome'
  });
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000
  });
  $(".next").click(function(){
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    console.log(current_fs.attr("data-fieldset"));
    if(ValidateField(current_fs.attr("data-fieldset"))){
        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
        
        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
          step: function(now) {
            // for making fielset appear animation
            opacity = 1 - now;
            
            current_fs.css({
              'display': 'none',
              'position': 'relative'
            });
            next_fs.css({'opacity': opacity});
          },
          duration: 600
        });
        window.scrollTo(0, 0);
    }
  });
  function ValidateField(fieldset){
    switch(parseInt(fieldset)){
      case 0:
        return ValidateAccounts();
      case 1:
        return ValidatePersonalInfo();
      case 2:
        return ValidateAppointment();
      default:
        console.log("Look For Yoshi Real Quick ")
        break;
    }
  }

  function ValidateAccounts(){
    let email= $("#user_email").val();
    let password = $("#user_password").val();
    let confirmPassword = $("#confirm_password").val();
    if(!email){
      ToastFire("Email is Required");
    }
    else if(!password){
      ToastFire("Passoword is Required");
    }
    else if(!confirmPassword){
      ToastFire("Confirm Password Is Required");
    }
    else if(password != confirmPassword){
      ToastFire("Password Doesn't Match");
    }
    else{
      return true;
    }
  }
  function ValidateAppointment(){
    let appointment = $('#appointment').val();
    if(appointment){
      return true;
    }else{
      ToastFire("Date and time of the appointment is required")
    }
  }
  function ValidatePersonalInfo(){
    let firstName = $("#first_name").val();
    let middleName = $("#middle_name").val();
    let lastName = $("#last_name").val();
    let prefix = $("#prefix_name").val();
    let userAge = $("#user_age").val();
    let gender = $("#gender").val();
    let contact = $("#phone_number").val();
    let emContact = $("#emergency_contact").val();
    if(!firstName){
      ToastFire("First name is required");
    }
    else if(!lastName){
      ToastFire("Last name is required");
    }
    else if(!userAge){
      ToastFire("Age is required");
    }
    else if(!gender){
      ToastFire("Please select a gender");
    }
    else if(!contact){
      ToastFire("Please input a contact number");
    }
    else if(!emContact){
      ToastFire("Please input an emergency contact number of another person");
    }
    else{
      return true;
    }
  }

  function ToastFire(message){
    Toast.fire({
      title: message,
      type: 'warning'
    });
  }
  $(".previous").click(function(){
    
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    
    //Remove class active
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    
    //show the previous fieldset
    previous_fs.show();
    
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
      step: function(now) {
      // for making fielset appear animation
      opacity = 1 - now;
      
      current_fs.css({
        'display': 'none',
        'position': 'relative'
      });
      previous_fs.css({'opacity': opacity});
      },
      duration: 600
    });
  });
    
  $('.radio-group .radio').click(function(){
    $(this).parent().find('.radio').removeClass('selected');
    $(this).addClass('selected');
  });
  
  $(".submit").click(function(){
    return false;
  })
  $('.select2').select2();
});