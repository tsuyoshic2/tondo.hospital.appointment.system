<?php
  include_once('../connection.php');

  if(isset($_POST['user_email'])){
    $email = $_POST['user_email'];
    $isExist = mysqli_num_rows(mysqli_query($con, "SELECT * FROM user_table WHERE user_email = '$email'"));
    if($isExist > 0){
      echo json_encode(array("IsExist" => True));
    }else{
      echo json_encode(array("IsExist" => False));
    }
  }else{
    echo json_encode(array("IsExist" => False));
  }
?>