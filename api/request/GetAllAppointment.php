<?php
  session_start();
  include_once("../connection.php");
  date_default_timezone_set('Asia/Singapore');
  header('Content-Type: application/json; charset=utf-8');

  if(isset($_GET['GetAppointment'])){
    $data = mysqli_query($con, "SELECT 
                appointment_table.appointment_id,
                appointment_table.appointment_date,
                appointment_table.appointment_status,
                CONCAT(patient_table.patient_last_name, ', ', patient_table.patient_first_name, ' ', LEFT(patient_table.patient_middle_name, 1)) AS Fullname
     FROM appointment_table
     INNER JOIN patient_table
     ON appointment_table.patient_id =  patient_table.patient_id WHERE appointment_table.appointment_status = 'PENDING'");
    $sendData = array();

    while($fetchedData = mysqli_fetch_assoc($data)){
      $date = date("M. d, Y \\a\\t h:i:s a", strtotime($fetchedData['appointment_date']));
      $newArray = array("AppointID" => $fetchedData['appointment_id'], 
                        "AppDate" => $date,
                        "AppStatus" => $fetchedData['appointment_status'],
                        "Fullname" => $fetchedData['Fullname']
                      );
      array_push($sendData, $newArray);
    }
    echo json_encode($sendData);
  }
  if(isset($_GET['GetSpecificAppointment'])){
    $ID = $_GET['GetSpecificAppointment'];
    $data = mysqli_query($con, "SELECT 
                appointment_table.appointment_id AS AppointID,
                appointment_table.reason_for_visit AS Reason,
                DATE_FORMAT(appointment_table.appointment_date, '%M %d, %Y at %h:%i %p') AS AppointDate ,
                appointment_table.appointment_status AS appointment_status,
                CONCAT(patient_table.patient_last_name, ', ', patient_table.patient_first_name, ' ', LEFT(patient_table.patient_middle_name, 1)) AS Fullname,
                patient_table.patient_contact AS PatientContact,
                patient_table.patient_em_contact AS EmPatientContact,
                patient_table.patient_gender AS Gender
     FROM appointment_table
     INNER JOIN patient_table
     ON appointment_table.patient_id =  patient_table.patient_id
     INNER JOIN user_table ON appointment_table.patient_id = user_table.user_id WHERE appointment_table.appointment_id = '$ID'");;
    
    echo json_encode(mysqli_fetch_assoc($data));
    
  }
  if(isset($_GET['ArchivedAppointments'])){
    $data = mysqli_query($con, "SELECT 
                appointment_table.appointment_id,
                appointment_table.appointment_date,
                appointment_table.appointment_status,
                CONCAT(patient_table.patient_last_name, ', ', patient_table.patient_first_name, ' ', LEFT(patient_table.patient_middle_name, 1)) AS Fullname
     FROM appointment_table
     INNER JOIN patient_table
     ON appointment_table.patient_id = patient_table.patient_id
     WHERE (appointment_table.appointment_status = 'DECLINED' OR appointment_table.appointment_status = 'APPROVED')");
    $sendData = array();

    while($fetchedData = mysqli_fetch_assoc($data)){
      $date = date("M. d, Y \\a\\t h:i:s a", strtotime($fetchedData['appointment_date']));
      $todate = date("M. d, Y \\a\\t h:i:s a");
      $isExpire = $date <= $todate;
      $newArray = array("AppointID" => $fetchedData['appointment_id'], 
                        "AppDate" => $date,
                        "AppStatus" => $fetchedData['appointment_status'],
                        "Fullname" => $fetchedData['Fullname'],
                        "IsExpired" => $isExpire
                      );
      array_push($sendData, $newArray);
    }
    echo json_encode($sendData);
  }

  if(isset($_GET['GetDoctorAvailableAppointment'])){
    $data = mysqli_query($con, "SELECT 
                appointment_table.appointment_id,
                appointment_table.appointment_date,
                appointment_table.appointment_status,
                CONCAT(patient_table.patient_last_name, ', ', patient_table.patient_first_name, ' ', LEFT(patient_table.patient_middle_name, 1)) AS Fullname
     FROM appointment_table
     INNER JOIN patient_table
     ON appointment_table.patient_id =  patient_table.patient_id WHERE appointment_table.appointment_status = 'APPROVED'");
     $sendData = array();

     while($fetchedData = mysqli_fetch_assoc($data)){
       $date = date("M. d, Y \\a\\t h:i:s a", strtotime($fetchedData['appointment_date']));
       
       $newArray = array("AppointID" => $fetchedData['appointment_id'], 
                         "AppDate" => $date,
                         "AppStatus" => $fetchedData['appointment_status'],
                         "Fullname" => $fetchedData['Fullname']
                       );
       array_push($sendData, $newArray);
     }
     echo json_encode($sendData);
  }
  if(isset($_GET['MyAppointment'])){
    $DocID = $_SESSION['ID'];
    $data = mysqli_query($con, "SELECT 
                appointment_table.appointment_id,
                appointment_table.appointment_date,
                appointment_table.appointment_status,
                CONCAT(patient_table.patient_last_name, ', ', patient_table.patient_first_name, ' ', LEFT(patient_table.patient_middle_name, 1)) AS Fullname
     FROM appointment_table
     INNER JOIN patient_table
     ON appointment_table.patient_id =  patient_table.patient_id WHERE appointment_table.appointment_status = 'APPOINTMENTSET' AND appointment_table.appointment_recommendation = '$DocID'");
     $sendData = array();

     while($fetchedData = mysqli_fetch_assoc($data)){
       $date = date("M. d, Y \\a\\t h:i:s a", strtotime($fetchedData['appointment_date']));
       
       $newArray = array("AppointID" => $fetchedData['appointment_id'], 
                         "AppDate" => $date,
                         "AppStatus" => $fetchedData['appointment_status'],
                         "Fullname" => $fetchedData['Fullname']
                       );
       array_push($sendData, $newArray);
     }
     echo json_encode($sendData);
  }
  if(isset($_GET['AppointmentHistory'])){
    $DocID = $_SESSION['ID'];
    $data = mysqli_query($con, "SELECT 
                appointment_table.appointment_id,
                appointment_table.appointment_date,
                appointment_table.appointment_status,
                CONCAT(patient_table.patient_last_name, ', ', patient_table.patient_first_name, ' ', LEFT(patient_table.patient_middle_name, 1)) AS Fullname,
                record_table.record_timestamp AS ConsultationTime
     FROM appointment_table
     INNER JOIN patient_table
     ON appointment_table.patient_id =  patient_table.patient_id 
     INNER JOIN record_table 
     ON appointment_table.appointment_id = record_table.appointment_id 
     WHERE appointment_table.appointment_status != 'APPOINTMENTSET' 
     AND appointment_table.appointment_status != 'DECLINED' 
     AND appointment_table.appointment_status != 'APPROVED'
     AND record_table.staff_id = '$DocID'");
     $sendData = array();

     while($fetchedData = mysqli_fetch_assoc($data)){
       $date = date("M. d, Y \\a\\t h:i:s a", strtotime($fetchedData['appointment_date']));
       $consultationDate = date("M. d, Y \\a\\t h:i:s a", strtotime($fetchedData['ConsultationTime']));
       
       $newArray = array("AppointID" => $fetchedData['appointment_id'], 
                         "AppDate" => $date,
                         "AppStatus" => $fetchedData['appointment_status'],
                         "Fullname" => $fetchedData['Fullname'],
                         "ConsultationTime" => $consultationDate
                       );
       array_push($sendData, $newArray);
     }
     echo json_encode($sendData);
  }
  if(isset($_GET['GetSpecificAppointmentRecord'])){
    $ID = $_GET['GetSpecificAppointmentRecord'];
    $data = mysqli_query($con, "SELECT 
                appointment_table.appointment_id AS AppointID,
                appointment_table.reason_for_visit AS Reason,
                DATE_FORMAT(appointment_table.appointment_date, '%M %d, %Y at %h:%i %p') AS AppointDate ,
                appointment_table.appointment_status AS appointment_status,
                CONCAT(patient_table.patient_last_name, ', ', patient_table.patient_first_name, ' ', LEFT(patient_table.patient_middle_name, 1)) AS Fullname,
                patient_table.patient_contact AS PatientContact,
                patient_table.patient_em_contact AS EmPatientContact,
                patient_table.patient_gender AS Gender,
                patient_table.patient_id AS PatientID,
                record_table.record_file_path AS FilePath,
                record_table.record_note AS Notes,
                record_table.record_date_uploaded AS DateSubmitted
     FROM appointment_table
     INNER JOIN patient_table
     ON appointment_table.patient_id =  patient_table.patient_id
     INNER JOIN user_table 
     ON appointment_table.patient_id = user_table.user_id 
     INNER JOIN record_table 
     ON appointment_table.appointment_id = record_table.appointment_id WHERE appointment_table.appointment_id = '$ID'");;
    
    echo json_encode(mysqli_fetch_assoc($data));
    
  }

  if(isset($_GET['GetCurrentAppointment'])){
    $ID = $_SESSION['ID'];
    $data = mysqli_query($con, "SELECT 
      DATE_FORMAT(appointment_date, '%M %d, %Y at %h:%i %p') AS AppointDate ,
      appointment_status AS AppointmentStatus,
      appointment_recommendation AS DocID
      FROM appointment_table
      WHERE patient_id = '$ID' AND (appointment_status != 'CONSULTED' AND appointment_status != 'DECLINED')");
    if($data){
      echo json_encode(mysqli_fetch_assoc($data));
    }
  }

  if(isset($_GET['GetAppointmentHistory'])){
    $ID = $_SESSION['ID'];
    $data = mysqli_query($con, "SELECT 
    appointment_table.appointment_id AS AppointID,
      DATE_FORMAT(appointment_table.appointment_date,'%M %d, %Y at %h:%i %p') AS AppointDate,
      appointment_table.appointment_status AS AppointStatus,
      record_table.record_id AS RecordID,
      DATE_FORMAT(record_table.record_timestamp,'%M %d, %Y at %h:%i %p') AS ConsultDate,
      CONCAT('Dr. ', staff_table.staff_firstname, ' ', LEFT(staff_table.staff_middlename,1), ' ', staff_table.staff_lastname) AS DoctorFullname
      FROM appointment_table 
      LEFT JOIN record_table ON appointment_table.appointment_id = record_table.appointment_id
      LEFT JOIN staff_table ON staff_table.staff_id = appointment_table.appointment_recommendation
      WHERE appointment_table.patient_id = '$ID' AND (appointment_table.appointment_status != 'PENDING' AND appointment_table.appointment_status != 'APPOINTMENTSET' AND appointment_table.appointment_status != 'APPROVED') ORDER BY appointment_table.appointment_date DESC");
    if($data){
      $sendData = array();
      while($appointments = mysqli_fetch_assoc($data)){
        array_push($sendData, $appointments);
      }
      echo json_encode($sendData);
    }
  }

  if(isset($_GET['GetRecord'])){
    $RecordID = $_GET['GetRecord'];
    $PatientID = $_SESSION['ID'];
    $data = mysqli_query($con, "SELECT 
    record_table.record_file_path AS RecordURL,
      record_table.record_note AS RecordNote,
      DATE_FORMAT(record_table.record_timestamp,'%M %d, %Y at %h:%i %p') AS ConsultDate,
      DATE_FORMAT(appointment_table.appointment_date,'%M %d, %Y at %h:%i %p') AS AppointmentDate,
      CONCAT('DR. ',staff_table.staff_firstname, ' ', LEFT(staff_table.staff_middlename, 1), ' ', staff_table.staff_lastname, ' ', staff_table.staff_prefix) AS Fullname
  FROM 
    record_table 
  INNER JOIN 
    appointment_table 
      ON 
      appointment_table.appointment_id = record_table.appointment_id
  INNER JOIN 
    staff_table
      ON
      staff_table.staff_id = record_table.staff_id
  WHERE record_id = '$RecordID'");
    if($data){
      echo json_encode(mysqli_fetch_assoc($data));
    }
  }
  if(isset($_GET['test'])){
    echo date("M. d, Y \\a\\t h:i:s a");
  }
?>