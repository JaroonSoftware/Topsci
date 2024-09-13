<?php
ob_start();
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");
$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    extract($_POST, EXTR_OVERWRITE, "_"); 

    try {  
        $student = null;
        $sql = "SELECT s.student_code as value,CONCAT_WS(' ',s.firstname,s.lastname) as label";
        $sql .= " from courses_student cs left join student s on cs.student_code = s.student_code";        
        $sql .= " where cs.course_id  = :code";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute(['code' => $course ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting student list data error => $error");
        }
        $student = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(array("data"=>$student));
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