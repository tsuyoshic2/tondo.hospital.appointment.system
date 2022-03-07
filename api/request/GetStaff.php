<?php
  include_once("../connection.php");
  header('Content-Type: application/json; charset=utf-8');
  if(isset($_GET['GetStaff'])){
    $data = mysqli_query($con, "SELECT 
    user_table.user_id AS ID , 
    user_table.user_email AS Email,
    user_table.user_password AS UserPassword,
    user_table.user_status AS UserStatus,
    CONCAT(staff_table.staff_lastname, ', ', staff_table.staff_firstname, ' ', LEFT(staff_table.staff_middlename, 1)) AS Fullname, 
    staff_table.staff_firstname AS Firstname, 
    staff_table.staff_middlename AS Middlename, 
    staff_table.staff_lastname AS Lastname, 
    staff_table.staff_role AS UserRole 
    FROM user_table 
    INNER JOIN staff_table 
    ON user_table.user_id = staff_table.staff_id WHERE user_table.user_access = 'STAFF' ORDER BY user_table.user_id DESC");
  
    $sendData = array();
  
    while($SuchData = mysqli_fetch_assoc($data)){
      array_push($sendData,$SuchData);
    }
    echo json_encode($sendData);
  }
  else if(isset($_GET['GetSpecificStaff']))
  {
    $ID = $_GET['GetSpecificStaff'];
    echo json_encode(mysqli_fetch_assoc(mysqli_query($con, "SELECT 
    user_table.user_email AS Email,
    user_table.user_password AS UserPassword,
    staff_table.staff_firstname AS Firstname, 
    staff_table.staff_middlename AS Middlename, 
    staff_table.staff_lastname AS Lastname, 
    staff_table.staff_prefix AS Prefix,
    staff_table.staff_role AS UserRole 
    FROM user_table 
    INNER JOIN staff_table 
    ON user_table.user_id = staff_table.staff_id 
    WHERE user_table.user_access = 'STAFF' AND user_table.user_id = '$ID'")));
  }
  else if($_GET['GetDoctor']){
    $ID = $_GET['GetDoctor'];
    echo json_encode(mysqli_fetch_assoc(mysqli_query($con, " SELECT CONCAT('DR. ', staff_firstname, ' ', LEFT(staff_middlename, 1), ' ', staff_lastname, ' ',staff_prefix) AS Fullname
    FROM  staff_table 
    WHERE staff_id = '$ID'")));
  }