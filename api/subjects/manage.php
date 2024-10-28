<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");

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

        // var_dump($_POST);
        echo $sql;
        $sql = "INSERT INTO subjects (`subject_name`, `description`,`created_by`) 
        values (:subject_name,:description,:created_by)";
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 
        
        $stmt->bindParam(":subject_name", $subject_name, PDO::PARAM_STR);
        $stmt->bindParam(":description", $description, PDO::PARAM_STR); 
        $stmt->bindParam(":created_by", $action_user, PDO::PARAM_INT); 
        
        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
           
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("id" => "ok", 'message' => 'เพิ่มครูสำเร็จ')));  

    } else  if ($_SERVER["REQUEST_METHOD"] == "PUT") {
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true);
        extract($_PUT, EXTR_OVERWRITE, "_");

        // ตรวจสอบว่ามี subject_name ซ้ำในระบบหรือไม่ ยกเว้นสำหรับรายการปัจจุบัน
        $checkQuery = "SELECT COUNT(*) FROM subjects WHERE subject_name = :subject_name AND subject_id != :subject_id";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bindParam(':subject_name', $subject_name, PDO::PARAM_STR);
        $checkStmt->bindParam(':subject_id', $subject_id, PDO::PARAM_INT);
        $checkStmt->execute();
        if ($checkStmt->fetchColumn() > 0) {
            http_response_code(409); // Conflict status
            echo json_encode(['message' => 'ชื่อวิชา '.$subject_name.' มีแล้วในระบบ.']);
            exit;
        }

        // เตรียมคำสั่ง SQL สำหรับอัปเดตข้อมูล
        $sql = "
            UPDATE subjects 
            SET
                subject_name = :subject_name,
                description = :description,
                updated_date = :updated_date,
                updated_by = :updated_by
            WHERE subject_id = :subject_id";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $stmt->bindParam(":subject_id", $subject_id, PDO::PARAM_INT);
        $stmt->bindParam(":subject_name", $subject_name, PDO::PARAM_STR);
        $stmt->bindParam(":description", $description, PDO::PARAM_STR);
        $stmt->bindParam(":updated_date", $updated_date, PDO::PARAM_STR);
        $stmt->bindParam(":updated_by", $updated_by, PDO::PARAM_INT);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Update data error => $error[2]");
            exit;
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("updated_date" => $updated_date)));
    } else  if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $code = $_GET["code"];
        $sql = " SELECT a.* ";
        $sql .= " FROM `subjects` as a ";
        $sql .= " where subject_id  = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $res = $stmt->fetch(PDO::FETCH_ASSOC);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => $res));
    }
} catch (PDOException $e) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} finally {
    $conn = null;
}
ob_end_flush();
exit;
