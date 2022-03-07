<?php 
  session_start();
  include_once("../connection.php");

  if(isset($_POST['patientID'])){
    $patientID = $_POST['patientID'];
    $isExist = mysqli_num_rows(mysqli_query($con, "SELECT * FROM appointment_table WHERE patient_id = '$patientID' AND appointment_status = 'APPOINTMENTSET'"));
    if($isExist > 0){
      echo json_encode(array("IsExist" => True));
    }
    else{
      echo json_encode(array("IsExist" => False));
    }
  }