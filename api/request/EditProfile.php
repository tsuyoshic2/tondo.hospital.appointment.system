<?php

  session_start();
  include_once("../connection.php");
  if(isset($_GET['GetUserInfo'])){
    header('Content-Type: application/json; charset=utf-8');
    $ID = $_SESSION['ID'];
    $fetchedData = mysqli_fetch_assoc(mysqli_query($con, "SELECT * FROM user_table WHERE user_id = '$ID'"));
    switch($fetchedData['user_access']){
      case 'PATIENT':
        echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT user_table.user_email AS Email, user_table.user_password AS UserPassword, patient_table.patient_first_name AS FirstName, patient_table.patient_middle_name AS MiddleName, patient_table.patient_last_name AS LastName, patient_table.patient_prefix AS Prefix, patient_table.patient_contact AS PrimaryContact, patient_table.patient_em_contact AS SecondaryContact FROM user_table INNER JOIN patient_table ON user_table.user_id = patient_table.patient_id WHERE user_id = '$ID'")));
        break;
      case 'STAFF':
        echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT user_table.user_email AS Email, user_table.user_password AS UserPassword, staff_table.staff_firstname AS FirstName, staff_table.staff_middlename AS MiddleName, staff_table.staff_lastname AS LastName, staff_table.staff_prefix AS Prefix FROM user_table INNER JOIN staff_table ON user_table.user_id = staff_table.staff_id WHERE user_id = '$ID'")));
        break;
      case 'DOCTOR':
        echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT user_table.user_email AS Email, user_table.user_password AS UserPassword, staff_table.staff_firstname AS FirstName, staff_table.staff_middlename AS MiddleName, staff_table.staff_lastname AS LastName, staff_table.staff_prefix AS Prefix FROM user_table INNER JOIN staff_table ON user_table.user_id = staff_table.staff_id WHERE user_id = '$ID'")));
        break;
      case 'ADMIN':
        echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT user_table.user_email AS Email, user_table.user_password AS UserPassword, staff_table.staff_firstname AS FirstName, staff_table.staff_middlename AS MiddleName, staff_table.staff_lastname AS LastName, staff_table.staff_prefix AS Prefix FROM user_table INNER JOIN staff_table ON user_table.user_id = staff_table.staff_id WHERE user_id = '$ID'")));
        break;
    }
  }
  if(isset($_POST['UpdateUserStaff'])){
    $ID = $_SESSION['ID'];
    $firstName = $_POST['firstName'];
    $middleName = $_POST['middleName'];
    $lastName = $_POST['lastName'];
    $prefix = $_POST['prefix'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    mysqli_query($con, "UPDATE staff_table SET staff_firstname = '$firstName', staff_middlename = '$middleName', staff_lastname = '$lastName', staff_prefix = '$prefix' WHERE staff_id = '$ID'");
    mysqli_query($con, "UPDATE user_table SET user_email = '$email', user_password = '$password' WHERE user_id = '$ID'");
  }
  if(isset($_POST['UpdatePatient'])){
    $ID = $_SESSION['ID'];
    $firstName = $_POST['firstName'];
    $middleName = $_POST['middleName'];
    $lastName = $_POST['lastName'];
    $prefix = $_POST['prefix'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $contact = $_POST['contact'];
    $emContact = $_POST['emContact'];
    mysqli_query($con, "UPDATE patient_table SET patient_first_name = '$firstName', patient_middle_name = '$middleName', patient_last_name = '$lastName', patient_prefix = '$prefix', patient_contact = '$contact', patient_em_contact = '$emContact' WHERE patient_id = '$ID'");
    mysqli_query($con, "UPDATE user_table SET user_email = '$email', user_password = '$password' WHERE user_id = '$ID'");
  }
  
?>