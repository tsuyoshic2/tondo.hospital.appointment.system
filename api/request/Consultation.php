<?php
  session_start();
  date_default_timezone_set('Asia/Singapore');
  include_once("../connection.php");
  if(isset($_POST['startConsultation'])){
    $_SESSION['AppointID'] = $_POST['startConsultation'];
  }
  if(isset($_POST['removeSession'])){
    unset($_SESSION['AppointID']);
  }
  if(isset($_FILES['files']) || isset($_POST['CompleteConsultation'])){
    $sendArray = array();
    $recordNotes = $_POST['Notes'];
    $AppointID = $_SESSION['AppointID'];
    $ID = $_SESSION['ID'];
    if(isset($_FILES['files'])){
      $countfiles = count($_FILES['files']['name']);
      if($countfiles > 0){
        // Upload directory
        $upload_location = "../../uploads/documents/";
        // Loop all files
        for($index = 0;$index < $countfiles;$index++){
    
            if(isset($_FILES['files']['name'][$index]) && $_FILES['files']['name'][$index] != ''){
                // File name
                $filename = date("YmdHis") . "-" .$_FILES['files']['name'][$index];
    
                // Get extension
                $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
                // Valid image extension
                $valid_ext = array("png","jpeg","jpg","pdf");
    
                // Check extension
                if(in_array($ext, $valid_ext)){
    
                    // File path
                    $path = $upload_location.$filename;
    
                    // Upload file
                    if(move_uploaded_file($_FILES['files']['tmp_name'][$index],$path)){
                        array_push($sendArray, $filename);
                    }
                }
            }
        }
      }
    }
    $dateToday = date("Y-m-d H:i:s");
    $processData = json_encode($sendArray);
    mysqli_query($con, "INSERT INTO record_table (appointment_id, staff_id, record_file_path, record_note, record_date_uploaded) VALUES ('$AppointID', '$ID', '$processData', '$recordNotes', '$dateToday')");
    mysqli_query($con, "INSERT INTO notification_table (notif_title, appointment_id, notif_status) VALUES ('Diagnosis Complete', '$AppointID', 'NEW')");
    mysqli_query($con, "UPDATE appointment_table SET appointment_status = 'CONSULTED' WHERE appointment_id = '$AppointID'");
  }

?>