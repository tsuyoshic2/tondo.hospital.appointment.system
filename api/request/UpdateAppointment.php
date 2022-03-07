<?php
  session_start();
  include_once("../connection.php");

  if(isset($_POST['update'])){
    $ID = $_POST['update'];
    mysqli_query($con, "UPDATE appointment_table SET appointment_status = 'DECLINED' WHERE appointment_id = '$ID'");
    mysqli_query($con, "INSERT INTO notification_table (notif_title, notif_body, appointment_id, notif_status) 
      VALUES ('Your Appointment is Declined', '', '$ID', 'NEW')");
  }

  if(isset($_POST['approved'])){
    $ID = $_POST['approved'];
    mysqli_query($con, "UPDATE appointment_table SET appointment_status = 'APPROVED' WHERE appointment_id = '$ID'");
    mysqli_query($con, "INSERT INTO notification_table (notif_title, notif_body, appointment_id, notif_status) 
      VALUES ('Your Appointment is Approved', '', '$ID', 'NEW')");
  }

  if(isset($_POST['undo'])){
    $ID = $_POST['undo'];
    mysqli_query($con, "UPDATE appointment_table SET appointment_status = 'PENDING' WHERE appointment_id = '$ID'");
    mysqli_query($con, "INSERT INTO notification_table (notif_title, notif_body, appointment_id, notif_status) 
      VALUES ('Your Appointment is Returned to pending', '', '$ID', 'NEW')");
  }
  if(isset($_POST['appointmentSet'])){
    $ID = $_POST['appointmentSet'];
    $DocID = $_SESSION['ID'];
    mysqli_query($con, "UPDATE appointment_table SET appointment_status = 'APPOINTMENTSET', appointment_recommendation = '$DocID' WHERE appointment_id = '$ID'");
    mysqli_query($con, "INSERT INTO notification_table (notif_title, notif_body, appointment_id, notif_status) 
      VALUES ('Your Appointment is set on your given date', '', '$ID', 'NEW')");
  }
?>