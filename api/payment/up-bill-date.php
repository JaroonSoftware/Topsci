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

        try {
            $checkSql = "
                SELECT bill_date 
                FROM payments 
                WHERE payment_id = :payment_id 
                AND student_code = :student_code
            ";
            $checkStmt = $conn->prepare($checkSql);
            if (!$checkStmt) throw new PDOException("Error preparing check statement: {$conn->errorInfo()}");
        
            $checkStmt->bindParam(":payment_id", $payment_id, PDO::PARAM_INT);
            $checkStmt->bindParam(":student_code", $student_code, PDO::PARAM_INT);
            $checkStmt->execute();
            $currentBillDate = $checkStmt->fetchColumn();

            if (!empty($bill_date)) {
                $newBillDate = (new DateTime($bill_date))->format('Y-m-d');
            } else {
                $newBillDate = null;
            }

            if ($currentBillDate === $newBillDate) {
                $conn->commit();
                http_response_code(200);
                echo json_encode(array("message" => "No changes detected", "date" => $currentBillDate));
                exit;
            }

            $sql = "
                UPDATE payments 
                SET bill_date = :dates,
                    updated_by = :updated_by,
                    updated_date = :updated_date
                WHERE payment_id = :payment_id 
                AND student_code = :student_code
            ";
            
            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Update data error => {$conn->errorInfo()}");
        
            $stmt->bindParam(":dates", $newBillDate, PDO::PARAM_STR);
            $stmt->bindParam(":payment_id", $payment_id, PDO::PARAM_INT);
            $stmt->bindParam(":student_code", $student_code, PDO::PARAM_INT);
            $stmt->bindParam(":updated_by", $action_user, PDO::PARAM_STR);
            $stmt->bindParam(":updated_date", $action_date, PDO::PARAM_STR);
        
            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Update payment date error => $error");
            }
        
            $conn->commit();
            http_response_code(200);
            echo json_encode(array("data" => array("date updated" => $newBillDate)));
        
        } catch (Exception $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(array("error" => $e->getMessage()));
        }

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