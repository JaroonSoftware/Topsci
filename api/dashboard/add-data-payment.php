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

    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true); 
        extract($_POST, EXTR_OVERWRITE, "_");
        $payment = (object)$payment; 
        if (!empty($payment->payment_date)) {
            $date = new DateTime($payment->payment_date, new DateTimeZone('UTC'));
            $date->setTimezone(new DateTimeZone('Asia/Bangkok'));
            $paymentDate = $date->format('Y-m-d H:i:s'); 
        } else {
            $paymentDate = null;
        }
        // insert payment
        $sql = "INSERT INTO `payments`(`course_id`, `student_code`, `payment_date`, `amount_paid`, `payment_method`)  
        values (:course_id,:student_code,:payment_date,:amount_paid,:payment_method)";
        echo $sql;
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("payment data value prepare error => {$conn->errorInfo()}");   
        $payment_date = new DateTime($payment_date);
        $stmt->bindParam(":course_id", $payment->course, PDO::PARAM_INT);
        $stmt->bindParam(":student_code", $payment->student_code, PDO::PARAM_INT);
        $stmt->bindParam(":amount_paid", $payment->amount_paid, PDO::PARAM_INT);
        $stmt->bindParam(":payment_date", $paymentDate, PDO::PARAM_STR);
        $stmt->bindParam(":payment_method", $payment->payment_method, PDO::PARAM_STR);

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert Payment data error => $error");
            die;
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => '0'));
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