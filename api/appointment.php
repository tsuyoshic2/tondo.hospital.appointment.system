<?php
  include_once('connection.php');

  //Account Details
  $email = trim($_POST['user_email']) != "" ? $_POST['user_email'] : "";
  $password = trim($_POST['user_password']) != "" ? $_POST['user_password'] : "";
  // Personal Details
  $firstName = trim($_POST['user_first_name']) != "" ? $_POST['user_first_name'] : "";
  $middleName = trim($_POST['user_middle_name']) != "" ? $_POST['user_middle_name'] : "";
  $lastName = trim($_POST['user_last_name']) != "" ? $_POST['user_last_name'] : "";
  $prefix = trim($_POST['user_prefix']) != "" ? $_POST['user_prefix'] : "";
  $age = trim($_POST['user_age']) != "" ? $_POST['user_age'] : "";
  $gender = trim($_POST['user_gender']) != "" ? $_POST['user_gender'] : "";
  $contact = trim($_POST['user_contact']) != "" ? $_POST['user_contact'] : "";
  $emContact = trim($_POST['user_emergency_contact']) != "" ? $_POST['user_emergency_contact'] : "";
  // Appointment Details
  $reasonForVisit = trim($_POST['reason_for_visit']) != "" ? $_POST['reason_for_visit'] : "";
  $date = date("Y-m-d H:i:s", strtotime($_POST['user_appointment']));

  mysqli_query($con, "INSERT INTO user_table (user_email, user_password, user_access) 
                      VALUES ('$email', '$password', 'PATIENT')");
  $currentId = mysqli_insert_id($con);

  mysqli_query($con,"INSERT INTO patient_table (patient_id, patient_first_name, patient_middle_name, patient_last_name, patient_prefix, patient_age, patient_gender) 
                      VALUES ('$currentId', '$firstName', '$middleName', '$lastName', '$prefix', '$age', '$gender')");
  
  mysqli_query($con, "INSERT INTO appointment_table (reason_for_visit, patient_id, appointment_recommendation, appointment_date, appointment_status) 
                      VALUES ('$reasonForVisit', '$currentId', '', '$date', 'PENDING')")
?>