<?php
  session_start();
  include_once("../connection.php");
  date_default_timezone_set('Asia/Singapore');
  header('Content-Type: application/json; charset=utf-8');

  if(isset($_GET['checkNotification'])){
    $ID = $_SESSION['ID'];
    $checkNotification = mysqli_num_rows(mysqli_query($con, "SELECT * FROM appointment_table LEFT JOIN notification_table 
    ON appointment_table.appointment_id = notification_table.appointment_id
    WHERE appointment_table.patient_id = '$ID' AND notification_table.notif_status = 'NEW' order by notification_table.notif_time DESC"));

    if($checkNotification > 0){
      echo json_encode(array("hasNotification" => True));
    }
    else{
      echo json_encode(array("hasNotification" => False));
    }
  }

  if(isset($_GET['GetNotification'])){
    $ID = $_SESSION['ID'];
    $checkNotification = mysqli_query($con, "SELECT notification_table.notif_title AS Title, notification_table.notif_status AS NotificationStatus, DATE_FORMAT(notification_table.notif_time, '%M %d, %Y at %h:%i %p') AS TimeReceived 
    FROM appointment_table LEFT JOIN notification_table 
    ON appointment_table.appointment_id = notification_table.appointment_id
    WHERE appointment_table.patient_id = '$ID' ORDER BY notification_table.notif_time DESC limit 6");
    if($checkNotification){
      $sendData = array();
      while($notification = mysqli_fetch_assoc($checkNotification)){
        array_push($sendData,$notification);
      }
      mysqli_query($con, "UPDATE 
                            notification_table 
                          INNER JOIN 
                            appointment_table
                          ON 
                            appointment_table.appointment_id = notification_table.appointment_id
                          SET 
                            notification_table.notif_status = 'OLD' 
                          WHERE 
                            notification_table.notif_status = 'NEW' 
                            AND 
                              appointment_table.patient_id = '$ID'");
      echo json_encode($sendData);
    }
  }
?>