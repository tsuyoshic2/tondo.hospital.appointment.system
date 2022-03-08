<?php
  session_start();
  include_once("../connection.php");
  header('Content-Type: application/json; charset=utf-8');

  if(isset($_SESSION['ID'])){
    $ID = $_SESSION['ID'];
    if($_GET['PATIENT']){
      $data = mysqli_query($con, "SELECT * FROM user_table WHERE user_id = '$ID' AND user_access = 'PATIENT'");
      if($data){
        echo json_encode(array("IsLogged" => True));
      }
    }else if($_GET['STAFF']){
      $data = mysqli_query($con, "SELECT * FROM user_table WHERE user_id = '$ID' AND user_access = 'STAFF'");
      if($data){
        echo json_encode(array("IsLogged" => True));
      }
    }else if($_GET['ADMIN']){
      $data = mysqli_query($con, "SELECT * FROM user_table WHERE user_id = '$ID' AND user_access = 'ADMIN'");
      if($data){
        echo json_encode(array("IsLogged" => True));
      }
    }else if($_GET['DOCTOR']){
      $data = mysqli_query($con, "SELECT * FROM user_table WHERE user_id = '$ID' AND user_access = 'DOCTOR'");
      if($data){
        echo json_encode(array("IsLogged" => True));
      }
    }else{
      echo json_encode(array("IsLogged" => False));
    }
  }else{
    echo json_encode(array("IsLogged" => False));
  }