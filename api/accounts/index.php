<?php
  session_start();
  include_once("../connection.php");
  $ID = "";
  if(isset($_SESSION['ID'])){
    $ID = $_SESSION['ID'];
  }

  $fetchedData = mysqli_fetch_assoc(mysqli_query($con, "SELECT * FROM user_table WHERE user_id = '$ID'"));
  switch($fetchedData['user_access']){
    case 'PATIENT':
      header("location: ../../patient/");
      break;
    case 'ADMIN':
      header("location: ../../admin/");
      break;
    case 'STAFF':
      header("location: ../../reception/");
      break;
    case 'DOCTOR':
      header("location: ../../doctor/");
      break;
    default:
      header("location: ../../");
      break;
  }
?>