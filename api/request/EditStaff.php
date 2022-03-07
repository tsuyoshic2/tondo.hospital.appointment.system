<?php

  include_once("../connection.php");

  if(isset($_POST['ID'])){
    $ID = $_POST['ID'];
    $firstName = $_POST['firstName'];
    $middleName = $_POST['middleName'];
    $lastName = $_POST['lastName'];
    $prefix = $_POST['prefix'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    mysqli_query($con, "UPDATE user_table SET user_email = '$email', user_password = '$password' WHERE user_id = '$ID'");
    mysqli_query($con, "UPDATE staff_table SET 
    staff_firstname = '$firstName', 
    staff_middlename = '$middleName', 
    staff_lastname = '$lastName',
    staff_prefix = '$prefix'
    WHERE staff_id = '$ID'"
    );
  }
  if(isset($_POST['disable'])){
    $ID = $_POST['disable'];
    mysqli_query($con, "UPDATE user_table SET user_status = 0 WHERE user_id = '$ID'");
  }
  if(isset($_POST['enable'])){
    $ID = $_POST['enable'];
    mysqli_query($con, "UPDATE user_table SET user_status = 1 WHERE user_id ='$ID'");
  }
?>