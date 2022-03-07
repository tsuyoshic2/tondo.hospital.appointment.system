<?php

  include_once("../connection.php");

  if(isset($_POST['email'])){
    $firstName = $_POST['firstName'];
    $middleName = $_POST['middleName'];
    $lastName = $_POST['lastName'];
    $prefix = $_POST['prefix'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    mysqli_query($con, "INSERT INTO user_table (user_email, user_password, user_access) VALUES
                  ('$email', '$password' , 'STAFF')");
    $currentId = mysqli_insert_id($con);

    mysqli_query($con, "INSERT INTO staff_table (staff_id,staff_firstname, staff_middlename, staff_lastname, staff_prefix, staff_role)
      VALUES ('$currentId','$firstName', '$middleName', '$lastName', '$prefix', 'STAFF')"); 

  }