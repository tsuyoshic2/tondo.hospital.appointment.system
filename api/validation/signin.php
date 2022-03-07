<?php
  session_start();
  include_once("../connection.php");
  if(isset($_POST['email'])){
    $email = $_POST['email'];
    $pass = $_POST['pass'];
    $fetchedData = mysqli_query($con,"SELECT * FROM user_table WHERE user_email = '$email' AND user_password = '$pass'");
    $check = mysqli_num_rows($fetchedData);
    $data = mysqli_fetch_assoc($fetchedData);
    if($check > 0){
      if($data['user_status'] == 1){
        $_SESSION['ID'] = $data['user_id'];
        echo json_encode(array("IsExist" => True, "IsDisabled" => False));
      }
      else{
        echo json_encode(array("IsExist" => False, "IsDisabled" => True));
      }
    }
    else{
      echo json_encode(array("IsExist" => False, "IsDisabled" => False));
    }
  }
?>