<?php
ob_start();
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");
$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    extract($_GET, EXTR_OVERWRITE, "_"); 
   
    try {  
        $student = null;
        $sql = "SELECT course_id as value,course_name as label FROM courses where active_status = 'Y'";
        $stmt = $conn->prepare($sql); 
        $stmt->execute();
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => array( "courses" => $courses, "student" => $student )));
    } catch (mysqli_sql_exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally{
        $conn = null;
        
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush(); 
exit; 
?>