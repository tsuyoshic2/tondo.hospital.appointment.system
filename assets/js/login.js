$(function(){
  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000
  });
  function ToastFire(message){
    Toast.fire({
      title: message,
      type: 'warning'
    });
  }
  $("#login_form").submit(function(x){
    x.preventDefault();
    $.ajax({
      url: 'api/validation/signin.php',
      type: 'POST',
      dataType: 'JSON',
      data: {
        email: $("#user_email").val(),
        pass: $("#user_password").val()
      },
      success: function(data){
        if(data.IsExist){
          ToastFire("Login Successful", "success");
          window.location.replace("api/accounts/");
        }else{
          if(data.IsDisabled){
            ToastFire("Account Disabled", "warning");
          }else{
            ToastFire("Login Failed", "error");
          }
        }
      },
      error: function(xhr, status, code){
        console.log()
      }
    })
  });


});