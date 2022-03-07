<?php
  session_start();
  include_once("../connection.php");
  header('Content-Type: application/json; charset=utf-8');
  if(isset($_SESSION['ID'])){
    $sendArray = array();
    $ID = $_SESSION['ID'];
    $fetchedData = mysqli_fetch_assoc(mysqli_query($con, "SELECT * FROM user_table WHERE user_id = '$ID'"));
    switch($fetchedData['user_access']){
      case 'PATIENT':
        echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT user_table.user_id AS PatientId ,user_table.user_email AS email, CONCAT(patient_table.patient_first_name,' ',LEFT(patient_table.patient_middle_name, 1),' ',patient_table.patient_last_name,' ',patient_table.patient_prefix) AS fullname, patient_table.patient_first_name AS firstname FROM user_table INNER JOIN patient_table ON user_table.user_id = patient_table.patient_id WHERE user_id = '$ID'")));
        break;
      case 'STAFF':
        echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT user_table.user_email AS email, CONCAT(staff_table.staff_firstname, ' ', LEFT(staff_table.staff_middlename, 1), ' ', staff_table.staff_lastname, ' ',staff_table.staff_prefix) AS fullname, staff_table.staff_firstname AS firstname FROM user_table INNER JOIN staff_table ON user_table.user_id = staff_table.staff_id WHERE user_id = '$ID'")));
        break;
      case 'DOCTOR':
        echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT user_table.user_email AS email, CONCAT(staff_table.staff_firstname, ' ', LEFT(staff_table.staff_middlename, 1), ' ', staff_table.staff_lastname) AS fullname, staff_table.staff_firstname AS firstname FROM user_table INNER JOIN staff_table ON user_table.user_id = staff_table.staff_id WHERE user_id = '$ID'")));
        break;
      case 'ADMIN':
        echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT user_table.user_email AS email, CONCAT(staff_table.staff_firstname, ' ', LEFT(staff_table.staff_middlename, 1), '. ', staff_table.staff_lastname) AS fullname, staff_table.staff_firstname AS firstname FROM user_table INNER JOIN staff_table ON user_table.user_id = staff_table.staff_id WHERE user_id = '$ID'")));
        break;
    }
  }
?>