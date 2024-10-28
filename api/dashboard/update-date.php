<?php 
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");

$db = new DbConnect;
$conn = $db->connect();
$conn->beginTransaction();
http_response_code(400);
try {
    $action_date = date("Y-m-d H:i:s"); 
    $action_user = $token->userid;
    // echo $action_user;

    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true); 
        extract($_POST, EXTR_OVERWRITE, "_");

        // update
        $sql = "
        update attendance 
        set
        attendance_date = :dates
        where attendance_id = :attendance_id";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Update data error => {$conn->errorInfo()}"); 
        //Update Date
            if (!empty($sessionDates)) {
                $sessionDates = (new DateTime($sessionDates))->format('Y-m-d');
            } else {
                $sessionDates = null; // กรณีที่ไม่มีวันที่
            }
            $stmt->bindParam(":dates", $sessionDates, PDO::PARAM_STR);
            $stmt->bindParam(":attendance_id", $attendanceId, PDO::PARAM_INT);
            
            if(!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Update date data error => $error"); 
            }
    
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("date update" => $sessionDates)));

    }

} catch (PDOException $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} catch (Exception $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} finally{
    $conn = null;
}  
ob_end_flush(); 
exit;